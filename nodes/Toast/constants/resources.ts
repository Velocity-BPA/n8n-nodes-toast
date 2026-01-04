/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties } from 'n8n-workflow';

export const TOAST_API_VERSION = 'v1';

export const resourceOptions: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Cash Management',
			value: 'cashManagement',
			description: 'Manage cash drawers and deposits',
		},
		{
			name: 'Check',
			value: 'checks',
			description: 'Manage checks/tabs',
		},
		{
			name: 'Configuration',
			value: 'configuration',
			description: 'Get restaurant configuration',
		},
		{
			name: 'Customer',
			value: 'customers',
			description: 'Manage guest profiles',
		},
		{
			name: 'Discount',
			value: 'discounts',
			description: 'Manage discounts',
		},
		{
			name: 'Inventory',
			value: 'inventory',
			description: 'Manage inventory items',
		},
		{
			name: 'Labor',
			value: 'labor',
			description: 'Manage employees and shifts',
		},
		{
			name: 'Loyalty',
			value: 'loyalty',
			description: 'Manage loyalty programs',
		},
		{
			name: 'Menu',
			value: 'menu',
			description: 'Get menu information',
		},
		{
			name: 'Menu Management',
			value: 'menuManagement',
			description: 'Create and update menu items',
		},
		{
			name: 'Order',
			value: 'orders',
			description: 'Manage orders',
		},
		{
			name: 'Payment',
			value: 'payments',
			description: 'Manage payments',
		},
		{
			name: 'Report',
			value: 'reports',
			description: 'Get sales and labor reports',
		},
		{
			name: 'Restaurant',
			value: 'restaurants',
			description: 'Get restaurant information',
		},
		{
			name: 'Revenue Center',
			value: 'revenueCenters',
			description: 'Manage revenue centers',
		},
		{
			name: 'Table',
			value: 'tables',
			description: 'Manage tables and floor plans',
		},
	],
	default: 'restaurants',
};

// Restaurant Operations
export const restaurantOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['restaurants'],
		},
	},
	options: [
		{
			name: 'Get Restaurant',
			value: 'getRestaurant',
			description: 'Get restaurant details by GUID',
			action: 'Get restaurant details',
		},
		{
			name: 'Get Restaurant Info',
			value: 'getRestaurantInfo',
			description: 'Get detailed restaurant information',
			action: 'Get restaurant info',
		},
		{
			name: 'List Restaurants',
			value: 'listRestaurants',
			description: 'List connected restaurants',
			action: 'List restaurants',
		},
	],
	default: 'listRestaurants',
};

// Order Operations
export const orderOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['orders'],
		},
	},
	options: [
		{
			name: 'Add Order Item',
			value: 'addOrderItem',
			description: 'Add an item to an order',
			action: 'Add item to order',
		},
		{
			name: 'Create Order',
			value: 'createOrder',
			description: 'Create a new order',
			action: 'Create order',
		},
		{
			name: 'Get Order',
			value: 'getOrder',
			description: 'Get order by GUID',
			action: 'Get order',
		},
		{
			name: 'Get Order History',
			value: 'getOrderHistory',
			description: 'Get order history',
			action: 'Get order history',
		},
		{
			name: 'Get Orders by Date Range',
			value: 'getOrdersByDateRange',
			description: 'Get orders within a date range',
			action: 'Get orders by date range',
		},
		{
			name: 'List Orders',
			value: 'listOrders',
			description: 'List orders with filters',
			action: 'List orders',
		},
		{
			name: 'Remove Order Item',
			value: 'removeOrderItem',
			description: 'Remove an item from an order',
			action: 'Remove item from order',
		},
		{
			name: 'Update Order',
			value: 'updateOrder',
			description: 'Update an existing order',
			action: 'Update order',
		},
		{
			name: 'Void Order',
			value: 'voidOrder',
			description: 'Void an order',
			action: 'Void order',
		},
	],
	default: 'listOrders',
};

