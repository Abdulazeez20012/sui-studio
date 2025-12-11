import { describe, it, expect } from '@jest/globals';
import { dynamicFieldsService } from '../dynamicFields';

describe('DynamicFieldsService', () => {
  describe('Field Type Inference', () => {
    it('should infer null type', () => {
      const type = dynamicFieldsService.inferFieldType(null);
      expect(type).toBe('null');
    });

    it('should infer array type', () => {
      const type = dynamicFieldsService.inferFieldType([1, 2, 3]);
      expect(type).toBe('array');
    });

    it('should infer object type', () => {
      const type = dynamicFieldsService.inferFieldType({ key: 'value' });
      expect(type).toBe('object');
    });

    it('should infer object type from type field', () => {
      const type = dynamicFieldsService.inferFieldType({ type: 'CustomType' });
      expect(type).toBe('CustomType');
    });

    it('should infer primitive types', () => {
      expect(dynamicFieldsService.inferFieldType('string')).toBe('string');
      expect(dynamicFieldsService.inferFieldType(123)).toBe('number');
      expect(dynamicFieldsService.inferFieldType(true)).toBe('boolean');
    });
  });

  describe('Field Value Formatting', () => {
    it('should format null values', () => {
      const formatted = dynamicFieldsService.formatFieldValue(null);
      expect(formatted).toBe('null');
    });

    it('should format undefined values', () => {
      const formatted = dynamicFieldsService.formatFieldValue(undefined);
      expect(formatted).toBe('null');
    });

    it('should format string values', () => {
      const formatted = dynamicFieldsService.formatFieldValue('Hello World');
      expect(formatted).toBe('Hello World');
    });

    it('should truncate long strings', () => {
      const longString = 'a'.repeat(100);
      const formatted = dynamicFieldsService.formatFieldValue(longString, 50);
      
      expect(formatted.length).toBeLessThan(longString.length);
      expect(formatted).toContain('...');
    });

    it('should format numbers', () => {
      const formatted = dynamicFieldsService.formatFieldValue(123);
      expect(formatted).toBe('123');
    });

    it('should format booleans', () => {
      expect(dynamicFieldsService.formatFieldValue(true)).toBe('true');
      expect(dynamicFieldsService.formatFieldValue(false)).toBe('false');
    });

    it('should format arrays', () => {
      const formatted = dynamicFieldsService.formatFieldValue([1, 2, 3, 4, 5]);
      expect(formatted).toBe('Array(5)');
    });

    it('should format objects', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const formatted = dynamicFieldsService.formatFieldValue(obj);
      
      expect(formatted).toContain('Object{');
      expect(formatted).toContain('a, b, c');
    });
  });
});
