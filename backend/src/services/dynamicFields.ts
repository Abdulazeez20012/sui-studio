import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl } from '@mysten/sui/client';

export interface DynamicField {
  name: {
    type: string;
    value: any;
  };
  bcsName: string;
  type: string;
  objectType: string;
  objectId: string;
  version: string;
  digest: string;
}

export interface DynamicFieldValue {
  type: string;
  fields: Record<string, any>;
  hasPublicTransfer: boolean;
}

export interface DynamicFieldTree {
  objectId: string;
  fields: Array<{
    field: DynamicField;
    value?: DynamicFieldValue;
    children?: DynamicFieldTree;
  }>;
}

class DynamicFieldsService {
  private clients: Map<string, SuiClient> = new Map();

  /**
   * Get or create Sui client for network
   */
  private getClient(network: string): SuiClient {
    if (!this.clients.has(network)) {
      const url = getFullnodeUrl(network as any);
      this.clients.set(network, new SuiClient({ url }));
    }
    return this.clients.get(network)!;
  }

  /**
   * Get all dynamic fields for an object
   */
  async getDynamicFields(
    objectId: string,
    network: string = 'testnet'
  ): Promise<DynamicField[]> {
    const client = this.getClient(network);

    try {
      const fields: DynamicField[] = [];
      let cursor: string | null | undefined = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await client.getDynamicFields({
          parentId: objectId,
          cursor,
        });

        fields.push(...response.data);
        hasNextPage = response.hasNextPage;
        cursor = response.nextCursor;
      }

      return fields;
    } catch (error: any) {
      throw new Error(`Failed to get dynamic fields: ${error.message}`);
    }
  }

  /**
   * Get dynamic field value
   */
  async getDynamicFieldValue(
    objectId: string,
    fieldName: any,
    network: string = 'testnet'
  ): Promise<DynamicFieldValue> {
    const client = this.getClient(network);

    try {
      const field = await client.getDynamicFieldObject({
        parentId: objectId,
        name: fieldName,
      });

      if (!field.data || !field.data.content) {
        throw new Error('Field value not found');
      }

      const content = field.data.content;
      if ('fields' in content) {
        return {
          type: field.data.type || 'Unknown',
          fields: content.fields as Record<string, any>,
          hasPublicTransfer: content.hasPublicTransfer || false,
        };
      }

      throw new Error('Invalid field content');
    } catch (error: any) {
      throw new Error(`Failed to get field value: ${error.message}`);
    }
  }

  /**
   * Get dynamic field tree (recursive)
   */
  async getDynamicFieldTree(
    objectId: string,
    network: string = 'testnet',
    maxDepth: number = 3,
    currentDepth: number = 0
  ): Promise<DynamicFieldTree> {
    if (currentDepth >= maxDepth) {
      return { objectId, fields: [] };
    }

    const fields = await this.getDynamicFields(objectId, network);
    const tree: DynamicFieldTree = {
      objectId,
      fields: [],
    };

    for (const field of fields) {
      const fieldData: DynamicFieldTree['fields'][0] = { field };

      try {
        // Get field value
        const value = await this.getDynamicFieldValue(objectId, field.name, network);
        fieldData.value = value;

        // If the field is an object, recursively get its fields
        if (field.objectId) {
          fieldData.children = await this.getDynamicFieldTree(
            field.objectId,
            network,
            maxDepth,
            currentDepth + 1
          );
        }
      } catch (error) {
        console.error(`Error getting field value:`, error);
      }

      tree.fields.push(fieldData);
    }

    return tree;
  }

  /**
   * Search dynamic fields by name
   */
  async searchDynamicFields(
    objectId: string,
    searchTerm: string,
    network: string = 'testnet'
  ): Promise<DynamicField[]> {
    const fields = await this.getDynamicFields(objectId, network);

    return fields.filter(field => {
      const nameStr = JSON.stringify(field.name.value).toLowerCase();
      return nameStr.includes(searchTerm.toLowerCase());
    });
  }

  /**
   * Get field type information
   */
  inferFieldType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') {
      if (value.type) return value.type;
      return 'object';
    }
    return typeof value;
  }

  /**
   * Format field value for display
   */
  formatFieldValue(value: any, maxLength: number = 50): string {
    if (value === null || value === undefined) {
      return 'null';
    }

    if (typeof value === 'string') {
      return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      return `Object{${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}}`;
    }

    return String(value);
  }

  /**
   * Export dynamic fields as JSON
   */
  async exportDynamicFields(
    objectId: string,
    network: string = 'testnet'
  ): Promise<string> {
    const tree = await this.getDynamicFieldTree(objectId, network);
    return JSON.stringify(tree, null, 2);
  }
}

export const dynamicFieldsService = new DynamicFieldsService();
