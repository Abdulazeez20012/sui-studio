import React, { useState } from 'react';
import Section from './ui/Section';
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
    <Section id="pricing" className="py-24 px-4 bg-transparent relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">

        {/* Main Panel Container */}
        <div className="bg-panel border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-10 border-b border-border pb-6">
            <h2 className="text-2xl font-bold tracking-widest text-content uppercase">
              Upgrade to Premium
            </h2>
            {/* Close Button visual (decorative for section, functional for modal) */}
            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center hover:bg-surface/80 cursor-pointer transition-colors">
              <X className="w-4 h-4 text-content-muted" />
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
                      ? 'border-brand bg-brand/5 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                      : 'border-border bg-surface hover:bg-surface/80 hover:border-border'
                    }
                            `}
                >
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors
                                ${isSelected ? 'bg-brand text-white' : 'bg-border text-content-muted'}
                            `}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-content mb-6">{plan.name}</h3>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-brand' : 'text-content-muted'}`} />
                        <span className={`${isSelected ? 'text-content' : 'text-content-muted'}`}>
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
                  ? 'border-brand bg-brand/10 text-content'
                  : 'border-border bg-surface text-content-muted hover:bg-surface/80'
                }
                    `}
            >
              <div className="text-lg font-bold mb-1 group-hover:text-content transition-colors">Monthly</div>
              <div className="text-sm opacity-60">Pay month-to-month</div>
            </button>

            <button
              onClick={() => setBilling('yearly')}
              className={`p-6 rounded-xl border transition-all text-center group relative overflow-hidden
                         ${billing === 'yearly'
                  ? 'border-brand bg-brand/10 text-content'
                  : 'border-border bg-surface text-content-muted hover:bg-surface/80'
                }
                    `}
            >
              <div className="text-lg font-bold mb-1 group-hover:text-content transition-colors">Yearly</div>
              <div className="text-sm opacity-60">2 months free!</div>

              {/* Save Badge */}
              <div className="absolute top-3 right-3 text-[10px] font-bold tracking-wider text-green-400">
                SAVE 17%
              </div>
            </button>
          </div>

          {/* Summary Footer */}
          <div className="bg-surface rounded-xl p-6 border border-border flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <div className="text-content font-bold text-lg mb-1">
                {currentPlan.name} Plan
              </div>
              <div className="text-content-muted text-sm">
                Billed {billing}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-brand tabular-nums tracking-tight">
                {totalPrice} SUI
              </span>
            </div>
          </div>

          {/* Main CTA */}
          <button className="w-full py-5 rounded-xl bg-brand hover:bg-brand/90 text-white font-bold text-lg tracking-wide shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(59,130,246,0.6)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
            Purchase {currentPlan.name} - {totalPrice} SUI
          </button>

        </div>
      </div>
    </Section>
  );
};

export default Pricing;
