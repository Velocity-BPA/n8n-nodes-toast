/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { parseJson, buildDateRangeParams, formatOutput } from '../../nodes/Toast/transport';

describe('Transport Utilities', () => {
	describe('parseJson', () => {
		it('should parse valid JSON string', () => {
			const json = '{"name": "test", "value": 123}';
			const result = parseJson(json, 'testField');
			expect(result).toEqual({ name: 'test', value: 123 });
		});

		it('should throw error for invalid JSON', () => {
			const invalidJson = '{invalid json}';
			expect(() => parseJson(invalidJson, 'testField')).toThrow(
				'Invalid JSON in field "testField"',
			);
		});

		it('should throw error for non-object JSON', () => {
			const nonObject = '"just a string"';
			expect(() => parseJson(nonObject, 'testField')).toThrow(
				'Invalid JSON in field "testField"',
			);
		});

		it('should handle empty object', () => {
			const emptyJson = '{}';
			const result = parseJson(emptyJson, 'testField');
			expect(result).toEqual({});
		});

		it('should handle nested objects', () => {
			const nestedJson = '{"outer": {"inner": {"value": 42}}}';
			const result = parseJson(nestedJson, 'testField');
			expect(result).toEqual({ outer: { inner: { value: 42 } } });
		});
	});

	describe('buildDateRangeParams', () => {
		it('should return empty object when no dates provided', () => {
			const result = buildDateRangeParams();
			expect(result).toEqual({});
		});

		it('should return startDate when only startDate provided', () => {
			const result = buildDateRangeParams('2024-01-01T00:00:00Z');
			expect(result).toHaveProperty('startDate');
			expect(result.startDate).toBe('2024-01-01T00:00:00.000Z');
		});

		it('should return endDate when only endDate provided', () => {
			const result = buildDateRangeParams(undefined, '2024-12-31T23:59:59Z');
			expect(result).toHaveProperty('endDate');
			expect(result.endDate).toBe('2024-12-31T23:59:59.000Z');
		});

		it('should return both dates when both provided', () => {
			const result = buildDateRangeParams('2024-01-01', '2024-12-31');
			expect(result).toHaveProperty('startDate');
			expect(result).toHaveProperty('endDate');
		});
	});

	describe('formatOutput', () => {
		it('should format single object to execution data array', () => {
			const input = { id: 1, name: 'test' };
			const result = formatOutput(input);
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({ json: { id: 1, name: 'test' } });
		});

		it('should format array of objects to execution data array', () => {
			const input = [
				{ id: 1, name: 'test1' },
				{ id: 2, name: 'test2' },
			];
			const result = formatOutput(input);
			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ json: { id: 1, name: 'test1' } });
			expect(result[1]).toEqual({ json: { id: 2, name: 'test2' } });
		});

		it('should handle empty array', () => {
			const result = formatOutput([]);
			expect(result).toEqual([]);
		});

		it('should handle complex nested objects', () => {
			const input = {
				order: {
					id: 'abc123',
					items: [{ name: 'Burger', price: 9.99 }],
				},
			};
			const result = formatOutput(input);
			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(input);
		});
	});
});
