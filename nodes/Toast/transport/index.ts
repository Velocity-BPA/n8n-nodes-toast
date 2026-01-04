/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	IPollFunctions,
	IWebhookFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export interface ToastApiCredentials {
	clientId: string;
	clientSecret: string;
	environment: 'production' | 'sandbox';
	apiHostname: string;
	restaurantExternalId?: string;
}

export interface ToastApiResponse {
	data?: IDataObject | IDataObject[];
	nextPageToken?: string;
	totalCount?: number;
}

interface TokenCache {
	accessToken: string;
	expiresAt: number;
}

// Token cache to avoid re-authenticating on every request
const tokenCache = new Map<string, TokenCache>();

/**
 * Get OAuth access token for Toast API
 */
export async function getAccessToken(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions | IWebhookFunctions,
	credentials: ToastApiCredentials,
): Promise<string> {
	const cacheKey = `${credentials.clientId}:${credentials.apiHostname}`;
	const cached = tokenCache.get(cacheKey);

	// Return cached token if still valid (with 5 minute buffer)
	if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
		return cached.accessToken;
	}

	const tokenUrl = `https://${credentials.apiHostname}/authentication/v1/authentication/login`;

	try {
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				clientId: credentials.clientId,
				clientSecret: credentials.clientSecret,
				userAccessType: 'TOAST_MACHINE_CLIENT',
			},
			json: true,
		});

		const accessToken = response.token?.accessToken || response.accessToken;
		const expiresIn = response.token?.expiresIn || response.expiresIn || 3600;

		if (!accessToken) {
			throw new NodeOperationError(
				this.getNode(),
				'Failed to obtain access token from Toast API',
			);
		}

		// Cache the token
		tokenCache.set(cacheKey, {
			accessToken,
			expiresAt: Date.now() + expiresIn * 1000,
		});

		return accessToken;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to authenticate with Toast API',
		});
	}
}

/**
 * Make an authenticated request to the Toast API
 */
export async function toastApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	restaurantGuid?: string,
): Promise<IDataObject | IDataObject[]> {
	const credentials = (await this.getCredentials('toastApi')) as unknown as ToastApiCredentials;
	const accessToken = await getAccessToken.call(this, credentials);

	const baseUrl = `https://${credentials.apiHostname}`;

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		json: true,
	};

	// Add restaurant GUID header if provided
	if (restaurantGuid) {
		options.headers!['Toast-Restaurant-External-ID'] = restaurantGuid;
	}

	if (Object.keys(qs || {}).length > 0) {
		options.qs = qs;
	}

	if (body && Object.keys(body).length > 0) {
		options.body = body;
	}

	try {
		const response = await this.helpers.httpRequest(options);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: `Toast API request failed: ${(error as Error).message}`,
		});
	}
}

/**
 * Make paginated API requests
 */
export async function toastApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	restaurantGuid?: string,
	limit?: number,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let pageToken: string | undefined;
	const pageSize = 100;

	do {
		const queryParams: IDataObject = {
			...qs,
			pageSize,
		};

		if (pageToken) {
			queryParams.pageToken = pageToken;
		}

		const response = (await toastApiRequest.call(
			this,
			method,
			endpoint,
			body,
			queryParams,
			restaurantGuid,
		)) as ToastApiResponse;

		// Handle array response directly
		if (Array.isArray(response)) {
			returnData.push(...response);
		} else if (response.data) {
			// Handle wrapped response
			const items = Array.isArray(response.data) ? response.data : [response.data];
			returnData.push(...items);
		} else {
			// Handle single object response
			returnData.push(response as IDataObject);
		}

		pageToken = (response as ToastApiResponse).nextPageToken;

		// Check if we've hit the limit
		if (limit && returnData.length >= limit) {
			return returnData.slice(0, limit);
		}
	} while (pageToken);

	return returnData;
}

/**
 * Format output as n8n execution data
 */
export function formatOutput(items: IDataObject | IDataObject[]): INodeExecutionData[] {
	const itemsArray = Array.isArray(items) ? items : [items];
	return itemsArray.map((item) => ({
		json: item,
	}));
}

/**
 * Parse JSON string safely
 */
export function parseJson(jsonString: string, fieldName: string): IDataObject {
	try {
		const parsed = JSON.parse(jsonString);
		if (typeof parsed !== 'object' || parsed === null) {
			throw new Error('Parsed value is not an object');
		}
		return parsed as IDataObject;
	} catch {
		throw new Error(`Invalid JSON in field "${fieldName}": ${jsonString}`);
	}
}

/**
 * Build date range query parameters
 */
export function buildDateRangeParams(
	startDate?: string,
	endDate?: string,
): IDataObject {
	const params: IDataObject = {};

	if (startDate) {
		params.startDate = new Date(startDate).toISOString();
	}

	if (endDate) {
		params.endDate = new Date(endDate).toISOString();
	}

	return params;
}

/**
 * Log licensing notice (called once per node load)
 */
let licensingNoticeLogged = false;

export function logLicensingNotice(): void {
	if (!licensingNoticeLogged) {
		console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
		licensingNoticeLogged = true;
	}
}
