import { describe, it, expect, beforeEach, vi } from 'vitest';
import { walrusService } from '../walrusService';

global.fetch = vi.fn();

describe('WalrusService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deployToWalrus', () => {
    it('should deploy files to Walrus successfully', async () => {
      const mockResponse = {
        newlyCreated: {
          blobObject: {
            blobId: 'test-blob-id-123',
          },
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await walrusService.deployToWalrus({
        projectName: 'test-project',
        files: [
          { name: 'main.move', content: 'module test {}' },
        ],
        network: 'testnet',
      });

      expect(result.success).toBe(true);
      expect(result.blobId).toBe('test-blob-id-123');
      expect(result.url).toBe('https://walrus.site/test-blob-id-123');
    });

    it('should handle already certified blobs', async () => {
      const mockResponse = {
        alreadyCertified: {
          blobId: 'existing-blob-id',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await walrusService.deployToWalrus({
        projectName: 'test',
        files: [{ name: 'test.move', content: 'test' }],
      });

      expect(result.success).toBe(true);
      expect(result.blobId).toBe('existing-blob-id');
    });

    it('should fallback to simulation on network error', async () => {
      // Mock fetch to reject with network error
      (global.fetch as any).mockRejectedValueOnce(new Error('fetch failed'));

      const result = await walrusService.deployToWalrus({
        projectName: 'test',
        files: [{ name: 'test.move', content: 'test' }],
      });

      // Should fallback to simulation
      expect(result.success).toBe(true);
      expect(result.blobId).toBeDefined();
      expect(result.url).toContain('walrus.site');
    });

    it('should calculate file size correctly', async () => {
      // Mock fetch to reject so it uses simulation
      (global.fetch as any).mockRejectedValueOnce(new Error('fetch failed'));

      const content = 'a'.repeat(1000);
      const result = await walrusService.deployToWalrus({
        projectName: 'test',
        files: [{ name: 'test.move', content }],
      });

      // Simulation should still calculate size
      expect(result.success).toBe(true);
      expect(result.size).toBeGreaterThan(0);
    });
  });

  describe('getWalrusUrl', () => {
    it('should generate correct Walrus URL', () => {
      const blobId = 'test-blob-123';
      const url = walrusService.getWalrusUrl(blobId);

      expect(url).toBe('https://walrus.site/test-blob-123');
    });
  });
});
