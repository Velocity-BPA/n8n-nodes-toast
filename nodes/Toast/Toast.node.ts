/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	resourceOptions,
	restaurantOperations,
	orderOperations,
	checkOperations,
	paymentOperations,
	menuOperations,
	menuManagementOperations,
	inventoryOperations,
	laborOperations,
	customerOperations,
	loyaltyOperations,
	tableOperations,
	revenueCenterOperations,
	cashManagementOperations,
	discountOperations,
	reportOperations,
	configurationOperations,
} from './constants/resources';

import {
	restaurantFields,
	orderFields,
	checkFields,
	paymentFields,
	menuFields,
	menuManagementFields,
	inventoryFields,
	laborFields,
	customerFields,
	loyaltyFields,
	tableFields,
	revenueCenterFields,
	cashManagementFields,
	discountFields,
	reportFields,
	configurationFields,
} from './constants/fields';

import {
	toastApiRequest,
	toastApiRequestAllItems,
	formatOutput,
	parseJson,
	buildDateRangeParams,
	logLicensingNotice,
} from './transport';

export class Toast implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Toast',
		name: 'toast',
		icon: 'file:toast.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Toast POS API for restaurant management',
		defaults: {
			name: 'Toast',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'toastApi',
				required: true,
			},
		],
		properties: [
			resourceOptions,
			// Operations
			restaurantOperations,
			orderOperations,
			checkOperations,
			paymentOperations,
			menuOperations,
			menuManagementOperations,
			inventoryOperations,
			laborOperations,
			customerOperations,
			loyaltyOperations,
			tableOperations,
			revenueCenterOperations,
			cashManagementOperations,
			discountOperations,
			reportOperations,
			configurationOperations,
			// Fields
			...restaurantFields,
			...orderFields,
			...checkFields,
			...paymentFields,
			...menuFields,
			...menuManagementFields,
			...inventoryFields,
			...laborFields,
			...customerFields,
			...loyaltyFields,
			...tableFields,
			...revenueCenterFields,
			...cashManagementFields,
			...discountFields,
			...reportFields,
			...configurationFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log licensing notice once per node load
		logLicensingNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// Get restaurant GUID for most operations
				const restaurantGuid = this.getNodeParameter('restaurantGuid', i, '') as string;

				// ==================== RESTAURANTS ====================
				if (resource === 'restaurants') {
					if (operation === 'listRestaurants') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/restaurants/v1/restaurants',
						);
					} else if (operation === 'getRestaurant') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/restaurants/v1/restaurants/${restaurantGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getRestaurantInfo') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/restaurantInfo',
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== ORDERS ====================
				else if (resource === 'orders') {
					const orderGuid = this.getNodeParameter('orderGuid', i, '') as string;

					if (operation === 'listOrders') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;
						const qs: IDataObject = {};

						if (additionalOptions.businessDate) {
							qs.businessDate = new Date(additionalOptions.businessDate as string).toISOString().split('T')[0].replace(/-/g, '');
						}
						if (additionalOptions.orderStatus) {
							qs.status = additionalOptions.orderStatus;
						}

						Object.assign(qs, buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						));

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/orders',
								undefined,
								qs,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/orders',
								undefined,
								qs,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getOrder') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/orders/v2/orders/${orderGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createOrder') {
						const orderData = parseJson(
							this.getNodeParameter('orderData', i, '{}') as string,
							'orderData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/orders/v2/orders',
							orderData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateOrder') {
						const orderData = parseJson(
							this.getNodeParameter('orderData', i, '{}') as string,
							'orderData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/orders/v2/orders/${orderGuid}`,
							orderData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'addOrderItem') {
						const itemGuid = this.getNodeParameter('itemGuid', i) as string;
						const quantity = this.getNodeParameter('quantity', i, 1) as number;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/orders/${orderGuid}/selections`,
							{
								itemGuid,
								quantity,
							},
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'removeOrderItem') {
						const itemGuid = this.getNodeParameter('itemGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'DELETE',
							`/orders/v2/orders/${orderGuid}/selections/${itemGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'voidOrder') {
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/orders/${orderGuid}/void`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getOrderHistory') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/orders/v2/orders/${orderGuid}/history`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getOrdersByDateRange') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequestAllItems.call(
							this,
							'GET',
							'/orders/v2/orders',
							undefined,
							qs,
							restaurantGuid,
						);
					}
				}

				// ==================== CHECKS ====================
				else if (resource === 'checks') {
					const checkGuid = this.getNodeParameter('checkGuid', i, '') as string;

					if (operation === 'listChecks') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/checks',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/checks',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getCheck') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/orders/v2/checks/${checkGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createCheck') {
						const orderGuid = this.getNodeParameter('orderGuid', i) as string;
						const checkData = parseJson(
							this.getNodeParameter('checkData', i, '{}') as string,
							'checkData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/orders/${orderGuid}/checks`,
							checkData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateCheck') {
						const checkData = parseJson(
							this.getNodeParameter('checkData', i, '{}') as string,
							'checkData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/orders/v2/checks/${checkGuid}`,
							checkData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'applyDiscount') {
						const discountGuid = this.getNodeParameter('discountGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/checks/${checkGuid}/appliedDiscounts`,
							{ discountGuid },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'removeDiscount') {
						const discountGuid = this.getNodeParameter('discountGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'DELETE',
							`/orders/v2/checks/${checkGuid}/appliedDiscounts/${discountGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'applyServiceCharge') {
						const serviceChargeGuid = this.getNodeParameter('serviceChargeGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/checks/${checkGuid}/appliedServiceCharges`,
							{ serviceChargeGuid },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'printCheck') {
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/checks/${checkGuid}/print`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'closeCheck') {
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/checks/${checkGuid}/close`,
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== PAYMENTS ====================
				else if (resource === 'payments') {
					const paymentGuid = this.getNodeParameter('paymentGuid', i, '') as string;

					if (operation === 'listPayments') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/payments',
								undefined,
								qs,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/orders/v2/payments',
								undefined,
								qs,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getPayment') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/orders/v2/payments/${paymentGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createPayment') {
						const checkGuid = this.getNodeParameter('checkGuid', i) as string;
						const paymentData = parseJson(
							this.getNodeParameter('paymentData', i, '{}') as string,
							'paymentData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/checks/${checkGuid}/payments`,
							paymentData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'voidPayment') {
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/payments/${paymentGuid}/void`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'refundPayment') {
						const refundAmount = this.getNodeParameter('refundAmount', i) as number;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/orders/v2/payments/${paymentGuid}/refund`,
							{ amount: refundAmount },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getTips') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/orders/v2/tips',
							undefined,
							qs,
							restaurantGuid,
						);
					}
				}

				// ==================== MENU ====================
				else if (resource === 'menu') {
					if (operation === 'getMenu') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/menus',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getMenuGroups') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/menuGroups',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getMenuItems') {
						const menuGroupGuid = this.getNodeParameter('menuGroupGuid', i, '') as string;
						const qs: IDataObject = {};
						if (menuGroupGuid) {
							qs.menuGroupGuid = menuGroupGuid;
						}
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/menuItems',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getMenuItem') {
						const menuItemGuid = this.getNodeParameter('menuItemGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/menus/v2/menuItems/${menuItemGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getModifiers') {
						const modifierGroupGuid = this.getNodeParameter('modifierGroupGuid', i, '') as string;
						const qs: IDataObject = {};
						if (modifierGroupGuid) {
							qs.modifierGroupGuid = modifierGroupGuid;
						}
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/modifiers',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getModifierGroups') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/modifierGroups',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getPricing') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/menus/v2/pricing',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getMenuImages') {
						const menuItemGuid = this.getNodeParameter('menuItemGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/menus/v2/menuItems/${menuItemGuid}/images`,
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== MENU MANAGEMENT ====================
				else if (resource === 'menuManagement') {
					if (operation === 'createMenuItem') {
						const menuItemData = parseJson(
							this.getNodeParameter('menuItemData', i, '{}') as string,
							'menuItemData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/menus/v2/menuItems',
							menuItemData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateMenuItem') {
						const menuItemGuid = this.getNodeParameter('menuItemGuid', i) as string;
						const menuItemData = parseJson(
							this.getNodeParameter('menuItemData', i, '{}') as string,
							'menuItemData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/menus/v2/menuItems/${menuItemGuid}`,
							menuItemData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'deleteMenuItem') {
						const menuItemGuid = this.getNodeParameter('menuItemGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'DELETE',
							`/menus/v2/menuItems/${menuItemGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createModifier') {
						const modifierData = parseJson(
							this.getNodeParameter('modifierData', i, '{}') as string,
							'modifierData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/menus/v2/modifiers',
							modifierData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateModifier') {
						const modifierGuid = this.getNodeParameter('modifierGuid', i) as string;
						const modifierData = parseJson(
							this.getNodeParameter('modifierData', i, '{}') as string,
							'modifierData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/menus/v2/modifiers/${modifierGuid}`,
							modifierData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updatePricing') {
						const pricingData = parseJson(
							this.getNodeParameter('pricingData', i, '{}') as string,
							'pricingData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PUT',
							'/menus/v2/pricing',
							pricingData,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== INVENTORY ====================
				else if (resource === 'inventory') {
					if (operation === 'getInventory') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/stock/v1/inventory',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/stock/v1/inventory',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'updateInventoryQuantity') {
						const inventoryItemGuid = this.getNodeParameter('inventoryItemGuid', i) as string;
						const quantity = this.getNodeParameter('quantity', i) as number;
						responseData = await toastApiRequest.call(
							this,
							'PUT',
							`/stock/v1/inventory/${inventoryItemGuid}`,
							{ quantity },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getInventoryItems') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/stock/v1/items',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/stock/v1/items',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'createInventoryItem') {
						const inventoryItemData = parseJson(
							this.getNodeParameter('inventoryItemData', i, '{}') as string,
							'inventoryItemData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/stock/v1/items',
							inventoryItemData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateInventoryItem') {
						const inventoryItemGuid = this.getNodeParameter('inventoryItemGuid', i) as string;
						const inventoryItemData = parseJson(
							this.getNodeParameter('inventoryItemData', i, '{}') as string,
							'inventoryItemData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/stock/v1/items/${inventoryItemGuid}`,
							inventoryItemData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getVendors') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/stock/v1/vendors',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getPurchaseOrders') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/stock/v1/purchaseOrders',
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== LABOR ====================
				else if (resource === 'labor') {
					const employeeGuid = this.getNodeParameter('employeeGuid', i, '') as string;

					if (operation === 'listEmployees') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/labor/v1/employees',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/labor/v1/employees',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getEmployee') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/labor/v1/employees/${employeeGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createEmployee') {
						const employeeData = parseJson(
							this.getNodeParameter('employeeData', i, '{}') as string,
							'employeeData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/labor/v1/employees',
							employeeData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateEmployee') {
						const employeeData = parseJson(
							this.getNodeParameter('employeeData', i, '{}') as string,
							'employeeData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/labor/v1/employees/${employeeGuid}`,
							employeeData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'deleteEmployee') {
						responseData = await toastApiRequest.call(
							this,
							'DELETE',
							`/labor/v1/employees/${employeeGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getTimeEntries') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/labor/v1/timeEntries',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'clockIn') {
						const jobGuid = this.getNodeParameter('jobGuid', i, '') as string;
						const body: IDataObject = { employeeGuid };
						if (jobGuid) {
							body.jobGuid = jobGuid;
						}
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/labor/v1/timeEntries/clockIn',
							body,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'clockOut') {
						const jobGuid = this.getNodeParameter('jobGuid', i, '') as string;
						const body: IDataObject = { employeeGuid };
						if (jobGuid) {
							body.jobGuid = jobGuid;
						}
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/labor/v1/timeEntries/clockOut',
							body,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getShifts') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/labor/v1/shifts',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'createShift') {
						const shiftData = parseJson(
							this.getNodeParameter('shiftData', i, '{}') as string,
							'shiftData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/labor/v1/shifts',
							shiftData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getBreaks') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/labor/v1/breaks',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getLaborCosts') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const qs: IDataObject = buildDateRangeParams(
							additionalOptions.startDate as string,
							additionalOptions.endDate as string,
						);
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/labor/v1/laborCosts',
							undefined,
							qs,
							restaurantGuid,
						);
					}
				}

				// ==================== CUSTOMERS ====================
				else if (resource === 'customers') {
					const guestGuid = this.getNodeParameter('guestGuid', i, '') as string;

					if (operation === 'listGuests') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/guests/v1/guests',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/guests/v1/guests',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getGuest') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/guests/v1/guests/${guestGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createGuest') {
						const guestData = parseJson(
							this.getNodeParameter('guestData', i, '{}') as string,
							'guestData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/guests/v1/guests',
							guestData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateGuest') {
						const guestData = parseJson(
							this.getNodeParameter('guestData', i, '{}') as string,
							'guestData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/guests/v1/guests/${guestGuid}`,
							guestData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getGuestHistory') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/guests/v1/guests/${guestGuid}/history`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getGuestLoyalty') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/guests/v1/guests/${guestGuid}/loyalty`,
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== LOYALTY ====================
				else if (resource === 'loyalty') {
					const accountGuid = this.getNodeParameter('accountGuid', i, '') as string;

					if (operation === 'getLoyaltyProgram') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/loyalty/v1/programs',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getLoyaltyAccounts') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/loyalty/v1/accounts',
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								'/loyalty/v1/accounts',
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'getLoyaltyTransactions') {
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
						const returnAll = additionalOptions.returnAll as boolean;
						const limit = additionalOptions.limit as number;

						if (returnAll) {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								`/loyalty/v1/accounts/${accountGuid}/transactions`,
								undefined,
								undefined,
								restaurantGuid,
							);
						} else {
							responseData = await toastApiRequestAllItems.call(
								this,
								'GET',
								`/loyalty/v1/accounts/${accountGuid}/transactions`,
								undefined,
								undefined,
								restaurantGuid,
								limit || 50,
							);
						}
					} else if (operation === 'addLoyaltyPoints') {
						const points = this.getNodeParameter('points', i) as number;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/loyalty/v1/accounts/${accountGuid}/points`,
							{ points },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'redeemLoyaltyReward') {
						const rewardGuid = this.getNodeParameter('rewardGuid', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'POST',
							`/loyalty/v1/accounts/${accountGuid}/redeem`,
							{ rewardGuid },
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== TABLES ====================
				else if (resource === 'tables') {
					const tableGuid = this.getNodeParameter('tableGuid', i, '') as string;

					if (operation === 'listTables') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/tables',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getTable') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/config/v2/tables/${tableGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getTableStatus') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/config/v2/tables/${tableGuid}/status`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateTableStatus') {
						const status = this.getNodeParameter('status', i) as string;
						responseData = await toastApiRequest.call(
							this,
							'PUT',
							`/config/v2/tables/${tableGuid}/status`,
							{ status },
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getFloorPlan') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/floorPlans',
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== REVENUE CENTERS ====================
				else if (resource === 'revenueCenters') {
					const revenueCenterGuid = this.getNodeParameter('revenueCenterGuid', i, '') as string;

					if (operation === 'listRevenueCenters') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/revenueCenters',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getRevenueCenter') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/config/v2/revenueCenters/${revenueCenterGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getDiningOptions') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/config/v2/revenueCenters/${revenueCenterGuid}/diningOptions`,
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== CASH MANAGEMENT ====================
				else if (resource === 'cashManagement') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
					const qs: IDataObject = buildDateRangeParams(
						additionalOptions.startDate as string,
						additionalOptions.endDate as string,
					);

					if (operation === 'getCashDrawers') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/cashmgmt/v1/cashDrawers',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getCashDrawerShifts') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/cashmgmt/v1/cashDrawerShifts',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getDeposits') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/cashmgmt/v1/deposits',
							undefined,
							qs,
							restaurantGuid,
						);
					}
				}

				// ==================== DISCOUNTS ====================
				else if (resource === 'discounts') {
					const discountGuid = this.getNodeParameter('discountGuid', i, '') as string;

					if (operation === 'listDiscounts') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/discounts',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getDiscount') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							`/config/v2/discounts/${discountGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'createDiscount') {
						const discountData = parseJson(
							this.getNodeParameter('discountData', i, '{}') as string,
							'discountData',
						);
						responseData = await toastApiRequest.call(
							this,
							'POST',
							'/config/v2/discounts',
							discountData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'updateDiscount') {
						const discountData = parseJson(
							this.getNodeParameter('discountData', i, '{}') as string,
							'discountData',
						);
						responseData = await toastApiRequest.call(
							this,
							'PATCH',
							`/config/v2/discounts/${discountGuid}`,
							discountData,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'deleteDiscount') {
						responseData = await toastApiRequest.call(
							this,
							'DELETE',
							`/config/v2/discounts/${discountGuid}`,
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// ==================== REPORTS ====================
				else if (resource === 'reports') {
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;
					const qs: IDataObject = buildDateRangeParams(
						additionalOptions.startDate as string,
						additionalOptions.endDate as string,
					);

					if (operation === 'getSalesSummary') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/salesSummary',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getItemSales') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/itemSales',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getLaborSummary') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/laborSummary',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getPaymentSummary') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/paymentSummary',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getTimeEntryReport') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/timeEntries',
							undefined,
							qs,
							restaurantGuid,
						);
					} else if (operation === 'getCustomReport') {
						const reportType = this.getNodeParameter('reportType', i, '') as string;
						qs.reportType = reportType;
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/reporting/v1/custom',
							undefined,
							qs,
							restaurantGuid,
						);
					}
				}

				// ==================== CONFIGURATION ====================
				else if (resource === 'configuration') {
					if (operation === 'getServiceAreas') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/serviceAreas',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getTaxRates') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/taxRates',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getAlternatePaymentTypes') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/alternatePaymentTypes',
							undefined,
							undefined,
							restaurantGuid,
						);
					} else if (operation === 'getPriceGroups') {
						responseData = await toastApiRequest.call(
							this,
							'GET',
							'/config/v2/priceGroups',
							undefined,
							undefined,
							restaurantGuid,
						);
					}
				}

				// Handle unsupported resource/operation
				else {
					throw new NodeOperationError(
						this.getNode(),
						`The resource "${resource}" is not supported`,
						{ itemIndex: i },
					);
				}

				// Format and add response to return data
				const executionData = formatOutput(responseData);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
