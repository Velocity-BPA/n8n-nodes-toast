/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

// Common fields used across multiple resources
export const restaurantGuidField: INodeProperties = {
	displayName: 'Restaurant GUID',
	name: 'restaurantGuid',
	type: 'string',
	required: true,
	default: '',
	description: 'The GUID of the restaurant',
};

export const guidField: INodeProperties = {
	displayName: 'GUID',
	name: 'guid',
	type: 'string',
	required: true,
	default: '',
	description: 'The unique identifier',
};

export const paginationFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Page Token',
		name: 'pageToken',
		type: 'string',
		default: '',
		description: 'Token for pagination',
	},
];

export const dateRangeFields: INodeProperties[] = [
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		description: 'Start date for the query',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		description: 'End date for the query',
	},
];

// Restaurant Fields
export const restaurantFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['restaurants'],
				operation: ['getRestaurant', 'getRestaurantInfo'],
			},
		},
	},
];

// Order Fields
export const orderFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['orders'],
			},
		},
	},
	{
		displayName: 'Order GUID',
		name: 'orderGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the order',
		displayOptions: {
			show: {
				resource: ['orders'],
				operation: ['getOrder', 'updateOrder', 'addOrderItem', 'removeOrderItem', 'voidOrder', 'getOrderHistory'],
			},
		},
	},
	{
		displayName: 'Order Data',
		name: 'orderData',
		type: 'json',
		default: '{}',
		description: 'The order data as JSON',
		displayOptions: {
			show: {
				resource: ['orders'],
				operation: ['createOrder', 'updateOrder'],
			},
		},
	},
	{
		displayName: 'Item GUID',
		name: 'itemGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the menu item',
		displayOptions: {
			show: {
				resource: ['orders'],
				operation: ['addOrderItem', 'removeOrderItem'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		default: 1,
		description: 'Quantity of items',
		displayOptions: {
			show: {
				resource: ['orders'],
				operation: ['addOrderItem'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['orders'],
				operation: ['listOrders', 'getOrdersByDateRange'],
			},
		},
		options: [
			{
				displayName: 'Business Date',
				name: 'businessDate',
				type: 'dateTime',
				default: '',
				description: 'Filter by business date',
			},
			{
				displayName: 'Order Status',
				name: 'orderStatus',
				type: 'options',
				options: [
					{ name: 'Open', value: 'OPEN' },
					{ name: 'Closed', value: 'CLOSED' },
					{ name: 'Deleted', value: 'DELETED' },
					{ name: 'Voided', value: 'VOIDED' },
				],
				default: 'OPEN',
				description: 'Filter by order status',
			},
			...paginationFields,
			...dateRangeFields,
		],
	},
];

// Check Fields
export const checkFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['checks'],
			},
		},
	},
	{
		displayName: 'Check GUID',
		name: 'checkGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the check',
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['getCheck', 'updateCheck', 'applyDiscount', 'removeDiscount', 'applyServiceCharge', 'printCheck', 'closeCheck'],
			},
		},
	},
	{
		displayName: 'Order GUID',
		name: 'orderGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the order to create check for',
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['createCheck'],
			},
		},
	},
	{
		displayName: 'Check Data',
		name: 'checkData',
		type: 'json',
		default: '{}',
		description: 'The check data as JSON',
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['createCheck', 'updateCheck'],
			},
		},
	},
	{
		displayName: 'Discount GUID',
		name: 'discountGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the discount',
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['applyDiscount', 'removeDiscount'],
			},
		},
	},
	{
		displayName: 'Service Charge GUID',
		name: 'serviceChargeGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the service charge',
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['applyServiceCharge'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['checks'],
				operation: ['listChecks'],
			},
		},
		options: [...paginationFields],
	},
];

