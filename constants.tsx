import React from 'react';
import { Terminal, Cloud, Users, Zap, Shield, Layers, Code2, Briefcase, GraduationCap } from 'lucide-react';
import { Feature, PersonaData } from './types';

export const NAV_LINKS = [
  { name: 'Features', href: '#features' },
  { name: 'Platform', href: '#platform' },
  { name: 'Ecosystem', href: '#ecosystem' },
  { name: 'Roadmap', href: '#roadmap' },
];

export const PROBLEMS = [
  {
    title: "The Setup Hell",
    description: "Beginners lose hours configuring local environments before writing a single line of Move code.",
    icon: <Cloud className="w-6 h-6 text-red-400" />
  },
  {
    title: "Fragmented Tooling",
    description: "Professionals juggle separate tools for debugging, gas analysis, and deployment.",
    icon: <Layers className="w-6 h-6 text-orange-400" />
  },
  {
    title: "Environment Drift",
    description: "Teams struggle with inconsistent dependencies causing 'it works on my machine' issues.",
    icon: <Shield className="w-6 h-6 text-yellow-400" />
  }
];

export const WEB_FEATURES: Feature[] = [
  {
    id: 'w1',
    title: 'Instant Access',
    description: 'Zero setup. Start coding in your browser in under 5 seconds.',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'w2',
    title: 'Cloud Sync',
    description: 'Your projects follow you. Start on tablet, finish on desktop.',
    icon: <Cloud className="w-5 h-5" />
  },
  {
    id: 'w3',
    title: 'Guided Tutorials',
    description: 'Integrated learning paths for first-time explorers.',
    icon: <GraduationCap className="w-5 h-5" />
  }
];

export const DESKTOP_FEATURES: Feature[] = [
  {
    id: 'd1',
    title: 'Local Power',
    description: 'Full access to local file systems, hardware acceleration, and offline mode.',
    icon: <Terminal className="w-5 h-5" />
  },
  {
    id: 'd2',
    title: 'Advanced Debugger',
    description: 'Step-through execution with real-time gas profiling.',
    icon: <Code2 className="w-5 h-5" />
  },
  {
    id: 'd3',
    title: 'Team Security',
    description: 'Enterprise-grade secret management and granular permissions.',
    icon: <Briefcase className="w-5 h-5" />
  }
];

export const PERSONAS: PersonaData[] = [
  {
    title: "The Explorer",
    description: "Web2 developers or students curious about Move.",
    painPoint: "Intimidated by CLI setup.",
    solution: "One-click Web Studio with templates."
  },
  {
    title: "The Builder",
    description: "Professional blockchain engineers shipping dApps.",
    painPoint: "Slow feedback loops & lack of visibility.",
    solution: "Hot-reloading & visual transaction inspector."
  },
  {
    title: "The Enterprise",
    description: "Large teams building infrastructure.",
    painPoint: "Security compliance & collaboration silos.",
    solution: "SSO, audit logs, and team workspaces."
  }
];