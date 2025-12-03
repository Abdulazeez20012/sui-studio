/**
 * Subscription Service
 * Handles premium subscription purchases and management via Sui blockchain
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';

// Contract configuration from environment
const PACKAGE_ID = import.meta.env.VITE_SUBSCRIPTION_PACKAGE_ID;
const TREASURY_ID = import.meta.env.VITE_SUBSCRIPTION_TREASURY_ID;
const PRICING_ID = import.meta.env.VITE_SUBSCRIPTION_PRICING_ID;
const CLOCK_ID = import.meta.env.VITE_SUBSCRIPTION_CLOCK_ID || '0x6';
const RPC_URL = import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io:443';

// Subscription tiers
export enum SubscriptionTier {
  PRO = 1,
  TEAM = 2,
  ENTERPRISE = 3,
}

// Subscription duration
export enum SubscriptionDuration {
  MONTHLY = 1,
  YEARLY = 12,
}

// Pricing in MIST (1 SUI = 1,000,000,000 MIST)
export const SUBSCRIPTION_PRICES = {
  [SubscriptionTier.PRO]: {
    [SubscriptionDuration.MONTHLY]: 10_000_000_000, // 10 SUI
    [SubscriptionDuration.YEARLY]: 100_000_000_000, // 100 SUI
  },
  [SubscriptionTier.TEAM]: {
    [SubscriptionDuration.MONTHLY]: 50_000_000_000, // 50 SUI
    [SubscriptionDuration.YEARLY]: 500_000_000_000, // 500 SUI
  },
  [SubscriptionTier.ENTERPRISE]: {
    [SubscriptionDuration.MONTHLY]: 200_000_000_000, // 200 SUI
    [SubscriptionDuration.YEARLY]: 2_000_000_000_000, // 2000 SUI
  },
};

export interface SubscriptionDetails {
  tier: number;
  expiresAt: number;
  userAddress: string;
  issuedAt: number;
  autoRenew: boolean;
  isActive: boolean;
  daysRemaining: number;
}

class SubscriptionService {
  private client: SuiClient;

  constructor() {
    this.client = new SuiClient({ url: RPC_URL });
  }

  /**
   * Create a transaction to purchase a subscription
   */
  createPurchaseTransaction(
    tier: SubscriptionTier,
    duration: SubscriptionDuration
  ): Transaction {
    const tx = new Transaction();

    // Get the price for this tier and duration
    const price = SUBSCRIPTION_PRICES[tier][duration];

    // Split coin for payment
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(price)]);

    // Call purchase_subscription function
    tx.moveCall({
      target: `${PACKAGE_ID}::premium_subscription::purchase_subscription`,
      arguments: [
        coin,
        tx.pure.u8(tier),
        tx.pure.u8(duration),
        tx.object(TREASURY_ID),
        tx.object(PRICING_ID),
        tx.object(CLOCK_ID),
      ],
    });

    return tx;
  }

  /**
   * Create a transaction to renew a subscription
   */
  createRenewalTransaction(
    nftId: string,
    duration: SubscriptionDuration,
    tier: SubscriptionTier
  ): Transaction {
    const tx = new Transaction();

    // Get the price
    const price = SUBSCRIPTION_PRICES[tier][duration];

    // Split coin for payment
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(price)]);

    // Call renew_subscription function
    tx.moveCall({
      target: `${PACKAGE_ID}::premium_subscription::renew_subscription`,
      arguments: [
        tx.object(nftId),
        coin,
        tx.pure.u8(duration),
        tx.object(TREASURY_ID),
        tx.object(PRICING_ID),
        tx.object(CLOCK_ID),
      ],
    });

    return tx;
  }

  /**
   * Create a transaction to cancel a subscription
   */
  createCancellationTransaction(nftId: string): TransactionBlock {
    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${PACKAGE_ID}::premium_subscription::cancel_subscription`,
      arguments: [tx.object(nftId), tx.object(CLOCK_ID)],
    });

    return tx;
  }

  /**
   * Get subscription details from NFT
   */
  async getSubscriptionDetails(nftId: string): Promise<SubscriptionDetails | null> {
    try {
      const object = await this.client.getObject({
        id: nftId,
        options: {
          showContent: true,
        },
      });

      if (!object.data || !object.data.content || object.data.content.dataType !== 'moveObject') {
        return null;
      }

      const fields = object.data.content.fields as any;
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresAt = Number(fields.expires_at);
      const isActive = expiresAt > currentTime;
      const daysRemaining = isActive ? Math.floor((expiresAt - currentTime) / 86400) : 0;

      return {
        tier: Number(fields.tier),
        expiresAt,
        userAddress: fields.user_address,
        issuedAt: Number(fields.issued_at),
        autoRenew: fields.auto_renew,
        isActive,
        daysRemaining,
      };
    } catch (error) {
      console.error('Failed to get subscription details:', error);
      return null;
    }
  }

  /**
   * Find user's subscription NFTs
   */
  async getUserSubscriptions(userAddress: string): Promise<string[]> {
    try {
      const objects = await this.client.getOwnedObjects({
        owner: userAddress,
        filter: {
          StructType: `${PACKAGE_ID}::premium_subscription::SubscriptionNFT`,
        },
        options: {
          showContent: true,
        },
      });

      return objects.data.map((obj) => obj.data?.objectId).filter(Boolean) as string[];
    } catch (error) {
      console.error('Failed to get user subscriptions:', error);
      return [];
    }
  }

  /**
   * Get active subscription for user
   */
  async getActiveSubscription(userAddress: string): Promise<SubscriptionDetails | null> {
    const nftIds = await this.getUserSubscriptions(userAddress);

    for (const nftId of nftIds) {
      const details = await this.getSubscriptionDetails(nftId);
      if (details && details.isActive) {
        return details;
      }
    }

    return null;
  }

  /**
   * Get tier name
   */
  getTierName(tier: SubscriptionTier): string {
    switch (tier) {
      case SubscriptionTier.PRO:
        return 'Pro';
      case SubscriptionTier.TEAM:
        return 'Team';
      case SubscriptionTier.ENTERPRISE:
        return 'Enterprise';
      default:
        return 'Unknown';
    }
  }

  /**
   * Get price in SUI (human readable)
   */
  getPrice(tier: SubscriptionTier, duration: SubscriptionDuration): number {
    return SUBSCRIPTION_PRICES[tier][duration] / 1_000_000_000;
  }

  /**
   * Format price for display
   */
  formatPrice(tier: SubscriptionTier, duration: SubscriptionDuration): string {
    const price = this.getPrice(tier, duration);
    return `${price} SUI`;
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(digest: string): string {
    const network = import.meta.env.VITE_SUI_NETWORK || 'testnet';
    return `https://suiexplorer.com/txblock/${digest}?network=${network}`;
  }

  /**
   * Get explorer URL for NFT
   */
  getNFTExplorerUrl(nftId: string): string {
    const network = import.meta.env.VITE_SUI_NETWORK || 'testnet';
    return `https://suiexplorer.com/object/${nftId}?network=${network}`;
  }
}

export const subscriptionService = new SubscriptionService();
