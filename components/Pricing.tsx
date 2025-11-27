import React, { useState } from 'react';
import Section from './ui/Section';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Zap, Shield } from 'lucide-react';
import { StaggerContainer, FoldInOut, ScaleReveal, FadeUp } from '../src/lib/animations';

type BillingCycle = 'monthly' | 'yearly';
type Platform = 'web' | 'desktop';

interface PricingTier {
  name: string;
  description: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  cta: string;
  icon: React.ReactNode;
}

const PRICING_DATA: Record<Platform, PricingTier[]> = {
  web: [
    {
      name: "Starter",
      description: "For hobbyists & explorers",
      price: { monthly: 0, yearly: 0 },
      icon: <Zap className="w-5 h-5" />,
      features: [
        "Unlimited Public Projects",
        "Sui Testnet Access",
        "Basic Web IDE",
        "Community Support"
      ],
      notIncluded: ["Private Repos", "Mainnet Deployments"],
      cta: "Start Free"
    },
    {
      name: "Pro Cloud",
      description: "For solo developers",
      popular: true,
      price: { monthly: 19, yearly: 15 },
      icon: <Sparkles className="w-5 h-5" />,
      features: [
        "Unlimited Private Projects",
        "Mainnet Deployment",
        "Cloud Build Runners",
        "Priority Support",
        "Smart Contract Audits (Basic)"
      ],
      cta: "Get Pro"
    },
    {
      name: "Team",
      description: "For growing startups",
      price: { monthly: 99, yearly: 79 },
      icon: <Shield className="w-5 h-5" />,
      features: [
        "5 Team Members",
        "Shared Workspaces",
        "Role-Based Access",
        "CI/CD Integration",
        "Gas Optimization Reports"
      ],
      cta: "Create Team"
    }
  ],
  desktop: [
    {
      name: "Professional",
      description: "Native power for pros",
      price: { monthly: 49, yearly: 39 },
      icon: <Zap className="w-5 h-5" />,
      features: [
        "Offline Capability",
        "Hardware Acceleration",
        "Local File System Access",
        "Advanced Debugger",
        "Mainnet Forking"
      ],
      cta: "Buy License"
    },
    {
      name: "Studio Team",
      description: "Synchronized workflow",
      popular: true,
      price: { monthly: 199, yearly: 159 },
      icon: <Sparkles className="w-5 h-5" />,
      features: [
        "All Professional Features",
        "Centralized Config Management",
        "Team Secret Sharing",
        "Priority Support Channel",
        "Dedicated Build Server"
      ],
      cta: "Upgrade Team"
    },
    {
      name: "Enterprise",
      description: "Custom scale & security",
      price: { monthly: 'Custom', yearly: 'Custom' },
      icon: <Shield className="w-5 h-5" />,
      features: [
        "SSO / SAML",
        "On-Premise Option",
        "Custom SLAs",
        "Dedicated Success Manager",
        "Security Audit Pipeline"
      ],
      cta: "Contact Sales"
    }
  ]
};