// Payment Fields
export const paymentFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['payments'],
			},
		},
	},
	{
		displayName: 'Payment GUID',
		name: 'paymentGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the payment',
		displayOptions: {
			show: {
				resource: ['payments'],
				operation: ['getPayment', 'voidPayment', 'refundPayment'],
			},
		},
	},
	{
		displayName: 'Check GUID',
		name: 'checkGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the check',
		displayOptions: {
			show: {
				resource: ['payments'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Payment Data',
		name: 'paymentData',
		type: 'json',
		default: '{}',
		description: 'The payment data as JSON',
		displayOptions: {
			show: {
				resource: ['payments'],
				operation: ['createPayment'],
			},
		},
	},
	{
		displayName: 'Refund Amount',
		name: 'refundAmount',
		type: 'number',
		default: 0,
		description: 'Amount to refund',
		displayOptions: {
			show: {
				resource: ['payments'],
				operation: ['refundPayment'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payments'],
				operation: ['listPayments', 'getTips'],
			},
		},
		options: [...paginationFields, ...dateRangeFields],
	},
];

// Menu Fields
export const menuFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['menu'],
			},
		},
	},
	{
		displayName: 'Menu Item GUID',
		name: 'menuItemGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the menu item',
		displayOptions: {
			show: {
				resource: ['menu'],
				operation: ['getMenuItem', 'getMenuImages'],
			},
		},
	},
	{
		displayName: 'Menu Group GUID',
		name: 'menuGroupGuid',
		type: 'string',
		default: '',
		description: 'Filter by menu group GUID',
		displayOptions: {
			show: {
				resource: ['menu'],
				operation: ['getMenuItems'],
			},
		},
	},
	{
		displayName: 'Modifier Group GUID',
		name: 'modifierGroupGuid',
		type: 'string',
		default: '',
		description: 'Filter by modifier group GUID',
		displayOptions: {
			show: {
				resource: ['menu'],
				operation: ['getModifiers'],
			},
		},
	},
];

// Menu Management Fields
export const menuManagementFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['menuManagement'],
			},
		},
	},
	{
		displayName: 'Menu Item GUID',
		name: 'menuItemGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the menu item',
		displayOptions: {
			show: {
				resource: ['menuManagement'],
				operation: ['updateMenuItem', 'deleteMenuItem'],
			},
		},
	},
	{
		displayName: 'Menu Item Data',
		name: 'menuItemData',
		type: 'json',
		default: '{}',
		description: 'The menu item data as JSON',
		displayOptions: {
			show: {
				resource: ['menuManagement'],
				operation: ['createMenuItem', 'updateMenuItem'],
			},
		},
	},
	{
		displayName: 'Modifier GUID',
		name: 'modifierGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the modifier',
		displayOptions: {
			show: {
				resource: ['menuManagement'],
				operation: ['updateModifier'],
			},
		},
	},
	{
		displayName: 'Modifier Data',
		name: 'modifierData',
		type: 'json',
		default: '{}',
		description: 'The modifier data as JSON',
		displayOptions: {
			show: {
				resource: ['menuManagement'],
				operation: ['createModifier', 'updateModifier'],
			},
		},
	},
	{
		displayName: 'Pricing Data',
		name: 'pricingData',
		type: 'json',
		default: '{}',
		description: 'The pricing data as JSON',
		displayOptions: {
			show: {
				resource: ['menuManagement'],
				operation: ['updatePricing'],
			},
		},
	},
];

// Inventory Fields
export const inventoryFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['inventory'],
			},
		},
	},
	{
		displayName: 'Inventory Item GUID',
		name: 'inventoryItemGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the inventory item',
		displayOptions: {
			show: {
				resource: ['inventory'],
				operation: ['updateInventoryQuantity', 'updateInventoryItem'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		default: 0,
		description: 'The new quantity',
		displayOptions: {
			show: {
				resource: ['inventory'],
				operation: ['updateInventoryQuantity'],
			},
		},
	},
	{
		displayName: 'Inventory Item Data',
		name: 'inventoryItemData',
		type: 'json',
		default: '{}',
		description: 'The inventory item data as JSON',
		displayOptions: {
			show: {
				resource: ['inventory'],
				operation: ['createInventoryItem', 'updateInventoryItem'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['inventory'],
				operation: ['getInventory', 'getInventoryItems', 'getVendors', 'getPurchaseOrders'],
			},
		},
		options: [...paginationFields],
	},
];

// Labor Fields
export const laborFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['labor'],
			},
		},
	},
	{
		displayName: 'Employee GUID',
		name: 'employeeGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the employee',
		displayOptions: {
			show: {
				resource: ['labor'],
				operation: ['getEmployee', 'updateEmployee', 'deleteEmployee', 'clockIn', 'clockOut'],
			},
		},
	},
	{
		displayName: 'Employee Data',
		name: 'employeeData',
		type: 'json',
		default: '{}',
		description: 'The employee data as JSON',
		displayOptions: {
			show: {
				resource: ['labor'],
				operation: ['createEmployee', 'updateEmployee'],
			},
		},
	},
	{
		displayName: 'Shift Data',
		name: 'shiftData',
		type: 'json',
		default: '{}',
		description: 'The shift data as JSON',
		displayOptions: {
			show: {
				resource: ['labor'],
				operation: ['createShift'],
			},
		},
	},
	{
		displayName: 'Job GUID',
		name: 'jobGuid',
		type: 'string',
		default: '',
		description: 'The GUID of the job for clock in/out',
		displayOptions: {
			show: {
				resource: ['labor'],
				operation: ['clockIn', 'clockOut'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['labor'],
				operation: ['listEmployees', 'getTimeEntries', 'getShifts', 'getBreaks', 'getLaborCosts'],
			},
		},
		options: [...paginationFields, ...dateRangeFields],
	},
];

