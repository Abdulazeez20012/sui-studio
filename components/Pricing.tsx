import React, { useState } from 'react';
import Section from './ui/Section';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Users, Building2, X } from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly';
type PlanId = 'pro' | 'team' | 'enterprise';

interface Plan {
  id: PlanId;
  name: string;
  icon: React.ElementType;
  priceSui: number;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    icon: Zap,
    priceSui: 10,
    features: [
      'All IDE features',
      'NEXI AI Assistant',
      'Unlimited projects',
      'Gas optimization',
      'Code compilation',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    icon: Users,
    priceSui: 50,
    features: [
      'Everything in Pro',
      'Real-time collaboration',
      'Team management',
      'Shared workspaces',
      'Video/voice chat',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    priceSui: 200, // Custom in typical flows, but simplified for this UI
    features: [
      'Everything in Team',
      'Priority support',
      'Custom integrations',
      'SLA guarantee',
      'Dedicated account manager',
    ],
  },
];

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('pro');

  const currentPlan = PLANS.find((p) => p.id === selectedPlan) || PLANS[0];
  const totalPrice = billing === 'yearly' ? currentPlan.priceSui * 10 : currentPlan.priceSui; // 2 months free

  return (
    <Section id="pricing" className="py-24 px-4 bg-[#000000] relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-sui-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Main Panel Container */}
        <div className="bg-[#0B0F14] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
            <h2 className="text-2xl font-bold tracking-widest text-white uppercase">
              Upgrade to Premium
            </h2>
            {/* Close Button visual (decorative for section, functional for modal) */}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`group relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer h-full min-h-[300px] flex flex-col
                                ${isSelected
                      ? 'border-[#3B82F6] bg-[#3B82F6]/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                    }
                            `}
                >
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors
                                ${isSelected ? 'bg-[#3B82F6] text-white' : 'bg-white/10 text-slate-400'}
                            `}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-6">{plan.name}</h3>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-[#3B82F6]' : 'text-slate-500'}`} />
                        <span className={`${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Billing Toggle (Big Buttons) */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <button
              onClick={() => setBilling('monthly')}
              className={`p-6 rounded-xl border transition-all text-center group
                        ${billing === 'monthly'
                  ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]'
                }
                    `}
            >
              <div className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Monthly</div>
              <div className="text-sm opacity-60">Pay month-to-month</div>
            </button>

            <button
              onClick={() => setBilling('yearly')}
              className={`p-6 rounded-xl border transition-all text-center group relative overflow-hidden
                         ${billing === 'yearly'
                  ? 'border-[#3B82F6] bg-[#3B82F6]/10 text-white'
                  : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]'
                }
                    `}
            >
              <div className="text-lg font-bold mb-1 group-hover:text-white transition-colors">Yearly</div>
              <div className="text-sm opacity-60">2 months free!</div>

              {/* Save Badge */}
              <div className="absolute top-3 right-3 text-[10px] font-bold tracking-wider text-green-400">
                SAVE 17%
              </div>
            </button>
          </div>

          {/* Summary Footer */}
          <div className="bg-[#05070A] rounded-xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div className="text-white font-bold text-lg mb-1">
                {currentPlan.name} Plan
              </div>
              <div className="text-slate-500 text-sm">
                Billed {billing}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-sui-cyan tabular-nums tracking-tight">
                {totalPrice} SUI
              </span>
            </div>
          </div>

          {/* Main CTA */}
          <button className="w-full py-5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
            Purchase {currentPlan.name} - {totalPrice} SUI
          </button>

        </div>
      </div>
    </Section>
  );
};

export default Pricing;