const Pricing: React.FC = () => {
  const [billing, setBilling] = useState<BillingCycle>('yearly');
  const [platform, setPlatform] = useState<Platform>('web');

  return (
    <Section id="pricing" className="bg-[#0B0F14] relative overflow-hidden py-32">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-sui-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading font-bold text-4xl md:text-5xl mb-6"
          >
            <span className="text-white">Simple, </span>
            <span className="bg-gradient-to-r from-[#4DA8FF] via-[#6FB6FF] to-[#00D4FF] bg-clip-text text-transparent">transparent</span>
            <span className="text-white"> pricing.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Choose the environment that fits your workflow.
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8 mb-20">
          {/* Platform Toggle */}
          <div className="p-1 bg-[#161b22] border border-white/10 rounded-xl inline-flex relative">
            <motion.div
              className="absolute inset-y-1 bg-[#0B0F14] rounded-lg border border-white/10 shadow-sm"
              layoutId="platform-highlight"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{
                width: 'calc(50% - 4px)',
                left: platform === 'web' ? '4px' : '50%'
              }}
            />
            <button
              onClick={() => setPlatform('web')}
              className={`relative z-10 px-8 py-2.5 text-sm font-medium transition-colors duration-300 ${platform === 'web' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Web Cloud
            </button>
            <button
              onClick={() => setPlatform('desktop')}
              className={`relative z-10 px-8 py-2.5 text-sm font-medium transition-colors duration-300 ${platform === 'desktop' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Desktop Pro
            </button>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}>
            <span className={`text-sm font-medium transition-colors ${billing === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <div className="w-12 h-6 bg-[#161b22] border border-white/10 rounded-full relative transition-colors hover:border-sui-cyan/30">
              <motion.div
                className="absolute top-1 left-1 w-4 h-4 bg-sui-cyan rounded-full shadow-[0_0_10px_rgba(60,185,255,0.5)]"
                animate={{ x: billing === 'yearly' ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
            <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${billing === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
              Yearly
              <span className="text-[10px] font-bold bg-sui-cyan/10 text-sui-cyan px-2 py-0.5 rounded-full border border-sui-cyan/20">
                SAVE 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {PRICING_DATA[platform].map((tier, idx) => (
              <motion.div
                key={`${platform}-${tier.name}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative flex flex-col p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 group ${tier.popular
                    ? 'bg-[#12171D]/80 border-sui-cyan/30 shadow-[0_0_40px_-10px_rgba(60,185,255,0.15)]'
                    : 'bg-[#0B0F14]/60 border-white/5 hover:border-white/10 hover:bg-[#12171D]/40'
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-sui-cyan text-[#0B0F14] text-xs font-bold rounded-full shadow-[0_0_20px_rgba(60,185,255,0.4)] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-black/20" />
                    Most Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${tier.popular ? 'bg-sui-cyan/20 text-sui-cyan' : 'bg-white/5 text-slate-400'
                    }`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <span className={tier.popular ? "bg-gradient-to-r from-white to-sui-cyan bg-clip-text text-transparent" : "text-white"}>
                      {tier.name}
                    </span>
                  </h3>
                  <p className="text-sm text-slate-500 min-h-[40px]">{tier.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    {typeof tier.price.monthly === 'number' ? (
                      <>
                        <span className="text-4xl font-heading font-bold text-white">
                          ${billing === 'monthly' ? tier.price.monthly : tier.price.yearly}
                        </span>
                        <span className="text-slate-500">/mo</span>
                      </>
                    ) : (
                      <span className="text-4xl font-heading font-bold text-white">Custom</span>
                    )}
                  </div>
                  {billing === 'yearly' && typeof tier.price.monthly === 'number' && (
                    <p className="text-xs text-sui-cyan mt-2 font-medium">
                      Billed ${Number(tier.price.yearly) * 12} yearly
                    </p>
                  )}
                </div>

                <div className="flex-1 mb-8">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className={`w-4 h-4 mt-0.5 ${tier.popular ? 'text-sui-cyan' : 'text-slate-500'}`} />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                    {tier.notIncluded?.map((feature, i) => (
                      <li key={`not-${i}`} className="flex items-start gap-3 text-sm text-slate-600">
                        <X className="w-4 h-4 mt-0.5" />
                        <span className="leading-tight decoration-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  variant={tier.popular ? 'primary' : 'outline'}
                  className="w-full justify-center"
                >
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enterprise Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#161b22] to-[#0B0F14] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sui-cyan/10 border border-sui-cyan/20 text-sui-cyan">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">
                <span className="text-white">Need </span>
                <span className="text-sui-cyan">specific compliance?</span>
              </h4>
              <p className="text-sm text-slate-400">We offer on-premise deployment, SLA guarantees, and dedicated support engineers.</p>
            </div>
          </div>
          <Button variant="outline" className="whitespace-nowrap hover:bg-white/5">
            Talk to Sales
          </Button>
        </motion.div>

      </div>
    </Section>
  );
};

export default Pricing;