// Customer Fields
export const customerFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['customers'],
			},
		},
	},
	{
		displayName: 'Guest GUID',
		name: 'guestGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the guest',
		displayOptions: {
			show: {
				resource: ['customers'],
				operation: ['getGuest', 'updateGuest', 'getGuestHistory', 'getGuestLoyalty'],
			},
		},
	},
	{
		displayName: 'Guest Data',
		name: 'guestData',
		type: 'json',
		default: '{}',
		description: 'The guest data as JSON',
		displayOptions: {
			show: {
				resource: ['customers'],
				operation: ['createGuest', 'updateGuest'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['customers'],
				operation: ['listGuests', 'getGuestHistory'],
			},
		},
		options: [...paginationFields],
	},
];

// Loyalty Fields
export const loyaltyFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['loyalty'],
			},
		},
	},
	{
		displayName: 'Account GUID',
		name: 'accountGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the loyalty account',
		displayOptions: {
			show: {
				resource: ['loyalty'],
				operation: ['getLoyaltyTransactions', 'addLoyaltyPoints', 'redeemLoyaltyReward'],
			},
		},
	},
	{
		displayName: 'Points',
		name: 'points',
		type: 'number',
		required: true,
		default: 0,
		description: 'Number of points to add',
		displayOptions: {
			show: {
				resource: ['loyalty'],
				operation: ['addLoyaltyPoints'],
			},
		},
	},
	{
		displayName: 'Reward GUID',
		name: 'rewardGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the reward to redeem',
		displayOptions: {
			show: {
				resource: ['loyalty'],
				operation: ['redeemLoyaltyReward'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['loyalty'],
				operation: ['getLoyaltyAccounts', 'getLoyaltyTransactions'],
			},
		},
		options: [...paginationFields],
	},
];

// Table Fields
export const tableFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['tables'],
			},
		},
	},
	{
		displayName: 'Table GUID',
		name: 'tableGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the table',
		displayOptions: {
			show: {
				resource: ['tables'],
				operation: ['getTable', 'getTableStatus', 'updateTableStatus'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		options: [
			{ name: 'Available', value: 'AVAILABLE' },
			{ name: 'Occupied', value: 'OCCUPIED' },
			{ name: 'Reserved', value: 'RESERVED' },
			{ name: 'Dirty', value: 'DIRTY' },
		],
		default: 'AVAILABLE',
		description: 'The new table status',
		displayOptions: {
			show: {
				resource: ['tables'],
				operation: ['updateTableStatus'],
			},
		},
	},
];

// Revenue Center Fields
export const revenueCenterFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['revenueCenters'],
			},
		},
	},
	{
		displayName: 'Revenue Center GUID',
		name: 'revenueCenterGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the revenue center',
		displayOptions: {
			show: {
				resource: ['revenueCenters'],
				operation: ['getRevenueCenter', 'getDiningOptions'],
			},
		},
	},
];

// Cash Management Fields
export const cashManagementFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['cashManagement'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['cashManagement'],
			},
		},
		options: [...paginationFields, ...dateRangeFields],
	},
];

// Discount Fields
export const discountFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['discounts'],
			},
		},
	},
	{
		displayName: 'Discount GUID',
		name: 'discountGuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The GUID of the discount',
		displayOptions: {
			show: {
				resource: ['discounts'],
				operation: ['getDiscount', 'updateDiscount', 'deleteDiscount'],
			},
		},
	},
	{
		displayName: 'Discount Data',
		name: 'discountData',
		type: 'json',
		default: '{}',
		description: 'The discount data as JSON',
		displayOptions: {
			show: {
				resource: ['discounts'],
				operation: ['createDiscount', 'updateDiscount'],
			},
		},
	},
];

// Report Fields
export const reportFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['reports'],
			},
		},
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'string',
		default: '',
		description: 'The type of custom report',
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['getCustomReport'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reports'],
			},
		},
		options: [...dateRangeFields],
	},
];

// Configuration Fields
export const configurationFields: INodeProperties[] = [
	{
		...restaurantGuidField,
		displayOptions: {
			show: {
				resource: ['configuration'],
			},
		},
	},
];
