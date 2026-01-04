/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject, INodeExecutionData } from 'n8n-workflow';

/**
 * Validate required parameters
 */
export function validateRequiredParams(
	params: Record<string, unknown>,
	required: string[],
): void {
	const missing: string[] = [];

	for (const param of required) {
		if (params[param] === undefined || params[param] === null || params[param] === '') {
			missing.push(param);
		}
	}

	if (missing.length > 0) {
		throw new Error(`Missing required parameters: ${missing.join(', ')}`);
	}
}

/**
 * Format ISO date string
 */
export function formatIsoDate(date: string | Date): string {
	if (date instanceof Date) {
		return date.toISOString();
	}
	return new Date(date).toISOString();
}

/**
 * Parse Toast business date format (YYYYMMDD)
 */
export function parseBusinessDate(dateString: string): Date {
	const year = parseInt(dateString.substring(0, 4), 10);
	const month = parseInt(dateString.substring(4, 6), 10) - 1;
	const day = parseInt(dateString.substring(6, 8), 10);
	return new Date(year, month, day);
}

/**
 * Format date as Toast business date (YYYYMMDD)
 */
export function formatBusinessDate(date: Date | string): string {
	const d = date instanceof Date ? date : new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${year}${month}${day}`;
}

/**
 * Convert amount from cents to dollars
 */
export function centsToDollars(cents: number): number {
	return cents / 100;
}

/**
 * Convert amount from dollars to cents
 */
export function dollarsToCents(dollars: number): number {
	return Math.round(dollars * 100);
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends IDataObject>(target: T, source: IDataObject): T {
	const output = { ...target } as T;

	for (const key of Object.keys(source)) {
		const sourceValue = source[key];
		const targetValue = target[key as keyof T];

		if (
			sourceValue !== null &&
			typeof sourceValue === 'object' &&
			!Array.isArray(sourceValue) &&
			targetValue !== null &&
			typeof targetValue === 'object' &&
			!Array.isArray(targetValue)
		) {
			(output as IDataObject)[key] = deepMerge(
				targetValue as IDataObject,
				sourceValue as IDataObject,
			);
		} else {
			(output as IDataObject)[key] = sourceValue;
		}
	}

	return output;
}

/**
 * Remove undefined values from object
 */
export function removeUndefined<T extends IDataObject>(obj: T): T {
	const result = {} as T;

	for (const [key, value] of Object.entries(obj)) {
		if (value !== undefined) {
			(result as IDataObject)[key] = value;
		}
	}

	return result;
}

/**
 * Create execution data from response
 */
export function createExecutionData(data: IDataObject | IDataObject[]): INodeExecutionData[] {
	const items = Array.isArray(data) ? data : [data];
	return items.map((item) => ({ json: item }));
}

/**
 * Extract GUID from Toast entity
 */
export function extractGuid(entity: IDataObject): string | undefined {
	return (entity.guid || entity.id || entity.externalId) as string | undefined;
}

/**
 * Validate GUID format
 */
export function isValidGuid(guid: string): boolean {
	const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return guidRegex.test(guid);
}

/**
 * Build query string from object
 */
export function buildQueryString(params: IDataObject): string {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.append(key, String(value));
		}
	}

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : '';
}

/**
 * Parse webhook signature for verification
 */
export function parseWebhookSignature(signature: string): {
	algorithm: string;
	signature: string;
} {
	const parts = signature.split('=');
	return {
		algorithm: parts[0] || 'sha256',
		signature: parts[1] || signature,
	};
}

/**
 * Toast order status enum
 */
export const OrderStatus = {
	OPEN: 'OPEN',
	CLOSED: 'CLOSED',
	DELETED: 'DELETED',
	VOIDED: 'VOIDED',
} as const;

/**
 * Toast payment status enum
 */
export const PaymentStatus = {
	OPEN: 'OPEN',
	PAID: 'PAID',
	VOIDED: 'VOIDED',
	REFUNDED: 'REFUNDED',
} as const;

/**
 * Toast dining option enum
 */
export const DiningOption = {
	DINE_IN: 'DINE_IN',
	TAKE_OUT: 'TAKE_OUT',
	DELIVERY: 'DELIVERY',
	PICKUP: 'PICKUP',
} as const;

/**
 * Toast table status enum
 */
export const TableStatus = {
	AVAILABLE: 'AVAILABLE',
	OCCUPIED: 'OCCUPIED',
	RESERVED: 'RESERVED',
	DIRTY: 'DIRTY',
} as const;
