/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { createHmac } from 'crypto';

import { logLicensingNotice } from './transport';

export class ToastTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toast Trigger',
		name: 'toastTrigger',
		icon: 'file:toast.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Trigger workflows on Toast POS events via webhooks',
		defaults: {
			name: 'Toast Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'toastApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Check Closed',
						value: 'checkClosed',
						description: 'Triggered when a check is closed',
					},
					{
						name: 'Check Created',
						value: 'checkCreated',
						description: 'Triggered when a new check is created',
					},
					{
						name: 'Employee Clocked In',
						value: 'employeeClockedIn',
						description: 'Triggered when an employee clocks in',
					},
					{
						name: 'Employee Clocked Out',
						value: 'employeeClockedOut',
						description: 'Triggered when an employee clocks out',
					},
					{
						name: 'Guest Created',
						value: 'guestCreated',
						description: 'Triggered when a guest profile is created',
					},
					{
						name: 'Inventory Low',
						value: 'inventoryLow',
						description: 'Triggered when inventory falls below threshold',
					},
					{
						name: 'Menu Item Updated',
						value: 'menuItemUpdated',
						description: 'Triggered when a menu item is changed',
					},
					{
						name: 'Order Completed',
						value: 'orderCompleted',
						description: 'Triggered when an order is fulfilled',
					},
					{
						name: 'Order Created',
						value: 'orderCreated',
						description: 'Triggered when a new order is created',
					},
					{
						name: 'Order Paid',
						value: 'orderPaid',
						description: 'Triggered when an order payment is completed',
					},
					{
						name: 'Payment Processed',
						value: 'paymentProcessed',
						description: 'Triggered when a payment is processed',
					},
				],
				default: 'orderCreated',
				required: true,
				description: 'The event to listen for',
			},
			{
				displayName: 'Restaurant GUID',
				name: 'restaurantGuid',
				type: 'string',
				default: '',
				description: 'Optional: Filter events to a specific restaurant GUID',
			},
			{
				displayName: 'Webhook Secret',
				name: 'webhookSecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret key for verifying webhook signatures from Toast',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify the webhook signature',
					},
					{
						displayName: 'Include Raw Body',
						name: 'includeRawBody',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw request body in the output',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Log licensing notice
				logLicensingNotice();

				// Toast webhooks are configured externally in the Toast Partner portal
				// This method returns true to indicate the webhook is assumed to be configured
				// The actual webhook URL should be copied from n8n and configured in Toast
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Log licensing notice
				logLicensingNotice();

				// Toast webhooks are configured in the Toast Partner portal
				// Return true to indicate setup is complete on n8n side
				const webhookUrl = this.getNodeWebhookUrl('default');
				console.log(`Toast webhook URL to configure in Toast Partner portal: ${webhookUrl}`);
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Toast webhooks must be removed from the Toast Partner portal
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		// Log licensing notice
		logLicensingNotice();

		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;

		const event = this.getNodeParameter('event') as string;
		const restaurantGuid = this.getNodeParameter('restaurantGuid', '') as string;
		const webhookSecret = this.getNodeParameter('webhookSecret', '') as string;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Verify webhook signature if enabled and secret is provided
		if (options.verifySignature !== false && webhookSecret) {
			const signature = headers['toast-signature'] || headers['x-toast-signature'];

			if (signature) {
				const rawBody = req.rawBody?.toString() || JSON.stringify(body);
				const expectedSignature = createHmac('sha256', webhookSecret)
					.update(rawBody)
					.digest('hex');

				const receivedSig = String(signature).replace('sha256=', '');

				if (receivedSig !== expectedSignature) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Invalid signature' },
						},
					};
				}
			}
		}

		// Extract event type from webhook payload
		const webhookEventType = body.eventType as string || body.type as string || '';

		// Map Toast event types to our event names
		const eventTypeMap: Record<string, string> = {
			'ORDER_CREATED': 'orderCreated',
			'ORDER_PAID': 'orderPaid',
			'ORDER_COMPLETED': 'orderCompleted',
			'CHECK_CREATED': 'checkCreated',
			'CHECK_CLOSED': 'checkClosed',
			'PAYMENT_PROCESSED': 'paymentProcessed',
			'MENU_ITEM_UPDATED': 'menuItemUpdated',
			'EMPLOYEE_CLOCKED_IN': 'employeeClockedIn',
			'EMPLOYEE_CLOCKED_OUT': 'employeeClockedOut',
			'GUEST_CREATED': 'guestCreated',
			'INVENTORY_LOW': 'inventoryLow',
		};

		const mappedEventType = eventTypeMap[webhookEventType] || webhookEventType.toLowerCase();

		// Check if this event matches the configured event
		if (mappedEventType !== event) {
			// Return 200 but don't trigger the workflow
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, filtered: true },
				},
			};
		}

		// Filter by restaurant GUID if specified
		if (restaurantGuid) {
			const restaurant = body.restaurant as IDataObject | undefined;
			const payloadRestaurantGuid = body.restaurantGuid as string || restaurant?.guid as string;
			if (payloadRestaurantGuid && payloadRestaurantGuid !== restaurantGuid) {
				return {
					webhookResponse: {
						status: 200,
						body: { received: true, filtered: true },
					},
				};
			}
		}

		// Build output data
		const outputData: IDataObject = {
			...body,
			_webhookData: {
				event,
				receivedAt: new Date().toISOString(),
				headers: {
					contentType: headers['content-type'],
					toastSignature: headers['toast-signature'] || headers['x-toast-signature'],
				},
			},
		};

		// Include raw body if requested
		if (options.includeRawBody) {
			outputData._rawBody = req.rawBody?.toString();
		}

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
		};
	}
}