// Check Operations
export const checkOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['checks'],
		},
	},
	options: [
		{
			name: 'Apply Discount',
			value: 'applyDiscount',
			description: 'Apply a discount to a check',
			action: 'Apply discount to check',
		},
		{
			name: 'Apply Service Charge',
			value: 'applyServiceCharge',
			description: 'Add a service charge to a check',
			action: 'Apply service charge',
		},
		{
			name: 'Close Check',
			value: 'closeCheck',
			description: 'Close a check',
			action: 'Close check',
		},
		{
			name: 'Create Check',
			value: 'createCheck',
			description: 'Create a new check',
			action: 'Create check',
		},
		{
			name: 'Get Check',
			value: 'getCheck',
			description: 'Get check by GUID',
			action: 'Get check',
		},
		{
			name: 'List Checks',
			value: 'listChecks',
			description: 'List checks',
			action: 'List checks',
		},
		{
			name: 'Print Check',
			value: 'printCheck',
			description: 'Print a check',
			action: 'Print check',
		},
		{
			name: 'Remove Discount',
			value: 'removeDiscount',
			description: 'Remove a discount from a check',
			action: 'Remove discount from check',
		},
		{
			name: 'Update Check',
			value: 'updateCheck',
			description: 'Update a check',
			action: 'Update check',
		},
	],
	default: 'listChecks',
};

// Payment Operations
export const paymentOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['payments'],
		},
	},
	options: [
		{
			name: 'Create Payment',
			value: 'createPayment',
			description: 'Create a payment',
			action: 'Create payment',
		},
		{
			name: 'Get Payment',
			value: 'getPayment',
			description: 'Get payment by GUID',
			action: 'Get payment',
		},
		{
			name: 'Get Tips',
			value: 'getTips',
			description: 'Get tip information',
			action: 'Get tips',
		},
		{
			name: 'List Payments',
			value: 'listPayments',
			description: 'List payments',
			action: 'List payments',
		},
		{
			name: 'Refund Payment',
			value: 'refundPayment',
			description: 'Refund a payment',
			action: 'Refund payment',
		},
		{
			name: 'Void Payment',
			value: 'voidPayment',
			description: 'Void a payment',
			action: 'Void payment',
		},
	],
	default: 'listPayments',
};

// Menu Operations
export const menuOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['menu'],
		},
	},
	options: [
		{
			name: 'Get Menu',
			value: 'getMenu',
			description: 'Get full menu',
			action: 'Get menu',
		},
		{
			name: 'Get Menu Groups',
			value: 'getMenuGroups',
			description: 'Get menu groups',
			action: 'Get menu groups',
		},
		{
			name: 'Get Menu Images',
			value: 'getMenuImages',
			description: 'Get item images',
			action: 'Get menu images',
		},
		{
			name: 'Get Menu Item',
			value: 'getMenuItem',
			description: 'Get item by GUID',
			action: 'Get menu item',
		},
		{
			name: 'Get Menu Items',
			value: 'getMenuItems',
			description: 'Get menu items',
			action: 'Get menu items',
		},
		{
			name: 'Get Modifier Groups',
			value: 'getModifierGroups',
			description: 'Get modifier groups',
			action: 'Get modifier groups',
		},
		{
			name: 'Get Modifiers',
			value: 'getModifiers',
			description: 'Get modifiers',
			action: 'Get modifiers',
		},
		{
			name: 'Get Pricing',
			value: 'getPricing',
			description: 'Get pricing rules',
			action: 'Get pricing',
		},
	],
	default: 'getMenu',
};

// Menu Management Operations
export const menuManagementOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['menuManagement'],
		},
	},
	options: [
		{
			name: 'Create Menu Item',
			value: 'createMenuItem',
			description: 'Create a menu item',
			action: 'Create menu item',
		},
		{
			name: 'Create Modifier',
			value: 'createModifier',
			description: 'Create a modifier',
			action: 'Create modifier',
		},
		{
			name: 'Delete Menu Item',
			value: 'deleteMenuItem',
			description: 'Delete a menu item',
			action: 'Delete menu item',
		},
		{
			name: 'Update Menu Item',
			value: 'updateMenuItem',
			description: 'Update a menu item',
			action: 'Update menu item',
		},
		{
			name: 'Update Modifier',
			value: 'updateModifier',
			description: 'Update a modifier',
			action: 'Update modifier',
		},
		{
			name: 'Update Pricing',
			value: 'updatePricing',
			description: 'Update pricing',
			action: 'Update pricing',
		},
	],
	default: 'createMenuItem',
};

