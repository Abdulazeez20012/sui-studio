import { describe, it, expect, beforeEach } from '@jest/globals';
import { sponsoredTransactionsService } from '../sponsoredTransactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

describe('SponsoredTransactionsService', () => {
  let testKeypair: Ed25519Keypair;

  beforeEach(() => {
    testKeypair = new Ed25519Keypair();
  });

  describe('Gas Station Management', () => {
    it('should create a gas station', () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      expect(station).toBeDefined();
      expect(station.id).toMatch(/^station_/);
      expect(station.name).toBe('Test Station');
      expect(station.sponsorAddress).toBe(testKeypair.toSuiAddress());
      expect(station.config.maxGasBudget).toBe(1000000);
      expect(station.stats.totalSponsored).toBe(0);
    });

    it('should get an existing gas station', () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      const retrieved = sponsoredTransactionsService.getGasStation(station.id);
      expect(retrieved).toEqual(station);
    });

    it('should return null for non-existent station', () => {
      const retrieved = sponsoredTransactionsService.getGasStation('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should get all gas stations', () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
      };

      sponsoredTransactionsService.createGasStation('Station 1', testKeypair, config);
      sponsoredTransactionsService.createGasStation('Station 2', testKeypair, config);

      const stations = sponsoredTransactionsService.getAllGasStations();
      expect(stations.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Eligibility Checking', () => {
    it('should check user eligibility with allowlist', async () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
        allowedUsers: ['0x123', '0x456'],
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      const eligible1 = await sponsoredTransactionsService.isEligibleForSponsorship(
        station.id,
        '0x123'
      );
      expect(eligible1.eligible).toBe(true);

      const eligible2 = await sponsoredTransactionsService.isEligibleForSponsorship(
        station.id,
        '0x789'
      );
      expect(eligible2.eligible).toBe(false);
      expect(eligible2.reason).toContain('not in allowlist');
    });

    it('should check package eligibility', async () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
        allowedPackages: ['0xabc', '0xdef'],
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      const eligible1 = await sponsoredTransactionsService.isEligibleForSponsorship(
        station.id,
        '0x123',
        '0xabc'
      );
      expect(eligible1.eligible).toBe(true);

      const eligible2 = await sponsoredTransactionsService.isEligibleForSponsorship(
        station.id,
        '0x123',
        '0xghi'
      );
      expect(eligible2.eligible).toBe(false);
      expect(eligible2.reason).toContain('not in allowlist');
    });

    it('should check daily limit', async () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
        dailyLimit: 5,
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      // Set transactions today to limit
      station.stats.transactionsToday = 5;

      const eligible = await sponsoredTransactionsService.isEligibleForSponsorship(
        station.id,
        '0x123'
      );

      expect(eligible.eligible).toBe(false);
      expect(eligible.reason).toContain('Daily limit reached');
    });
  });

  describe('Statistics', () => {
    it('should get station statistics', () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      const stats = sponsoredTransactionsService.getStationStats(station.id);

      expect(stats).toBeDefined();
      expect(stats?.totalSponsored).toBe(0);
      expect(stats?.totalGasUsed).toBe(0);
      expect(stats?.transactionsToday).toBe(0);
    });

    it('should reset daily stats', () => {
      const config = {
        sponsorAddress: testKeypair.toSuiAddress(),
        maxGasBudget: 1000000,
      };

      const station = sponsoredTransactionsService.createGasStation(
        'Test Station',
        testKeypair,
        config
      );

      station.stats.transactionsToday = 10;
      sponsoredTransactionsService.resetDailyStats();

      expect(station.stats.transactionsToday).toBe(0);
    });
  });
});
