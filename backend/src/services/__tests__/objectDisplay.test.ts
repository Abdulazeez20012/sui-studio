import { describe, it, expect, beforeEach } from '@jest/globals';
import { objectDisplayService } from '../objectDisplay';

describe('ObjectDisplayService', () => {
  beforeEach(() => {
    objectDisplayService.clearCache();
  });

  describe('Template Rendering', () => {
    it('should render display template with variables', () => {
      const display = {
        name: 'Cool NFT',
        description: 'An awesome NFT',
        image_url: 'https://example.com/image.png',
      };

      const template = 'Name: {name}, Description: {description}';
      const rendered = objectDisplayService.renderDisplayTemplate(display, template);

      expect(rendered).toBe('Name: Cool NFT, Description: An awesome NFT');
    });

    it('should handle missing variables in template', () => {
      const display = {
        name: 'Cool NFT',
      };

      const template = 'Name: {name}, Description: {description}';
      const rendered = objectDisplayService.renderDisplayTemplate(display, template);

      expect(rendered).toContain('Name: Cool NFT');
      expect(rendered).toContain('{description}'); // Unchanged
    });
  });

  describe('IPFS URL Resolution', () => {
    it('should resolve IPFS URL to HTTP', () => {
      const ipfsUrl = 'ipfs://QmXyz123';
      const resolved = objectDisplayService.resolveImageUrl(ipfsUrl);

      expect(resolved).toBe('https://ipfs.io/ipfs/QmXyz123');
    });

    it('should not modify HTTP URLs', () => {
      const httpUrl = 'https://example.com/image.png';
      const resolved = objectDisplayService.resolveImageUrl(httpUrl);

      expect(resolved).toBe(httpUrl);
    });

    it('should not modify data URLs', () => {
      const dataUrl = 'data:image/png;base64,iVBORw0KGgo=';
      const resolved = objectDisplayService.resolveImageUrl(dataUrl);

      expect(resolved).toBe(dataUrl);
    });
  });

  describe('Cache Management', () => {
    it('should clear all cache', () => {
      // This is a simple test since we can't easily mock the cache
      expect(() => {
        objectDisplayService.clearCache();
      }).not.toThrow();
    });

    it('should clear network-specific cache', () => {
      expect(() => {
        objectDisplayService.clearNetworkCache('testnet');
      }).not.toThrow();
    });
  });
});
