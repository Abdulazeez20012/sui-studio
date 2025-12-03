import React, { useState } from 'react';
import { Lock, Crown } from 'lucide-react';
import { SubscriptionTier } from '../../services/subscriptionService';
import { useSubscription } from '../../hooks/useSubscription';
import SubscriptionModal from './SubscriptionModal';

interface FeatureGateProps {
  requiredTier: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  requiredTier,
  children,
  fallback,
  featureName = 'This feature',
}) => {
  const { canAccessFeature, loading } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sui-cyan" />
      </div>
    );
  }

  if (canAccessFeature(requiredTier)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const getTierName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.PRO:
        return 'Pro';
      case SubscriptionTier.TEAM:
        return 'Team';
      case SubscriptionTier.ENTERPRISE:
        return 'Enterprise';
      default:
        return 'Premium';
    }
  };

  const tierName = getTierName(requiredTier);

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-dark-surface/95 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 rounded-full bg-sui-cyan/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-sui-cyan" size={32} />
            </div>
            <h3 className="text-xl font-black text-white mb-2 font-tech">
              {tierName} Feature
            </h3>
            <p className="text-slate-400 mb-6 font-tech">
              {featureName} requires a {tierName} subscription or higher
            </p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-6 py-3 bg-sui-cyan text-black rounded-lg font-tech font-bold hover:shadow-neon transition-all flex items-center gap-2 mx-auto"
            >
              <Crown size={20} />
              Upgrade to {tierName}
            </button>
          </div>
        </div>
        <div className="opacity-30 pointer-events-none">{children}</div>
      </div>

      {showUpgrade && (
        <SubscriptionModal
          isOpen={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          defaultTier={requiredTier}
        />
      )}
    </>
  );
};

export default FeatureGate;
