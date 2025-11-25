import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../apiService';

// Mock fetch
global.fetch = vi.fn();

describe('APIService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeCommand', () => {
    it('should execute command successfully', async () => {
      const mockResponse = {
        success: true,
        output: 'BUILDING MovePackage\nBuild Successful',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.executeCommand('sui move build');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Build Successful');
    });

    it('should fallback to simulation when backend fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.executeCommand('sui move build');

      expect(result.success).toBe(true);
      expect(result.output).toContain('BUILDING MovePackage');
    });

    it('should simulate test command', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.executeCommand('sui move test');

      expect(result.success).toBe(true);
      expect(result.output).toContain('Running Move unit tests');
      expect(result.output).toContain('PASS');
    });
  });

  describe('compileCode', () => {
    it('should compile code successfully', async () => {
      const mockResponse = {
        success: true,
        bytecode: 'mock-bytecode',
        modules: ['module1', 'module2'],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.compileCode('module test {}', 'test');

      expect(result.success).toBe(true);
      expect(result.bytecode).toBe('mock-bytecode');
    });
  });

  describe('publishContract', () => {
    it('should publish contract successfully', async () => {
      const mockResponse = {
        success: true,
        packageId: '0x123',
        transactionDigest: '0xabc',
        gasUsed: 1000000,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.publishContract({
        code: 'module test {}',
        packageName: 'test',
        network: 'testnet',
        walletAddress: '0x456',
      });

      expect(result.success).toBe(true);
      expect(result.packageId).toBe('0x123');
    });

    it('should fallback to simulation when backend fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.publishContract({
        code: 'module test {}',
        packageName: 'test',
        network: 'testnet',
        walletAddress: '0x456',
      });

      expect(result.success).toBe(true);
      expect(result.packageId).toBeDefined();
      expect(result.simulated).toBe(true);
    });
  });

  describe('deployToWalrus', () => {
    it('should deploy to Walrus successfully', async () => {
      const mockResponse = {
        success: true,
        blobId: 'abc123',
        url: 'https://walrus.site/abc123',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.deployToWalrus({
        projectName: 'test',
        files: [{ name: 'test.move', content: 'module test {}' }],
      });

      expect(result.success).toBe(true);
      expect(result.blobId).toBe('abc123');
      expect(result.url).toContain('walrus.site');
    });

    it('should fallback to simulation when Walrus fails', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await apiService.deployToWalrus({
        projectName: 'test',
        files: [{ name: 'test.move', content: 'module test {}' }],
      });

      expect(result.success).toBe(true);
      expect(result.blobId).toBeDefined();
      expect(result.simulated).toBe(true);
    });
  });
});
