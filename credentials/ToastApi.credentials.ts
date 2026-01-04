/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class ToastApi implements ICredentialType {
	name = 'toastApi';
	displayName = 'Toast API';
	documentationUrl = 'https://doc.toasttab.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'The client ID from your Toast partner application',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The client secret from your Toast partner application',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
			description: 'Select the Toast environment',
		},
		{
			displayName: 'API Hostname',
			name: 'apiHostname',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'ws-api.toasttab.com',
			description: 'The API hostname provided by Toast (e.g., ws-api.toasttab.com for production)',
		},
		{
			displayName: 'Restaurant External ID',
			name: 'restaurantExternalId',
			type: 'string',
			default: '',
			description: 'Optional default restaurant external ID to use for API calls',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const apiHostname = credentials.apiHostname as string;
		const tokenUrl = `https://${apiHostname}/authentication/v1/authentication/login`;

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

		return {
			accessToken: response.token?.accessToken || response.accessToken,
			tokenExpiry: response.token?.expiresIn || response.expiresIn,
		};
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.apiHostname}}',
			url: '/restaurants/v1/restaurants',
			method: 'GET',
		},
	};
}