// Inventory Operations
export const inventoryOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['inventory'],
		},
	},
	options: [
		{
			name: 'Create Inventory Item',
			value: 'createInventoryItem',
			description: 'Create an inventory item',
			action: 'Create inventory item',
		},
		{
			name: 'Get Inventory',
			value: 'getInventory',
			description: 'Get inventory levels',
			action: 'Get inventory',
		},
		{
			name: 'Get Inventory Items',
			value: 'getInventoryItems',
			description: 'Get inventory items',
			action: 'Get inventory items',
		},
		{
			name: 'Get Purchase Orders',
			value: 'getPurchaseOrders',
			description: 'Get purchase orders',
			action: 'Get purchase orders',
		},
		{
			name: 'Get Vendors',
			value: 'getVendors',
			description: 'Get vendors',
			action: 'Get vendors',
		},
		{
			name: 'Update Inventory Item',
			value: 'updateInventoryItem',
			description: 'Update an inventory item',
			action: 'Update inventory item',
		},
		{
			name: 'Update Inventory Quantity',
			value: 'updateInventoryQuantity',
			description: 'Update quantity',
			action: 'Update inventory quantity',
		},
	],
	default: 'getInventory',
};

// Labor Operations
export const laborOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['labor'],
		},
	},
	options: [
		{
			name: 'Clock In',
			value: 'clockIn',
			description: 'Clock in an employee',
			action: 'Clock in employee',
		},
		{
			name: 'Clock Out',
			value: 'clockOut',
			description: 'Clock out an employee',
			action: 'Clock out employee',
		},
		{
			name: 'Create Employee',
			value: 'createEmployee',
			description: 'Create an employee',
			action: 'Create employee',
		},
		{
			name: 'Create Shift',
			value: 'createShift',
			description: 'Create a shift',
			action: 'Create shift',
		},
		{
			name: 'Delete Employee',
			value: 'deleteEmployee',
			description: 'Delete an employee',
			action: 'Delete employee',
		},
		{
			name: 'Get Breaks',
			value: 'getBreaks',
			description: 'Get break records',
			action: 'Get breaks',
		},
		{
			name: 'Get Employee',
			value: 'getEmployee',
			description: 'Get employee by GUID',
			action: 'Get employee',
		},
		{
			name: 'Get Labor Costs',
			value: 'getLaborCosts',
			description: 'Get labor costs',
			action: 'Get labor costs',
		},
		{
			name: 'Get Shifts',
			value: 'getShifts',
			description: 'Get scheduled shifts',
			action: 'Get shifts',
		},
		{
			name: 'Get Time Entries',
			value: 'getTimeEntries',
			description: 'Get time entries',
			action: 'Get time entries',
		},
		{
			name: 'List Employees',
			value: 'listEmployees',
			description: 'List employees',
			action: 'List employees',
		},
		{
			name: 'Update Employee',
			value: 'updateEmployee',
			description: 'Update an employee',
			action: 'Update employee',
		},
	],
	default: 'listEmployees',
};

// Customer Operations
export const customerOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['customers'],
		},
	},
	options: [
		{
			name: 'Create Guest',
			value: 'createGuest',
			description: 'Create a guest profile',
			action: 'Create guest',
		},
		{
			name: 'Get Guest',
			value: 'getGuest',
			description: 'Get guest by GUID',
			action: 'Get guest',
		},
		{
			name: 'Get Guest History',
			value: 'getGuestHistory',
			description: 'Get visit history',
			action: 'Get guest history',
		},
		{
			name: 'Get Guest Loyalty',
			value: 'getGuestLoyalty',
			description: 'Get loyalty info',
			action: 'Get guest loyalty',
		},
		{
			name: 'List Guests',
			value: 'listGuests',
			description: 'List guests/customers',
			action: 'List guests',
		},
		{
			name: 'Update Guest',
			value: 'updateGuest',
			description: 'Update a guest',
			action: 'Update guest',
		},
	],
	default: 'listGuests',
};

// Loyalty Operations
export const loyaltyOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['loyalty'],
		},
	},
	options: [
		{
			name: 'Add Loyalty Points',
			value: 'addLoyaltyPoints',
			description: 'Add points to account',
			action: 'Add loyalty points',
		},
		{
			name: 'Get Loyalty Accounts',
			value: 'getLoyaltyAccounts',
			description: 'Get loyalty accounts',
			action: 'Get loyalty accounts',
		},
		{
			name: 'Get Loyalty Program',
			value: 'getLoyaltyProgram',
			description: 'Get loyalty program',
			action: 'Get loyalty program',
		},
		{
			name: 'Get Loyalty Transactions',
			value: 'getLoyaltyTransactions',
			description: 'Get transactions',
			action: 'Get loyalty transactions',
		},
		{
			name: 'Redeem Loyalty Reward',
			value: 'redeemLoyaltyReward',
			description: 'Redeem a reward',
			action: 'Redeem loyalty reward',
		},
	],
	default: 'getLoyaltyProgram',
};

