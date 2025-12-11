import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export interface SponsorConfig {
  sponsorAddress: string;
  maxGasBudget: number;
  allowedUsers?: string[];
  allowedPackages?: string[];
  dailyLimit?: number;
}

export interface SponsoredTransaction {
  id: string;
  transactionBytes: Uint8Array;
  userAddress: string;
  sponsorAddress: string;
  gasUsed: number;
  status: 'pending' | 'sponsored' | 'executed' | 'failed';
  createdAt: Date;
  executedAt?: Date;
}

export interface GasStation {
  id: string;
  name: string;
  sponsorAddress: string;
  balance: number;
  config: SponsorConfig;
  stats: {
    totalSponsored: number;
    totalGasUsed: number;
    transactionsToday: number;
  };
}

class SponsoredTransactionsService {
  private gasStations: Map<string, GasStation> = new Map();
  private sponsoredTxs: Map<string, SponsoredTransaction> = new Map();
  private clients: Map<string, SuiClient> = new Map();
  private sponsorKeypairs: Map<string, Ed25519Keypair> = new Map();

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
   * Create a gas station
   */
  createGasStation(
    name: string,
    sponsorKeypair: Ed25519Keypair,
    config: SponsorConfig
  ): GasStation {
    const station: GasStation = {
      id: `station_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      sponsorAddress: sponsorKeypair.toSuiAddress(),
      balance: 0,
      config,
      stats: {
        totalSponsored: 0,
        totalGasUsed: 0,
        transactionsToday: 0,
      },
    };

    this.gasStations.set(station.id, station);
    this.sponsorKeypairs.set(station.id, sponsorKeypair);

    return station;
  }

  /**
   * Get gas station
   */
  getGasStation(stationId: string): GasStation | null {
    return this.gasStations.get(stationId) || null;
  }

  /**
   * Check if user is eligible for sponsorship
   */
  async isEligibleForSponsorship(
    stationId: string,
    userAddress: string,
    packageId?: string
  ): Promise<{ eligible: boolean; reason?: string }> {
    const station = this.gasStations.get(stationId);
    if (!station) {
      return { eligible: false, reason: 'Gas station not found' };
    }

    // Check allowed users
    if (station.config.allowedUsers && station.config.allowedUsers.length > 0) {
      if (!station.config.allowedUsers.includes(userAddress)) {
        return { eligible: false, reason: 'User not in allowlist' };
      }
    }

    // Check allowed packages
    if (packageId && station.config.allowedPackages && station.config.allowedPackages.length > 0) {
      if (!station.config.allowedPackages.includes(packageId)) {
        return { eligible: false, reason: 'Package not in allowlist' };
      }
    }

    // Check daily limit
    if (station.config.dailyLimit && station.stats.transactionsToday >= station.config.dailyLimit) {
      return { eligible: false, reason: 'Daily limit reached' };
    }

    // Check balance
    if (station.balance < station.config.maxGasBudget) {
      return { eligible: false, reason: 'Insufficient sponsor balance' };
    }

    return { eligible: true };
  }

  /**
   * Sponsor a transaction
   */
  async sponsorTransaction(
    stationId: string,
    transaction: Transaction,
    userAddress: string,
    network: string = 'testnet'
  ): Promise<SponsoredTransaction> {
    const station = this.gasStations.get(stationId);
    if (!station) {
      throw new Error('Gas station not found');
    }

    const sponsorKeypair = this.sponsorKeypairs.get(stationId);
    if (!sponsorKeypair) {
      throw new Error('Sponsor keypair not found');
    }

    // Check eligibility
    const eligibility = await this.isEligibleForSponsorship(stationId, userAddress);
    if (!eligibility.eligible) {
      throw new Error(`Not eligible for sponsorship: ${eligibility.reason}`);
    }

    const client = this.getClient(network);

    // Set gas sponsor
    transaction.setSender(userAddress);
    transaction.setGasOwner(station.sponsorAddress);
    transaction.setGasBudget(station.config.maxGasBudget);

    // Build transaction
    const bytes = await transaction.build({ client });

    const sponsoredTx: SponsoredTransaction = {
      id: `sponsored_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionBytes: bytes,
      userAddress,
      sponsorAddress: station.sponsorAddress,
      gasUsed: 0,
      status: 'sponsored',
      createdAt: new Date(),
    };

    this.sponsoredTxs.set(sponsoredTx.id, sponsoredTx);

    // Update stats
    station.stats.totalSponsored++;
    station.stats.transactionsToday++;

    return sponsoredTx;
  }

  /**
   * Execute sponsored transaction
   */
  async executeSponsoredTransaction(
    txId: string,
    userSignature: string,
    network: string = 'testnet'
  ): Promise<{ digest: string; effects: any }> {
    const sponsoredTx = this.sponsoredTxs.get(txId);
    if (!sponsoredTx) {
      throw new Error('Sponsored transaction not found');
    }

    const station = Array.from(this.gasStations.values()).find(
      s => s.sponsorAddress === sponsoredTx.sponsorAddress
    );
    if (!station) {
      throw new Error('Gas station not found');
    }

    const sponsorKeypair = this.sponsorKeypairs.get(station.id);
    if (!sponsorKeypair) {
      throw new Error('Sponsor keypair not found');
    }

    const client = this.getClient(network);

    try {
      // In production, you would combine user signature with sponsor signature
      // and execute the transaction with both signatures
      
      // For now, we'll simulate the execution
      sponsoredTx.status = 'executed';
      sponsoredTx.executedAt = new Date();

      // Update station stats
      station.stats.totalGasUsed += sponsoredTx.gasUsed;

      return {
        digest: `0x${Math.random().toString(16).substr(2)}`,
        effects: { status: { status: 'success' } },
      };
    } catch (error: any) {
      sponsoredTx.status = 'failed';
      throw error;
    }
  }

  /**
   * Get sponsored transaction
   */
  getSponsoredTransaction(txId: string): SponsoredTransaction | null {
    return this.sponsoredTxs.get(txId) || null;
  }

  /**
   * Get all gas stations
   */
  getAllGasStations(): GasStation[] {
    return Array.from(this.gasStations.values());
  }

  /**
   * Update gas station balance
   */
  async updateStationBalance(stationId: string, network: string = 'testnet'): Promise<number> {
    const station = this.gasStations.get(stationId);
    if (!station) {
      throw new Error('Gas station not found');
    }

    const client = this.getClient(network);

    try {
      const balance = await client.getBalance({
        owner: station.sponsorAddress,
      });

      station.balance = parseInt(balance.totalBalance);
      return station.balance;
    } catch (error) {
      console.error('Error updating station balance:', error);
      return station.balance;
    }
  }

  /**
   * Reset daily stats (call this daily)
   */
  resetDailyStats(): void {
    for (const station of this.gasStations.values()) {
      station.stats.transactionsToday = 0;
    }
  }

  /**
   * Get station statistics
   */
  getStationStats(stationId: string): GasStation['stats'] | null {
    const station = this.gasStations.get(stationId);
    return station ? station.stats : null;
  }
}

export const sponsoredTransactionsService = new SponsoredTransactionsService();

// Reset daily stats at midnight
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    sponsoredTransactionsService.resetDailyStats();
  }
}, 60000); // Check every minute
