import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { subscriptionService, SubscriptionDetails, SubscriptionTier } from '../services/subscriptionService';

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentAccount = useCurrentAccount();

  useEffect(() => {
    loadSubscription();
  }, [currentAccount?.address]);

  const loadSubscription = async () => {
    if (!currentAccount?.address) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const sub = await subscriptionService.getActiveSubscription(currentAccount.address);
      setSubscription(sub);
    } catch (err: any) {
      console.error('Failed to load subscription:', err);
      setError(err.message);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const hasActivePlan = () => {
    return subscription?.isActive ?? false;
  };

  const hasTier = (tier: SubscriptionTier) => {
    if (!subscription?.isActive) return false;
    return subscription.tier >= tier;
  };

  const isPro = () => hasTier(SubscriptionTier.PRO);
  const isTeam = () => hasTier(SubscriptionTier.TEAM);
  const isEnterprise = () => hasTier(SubscriptionTier.ENTERPRISE);

  const canAccessFeature = (requiredTier: SubscriptionTier) => {
    return hasTier(requiredTier);
  };

  return {
    subscription,
    loading,
    error,
    hasActivePlan,
    hasTier,
    isPro,
    isTeam,
    isEnterprise,
    canAccessFeature,
    refresh: loadSubscription,
  };
};