// Table Operations
export const tableOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['tables'],
		},
	},
	options: [
		{
			name: 'Get Floor Plan',
			value: 'getFloorPlan',
			description: 'Get floor plan',
			action: 'Get floor plan',
		},
		{
			name: 'Get Table',
			value: 'getTable',
			description: 'Get table by GUID',
			action: 'Get table',
		},
		{
			name: 'Get Table Status',
			value: 'getTableStatus',
			description: 'Get table status',
			action: 'Get table status',
		},
		{
			name: 'List Tables',
			value: 'listTables',
			description: 'List tables',
			action: 'List tables',
		},
		{
			name: 'Update Table Status',
			value: 'updateTableStatus',
			description: 'Update table status',
			action: 'Update table status',
		},
	],
	default: 'listTables',
};

// Revenue Center Operations
export const revenueCenterOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['revenueCenters'],
		},
	},
	options: [
		{
			name: 'Get Dining Options',
			value: 'getDiningOptions',
			description: 'Get dining options',
			action: 'Get dining options',
		},
		{
			name: 'Get Revenue Center',
			value: 'getRevenueCenter',
			description: 'Get revenue center',
			action: 'Get revenue center',
		},
		{
			name: 'List Revenue Centers',
			value: 'listRevenueCenters',
			description: 'List revenue centers',
			action: 'List revenue centers',
		},
	],
	default: 'listRevenueCenters',
};

// Cash Management Operations
export const cashManagementOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['cashManagement'],
		},
	},
	options: [
		{
			name: 'Get Cash Drawer Shifts',
			value: 'getCashDrawerShifts',
			description: 'Get drawer shifts',
			action: 'Get cash drawer shifts',
		},
		{
			name: 'Get Cash Drawers',
			value: 'getCashDrawers',
			description: 'Get cash drawers',
			action: 'Get cash drawers',
		},
		{
			name: 'Get Deposits',
			value: 'getDeposits',
			description: 'Get deposits',
			action: 'Get deposits',
		},
	],
	default: 'getCashDrawers',
};

// Discount Operations
export const discountOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['discounts'],
		},
	},
	options: [
		{
			name: 'Create Discount',
			value: 'createDiscount',
			description: 'Create a discount',
			action: 'Create discount',
		},
		{
			name: 'Delete Discount',
			value: 'deleteDiscount',
			description: 'Delete a discount',
			action: 'Delete discount',
		},
		{
			name: 'Get Discount',
			value: 'getDiscount',
			description: 'Get discount by GUID',
			action: 'Get discount',
		},
		{
			name: 'List Discounts',
			value: 'listDiscounts',
			description: 'List discounts',
			action: 'List discounts',
		},
		{
			name: 'Update Discount',
			value: 'updateDiscount',
			description: 'Update a discount',
			action: 'Update discount',
		},
	],
	default: 'listDiscounts',
};

// Report Operations
export const reportOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['reports'],
		},
	},
	options: [
		{
			name: 'Get Custom Report',
			value: 'getCustomReport',
			description: 'Run custom report',
			action: 'Get custom report',
		},
		{
			name: 'Get Item Sales',
			value: 'getItemSales',
			description: 'Get item sales',
			action: 'Get item sales',
		},
		{
			name: 'Get Labor Summary',
			value: 'getLaborSummary',
			description: 'Get labor summary',
			action: 'Get labor summary',
		},
		{
			name: 'Get Payment Summary',
			value: 'getPaymentSummary',
			description: 'Get payment summary',
			action: 'Get payment summary',
		},
		{
			name: 'Get Sales Summary',
			value: 'getSalesSummary',
			description: 'Get sales summary',
			action: 'Get sales summary',
		},
		{
			name: 'Get Time Entry Report',
			value: 'getTimeEntryReport',
			description: 'Get time entries',
			action: 'Get time entry report',
		},
	],
	default: 'getSalesSummary',
};

// Configuration Operations
export const configurationOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['configuration'],
		},
	},
	options: [
		{
			name: 'Get Alternate Payment Types',
			value: 'getAlternatePaymentTypes',
			description: 'Get payment types',
			action: 'Get alternate payment types',
		},
		{
			name: 'Get Price Groups',
			value: 'getPriceGroups',
			description: 'Get price groups',
			action: 'Get price groups',
		},
		{
			name: 'Get Service Areas',
			value: 'getServiceAreas',
			description: 'Get service areas',
			action: 'Get service areas',
		},
		{
			name: 'Get Tax Rates',
			value: 'getTaxRates',
			description: 'Get tax rates',
			action: 'Get tax rates',
		},
	],
	default: 'getServiceAreas',
};
