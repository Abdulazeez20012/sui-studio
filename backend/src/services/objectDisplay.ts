import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl } from '@mysten/sui/client';

export interface DisplayMetadata {
  name?: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  creator?: string;
  [key: string]: any;
}

export interface ObjectDisplay {
  objectId: string;
  objectType: string;
  display: DisplayMetadata;
  fields: Record<string, any>;
  owner: string;
}

class ObjectDisplayService {
  private clients: Map<string, SuiClient> = new Map();
  private displayCache: Map<string, ObjectDisplay> = new Map();

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
   * Get object display metadata
   */
  async getObjectDisplay(
    objectId: string,
    network: string = 'testnet'
  ): Promise<ObjectDisplay> {
    // Check cache
    const cacheKey = `${network}:${objectId}`;
    if (this.displayCache.has(cacheKey)) {
      return this.displayCache.get(cacheKey)!;
    }

    const client = this.getClient(network);

    try {
      // Get object data
      const object = await client.getObject({
        id: objectId,
        options: {
          showContent: true,
          showDisplay: true,
          showOwner: true,
          showType: true,
        },
      });

      if (!object.data) {
        throw new Error('Object not found');
      }

      // Extract display metadata
      const display: DisplayMetadata = {};
      if (object.data.display && 'data' in object.data.display) {
        Object.assign(display, object.data.display.data);
      }

      // Extract fields
      const fields: Record<string, any> = {};
      if (object.data.content && 'fields' in object.data.content) {
        Object.assign(fields, object.data.content.fields);
      }

      // Get owner
      let owner = '';
      if (object.data.owner && typeof object.data.owner === 'object') {
        if ('AddressOwner' in object.data.owner) {
          owner = object.data.owner.AddressOwner;
        } else if ('ObjectOwner' in object.data.owner) {
          owner = object.data.owner.ObjectOwner;
        }
      }

      const objectDisplay: ObjectDisplay = {
        objectId,
        objectType: object.data.type || 'Unknown',
        display,
        fields,
        owner,
      };

      // Cache the result
      this.displayCache.set(cacheKey, objectDisplay);

      return objectDisplay;
    } catch (error: any) {
      throw new Error(`Failed to get object display: ${error.message}`);
    }
  }

  /**
   * Get multiple object displays
   */
  async getMultipleObjectDisplays(
    objectIds: string[],
    network: string = 'testnet'
  ): Promise<ObjectDisplay[]> {
    const displays = await Promise.all(
      objectIds.map(id => this.getObjectDisplay(id, network).catch(() => null))
    );

    return displays.filter((d): d is ObjectDisplay => d !== null);
  }

  /**
   * Render display template
   */
  renderDisplayTemplate(display: DisplayMetadata, template: string): string {
    let rendered = template;

    // Replace template variables
    for (const [key, value] of Object.entries(display)) {
      const placeholder = `{${key}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return rendered;
  }

  /**
   * Get NFT preview data
   */
  async getNFTPreview(
    objectId: string,
    network: string = 'testnet'
  ): Promise<{
    name: string;
    description: string;
    imageUrl: string;
    attributes: Array<{ trait_type: string; value: any }>;
  }> {
    const display = await this.getObjectDisplay(objectId, network);

    // Extract NFT-specific data
    const attributes: Array<{ trait_type: string; value: any }> = [];
    
    // Look for attributes in fields
    if (display.fields.attributes) {
      if (Array.isArray(display.fields.attributes)) {
        attributes.push(...display.fields.attributes);
      }
    }

    // Look for individual trait fields
    for (const [key, value] of Object.entries(display.fields)) {
      if (key !== 'id' && key !== 'name' && key !== 'description' && key !== 'url') {
        attributes.push({
          trait_type: key,
          value,
        });
      }
    }

    return {
      name: display.display.name || display.fields.name || 'Unnamed',
      description: display.display.description || display.fields.description || '',
      imageUrl: display.display.image_url || display.fields.url || '',
      attributes,
    };
  }

  /**
   * Resolve IPFS URL to HTTP
   */
  resolveImageUrl(url: string): string {
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return url;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.displayCache.clear();
  }

  /**
   * Clear cache for specific network
   */
  clearNetworkCache(network: string): void {
    for (const key of this.displayCache.keys()) {
      if (key.startsWith(`${network}:`)) {
        this.displayCache.delete(key);
      }
    }
  }
}

export const objectDisplayService = new ObjectDisplayService();
