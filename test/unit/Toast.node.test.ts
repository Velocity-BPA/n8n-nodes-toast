/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { Toast } from '../../nodes/Toast/Toast.node';
import { ToastTrigger } from '../../nodes/Toast/ToastTrigger.node';

describe('Toast Node', () => {
	let toastNode: Toast;

	beforeEach(() => {
		toastNode = new Toast();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(toastNode.description.displayName).toBe('Toast');
		});

		it('should have correct name', () => {
			expect(toastNode.description.name).toBe('toast');
		});

		it('should have correct group', () => {
			expect(toastNode.description.group).toContain('transform');
		});

		it('should have version 1', () => {
			expect(toastNode.description.version).toBe(1);
		});

		it('should require toastApi credentials', () => {
			const credentials = toastNode.description.credentials;
			expect(credentials).toBeDefined();
			expect(credentials).toHaveLength(1);
			expect(credentials![0].name).toBe('toastApi');
			expect(credentials![0].required).toBe(true);
		});

		it('should have one input and one output', () => {
			expect(toastNode.description.inputs).toEqual(['main']);
			expect(toastNode.description.outputs).toEqual(['main']);
		});
	});

	describe('Resources', () => {
		it('should have 16 resources defined', () => {
			const resourceProperty = toastNode.description.properties.find(
				(p) => p.name === 'resource',
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
			
			const options = (resourceProperty as any)?.options;
			expect(options).toHaveLength(16);
		});

		it('should include all required resources', () => {
			const resourceProperty = toastNode.description.properties.find(
				(p) => p.name === 'resource',
			);
			const options = (resourceProperty as any)?.options;
			const resourceValues = options.map((o: any) => o.value);

			expect(resourceValues).toContain('restaurants');
			expect(resourceValues).toContain('orders');
			expect(resourceValues).toContain('checks');
			expect(resourceValues).toContain('payments');
			expect(resourceValues).toContain('menu');
			expect(resourceValues).toContain('menuManagement');
			expect(resourceValues).toContain('inventory');
			expect(resourceValues).toContain('labor');
			expect(resourceValues).toContain('customers');
			expect(resourceValues).toContain('loyalty');
			expect(resourceValues).toContain('tables');
			expect(resourceValues).toContain('revenueCenters');
			expect(resourceValues).toContain('cashManagement');
			expect(resourceValues).toContain('discounts');
			expect(resourceValues).toContain('reports');
			expect(resourceValues).toContain('configuration');
		});
	});

	describe('Operations', () => {
		const getOperationsForResource = (resource: string) => {
			return toastNode.description.properties.filter(
				(p) =>
					p.name === 'operation' &&
					p.displayOptions?.show?.resource?.includes(resource),
			);
		};

		it('should have operations for restaurants', () => {
			const ops = getOperationsForResource('restaurants');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for orders', () => {
			const ops = getOperationsForResource('orders');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for checks', () => {
			const ops = getOperationsForResource('checks');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for payments', () => {
			const ops = getOperationsForResource('payments');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for menu', () => {
			const ops = getOperationsForResource('menu');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for labor', () => {
			const ops = getOperationsForResource('labor');
			expect(ops.length).toBeGreaterThan(0);
		});

		it('should have operations for reports', () => {
			const ops = getOperationsForResource('reports');
			expect(ops.length).toBeGreaterThan(0);
		});
	});
});

describe('Toast Trigger Node', () => {
	let toastTrigger: ToastTrigger;

	beforeEach(() => {
		toastTrigger = new ToastTrigger();
	});

	describe('Node Description', () => {
		it('should have correct display name', () => {
			expect(toastTrigger.description.displayName).toBe('Toast Trigger');
		});

		it('should have correct name', () => {
			expect(toastTrigger.description.name).toBe('toastTrigger');
		});

		it('should be in trigger group', () => {
			expect(toastTrigger.description.group).toContain('trigger');
		});

		it('should have no inputs', () => {
			expect(toastTrigger.description.inputs).toEqual([]);
		});

		it('should have one output', () => {
			expect(toastTrigger.description.outputs).toEqual(['main']);
		});
	});

	describe('Events', () => {
		it('should have 11 event types', () => {
			const eventProperty = toastTrigger.description.properties.find(
				(p) => p.name === 'event',
			);
			expect(eventProperty).toBeDefined();
			expect(eventProperty?.type).toBe('options');
			
			const options = (eventProperty as any)?.options;
			expect(options).toHaveLength(11);
		});

		it('should include all required events', () => {
			const eventProperty = toastTrigger.description.properties.find(
				(p) => p.name === 'event',
			);
			const options = (eventProperty as any)?.options;
			const eventValues = options.map((o: any) => o.value);

			expect(eventValues).toContain('orderCreated');
			expect(eventValues).toContain('orderPaid');
			expect(eventValues).toContain('orderCompleted');
			expect(eventValues).toContain('checkCreated');
			expect(eventValues).toContain('checkClosed');
			expect(eventValues).toContain('paymentProcessed');
			expect(eventValues).toContain('menuItemUpdated');
			expect(eventValues).toContain('employeeClockedIn');
			expect(eventValues).toContain('employeeClockedOut');
			expect(eventValues).toContain('guestCreated');
			expect(eventValues).toContain('inventoryLow');
		});
	});

	describe('Webhook Configuration', () => {
		it('should have webhook configuration', () => {
			expect(toastTrigger.description.webhooks).toBeDefined();
			expect(toastTrigger.description.webhooks).toHaveLength(1);
		});

		it('should use POST method', () => {
			const webhook = toastTrigger.description.webhooks![0];
			expect(webhook.httpMethod).toBe('POST');
		});

		it('should respond on receive', () => {
			const webhook = toastTrigger.description.webhooks![0];
			expect(webhook.responseMode).toBe('onReceived');
		});
	});
});
