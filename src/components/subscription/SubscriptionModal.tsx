import React, { useState } from 'react';
import { X, Check, Zap, Users, Building2, Loader } from 'lucide-react';
import { subscriptionService, SubscriptionTier, SubscriptionDuration } from '../../services/subscriptionService';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: SubscriptionTier;
}

export default function SubscriptionModal({ isOpen, onClose, defaultTier }: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(defaultTier || SubscriptionTier.PRO);
  const [selectedDuration, setSelectedDuration] = useState<SubscriptionDuration>(SubscriptionDuration.MONTHLY);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  if (!isOpen) return null;

  const tiers = [
    {
      id: SubscriptionTier.PRO,
      name: 'Pro',
      icon: <Zap size={24} />,
      color: 'sui-cyan',
      features: ['All IDE features', 'NEXI AI Assistant', 'Unlimited projects', 'Gas optimization', 'Code compilation'],
    },
    {
      id: SubscriptionTier.TEAM,
      name: 'Team',
      icon: <Users size={24} />,
      color: 'neon-purple',
      features: ['Everything in Pro', 'Real-time collaboration', 'Team management', 'Shared workspaces', 'Video/voice chat'],
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: 'Enterprise',
      icon: <Building2 size={24} />,
      color: 'neon-pink',
      features: ['Everything in Team', 'Priority support', 'Custom integrations', 'SLA guarantee', 'Dedicated account manager'],
    },
  ];

  const handlePurchase = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first');
      return;
    }

    setIsPurchasing(true);
    try {
      const tx = subscriptionService.createPurchaseTransaction(selectedTier, selectedDuration);

      signAndExecute(
        { transaction: tx as any },
        {
          onSuccess: (result) => {
            const explorerUrl = subscriptionService.getExplorerUrl(result.digest);
            alert(`Subscription purchased successfully! View on explorer: ${explorerUrl}`);
            onClose();
          },
          onError: (error) => {
            console.error('Purchase failed:', error);
            alert(`Purchase failed: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Purchase error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsPurchasing(false);
    }
  };

  const selectedTierData = tiers.find(t => t.id === selectedTier)!;
  const price = subscriptionService.getPrice(selectedTier, selectedDuration);
  const savings = selectedDuration === SubscriptionDuration.YEARLY ? '2 months free!' : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-sui-cyan/30 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-sui-cyan/20 flex items-center justify-between sticky top-0 bg-dark-surface z-10">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider font-tech">
            Upgrade to Premium
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-sui-cyan/10 rounded-lg transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Tier Selection */}
        <div className="p-6 grid md:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedTier === tier.id
                  ? `border-${tier.color} bg-${tier.color}/10 shadow-neon`
                  : 'border-sui-cyan/20 hover:border-sui-cyan/40'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-${tier.color}/20 flex items-center justify-center mb-4 text-${tier.color}`}>
                {tier.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-2 font-tech">{tier.name}</h3>
              <div className="space-y-2 mb-4">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={16} className={`text-${tier.color} flex-shrink-0 mt-0.5`} />
                    <span className="font-tech">{feature}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Duration Selection */}
        <div className="px-6 pb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedDuration(SubscriptionDuration.MONTHLY)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all font-tech ${
                selectedDuration === SubscriptionDuration.MONTHLY
                  ? 'border-sui-cyan bg-sui-cyan/10 text-white'
                  : 'border-sui-cyan/20 text-slate-400 hover:border-sui-cyan/40'
              }`}
            >
              <div className="text-lg font-bold">Monthly</div>
              <div className="text-sm">Pay month-to-month</div>
            </button>
            <button
              onClick={() => setSelectedDuration(SubscriptionDuration.YEARLY)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all font-tech relative ${
                selectedDuration === SubscriptionDuration.YEARLY
                  ? 'border-neon-green bg-neon-green/10 text-white'
                  : 'border-sui-cyan/20 text-slate-400 hover:border-sui-cyan/40'
              }`}
            >
              <div className="absolute -top-2 right-2 px-2 py-0.5 bg-neon-green text-black text-xs font-bold rounded">
                SAVE 17%
              </div>
              <div className="text-lg font-bold">Yearly</div>
              <div className="text-sm">2 months free!</div>
            </button>
          </div>

          {/* Price Summary */}
          <div className="bg-dark-panel border border-sui-cyan/20 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-white font-tech">{selectedTierData.name} Plan</h4>
                <p className="text-sm text-slate-400 font-tech">
                  {selectedDuration === SubscriptionDuration.MONTHLY ? 'Billed monthly' : 'Billed annually'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-sui-cyan font-tech">{price} SUI</div>
                {savings && <div className="text-sm text-neon-green font-tech">{savings}</div>}
              </div>
            </div>
            
            {selectedDuration === SubscriptionDuration.YEARLY && (
              <div className="text-sm text-slate-400 font-tech">
                Equivalent to {(price / 12).toFixed(1)} SUI per month
              </div>
            )}
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isPurchasing || !currentAccount}
            className={`w-full py-4 px-6 rounded-lg font-tech font-bold text-lg transition-all ${
              isPurchasing || !currentAccount
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : `bg-${selectedTierData.color} text-black hover:shadow-neon`
            }`}
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="animate-spin" size={20} />
                Processing...
              </div>
            ) : !currentAccount ? (
              'Connect Wallet to Purchase'
            ) : (
              `Purchase ${selectedTierData.name} - ${price} SUI`
            )}
          </button>

          {!currentAccount && (
            <p className="text-sm text-slate-400 text-center mt-2 font-tech">
              Connect your Sui wallet to purchase a subscription
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
