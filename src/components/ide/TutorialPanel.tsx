import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Play,
  GraduationCap,
  Palette,
  Coins,
  ArrowRight,
  ChevronLeft,
  Terminal,
  Code2
} from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  steps: TutorialStep[];
}

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  code?: string;
  completed: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: 'hello-world',
    title: 'Hello World on Sui',
    description: 'Learn the basics of Sui Move by creating your first module',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    steps: [
      {
        id: 'step-1',
        title: 'Create a Module',
        content: 'Every Sui Move program starts with a module. Let\'s create one!',
        code: `module hello_world::hello {
    use std::string;
    
    public entry fun say_hello() {
        let message = string::utf8(b"Hello, Sui!");
        std::debug::print(&message);
    }
}`,
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Understanding the Code',
        content: 'The module keyword defines a new module. The public entry fun makes the function callable from transactions.',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Deploy Your Contract',
        content: 'Click the Deploy button in the right panel to deploy your contract to testnet.',
        completed: false,
      },
    ],
  },
  {
    id: 'nft-basics',
    title: 'Create Your First NFT',
    description: 'Learn how to mint and transfer NFTs on Sui',
    icon: Palette,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    steps: [
      {
        id: 'step-1',
        title: 'Define NFT Structure',
        content: 'NFTs in Sui are objects with the key ability.',
        code: `struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    url: String,
}`,
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Mint Function',
        content: 'Create a function to mint new NFTs.',
        code: `public entry fun mint(
    name: vector<u8>,
    description: vector<u8>,
    url: vector<u8>,
    ctx: &mut TxContext
) {
    let nft = NFT {
        id: object::new(ctx),
        name: string::utf8(name),
        description: string::utf8(description),
        url: string::utf8(url),
    };
    
    transfer::transfer(nft, tx_context::sender(ctx));
}`,
        completed: false,
      },
    ],
  },
  {
    id: 'defi-pool',
    title: 'Build a DeFi Pool',
    description: 'Create an AMM liquidity pool',
    icon: Coins,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    steps: [
      {
        id: 'step-1',
        title: 'Pool Structure',
        content: 'Define a pool that holds two token types.',
        code: `struct Pool<phantom A, phantom B> has key {
    id: UID,
    reserve_a: Balance<A>,
    reserve_b: Balance<B>,
    lp_supply: u64,
}`,
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Create Pool Function',
        content: 'Allow users to create new liquidity pools.',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Swap Function',
        content: 'Implement token swapping logic.',
        completed: false,
      },
    ],
  },
];

const TutorialPanel: React.FC = () => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const { addTab } = useIDEStore();

  const loadTutorialCode = (code: string) => {
    // Parse module name to create appropriate Move.toml
    const moduleMatch = code.match(/module\s+([a-zA-Z0-9_]+)::/);
    const packageName = moduleMatch ? moduleMatch[1] : 'Tutorial';
    const formattedPackageName = packageName.charAt(0).toUpperCase() + packageName.slice(1);

    const moveTomlContent = `[package]
name = "${formattedPackageName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"
`;

    // Add tab for the Move code
    addTab({
      id: `tab-${Date.now()}`,
      name: 'tutorial.move',
      path: '/tutorial.move',
      content: code,
      language: 'rust',
      isDirty: true,
    });

    // Add tab for Move.toml
    addTab({
      id: `tab-toml-${Date.now()}`,
      name: 'Move.toml',
      path: '/Move.toml',
      content: moveTomlContent,
      language: 'toml',
      isDirty: true,
    });
  };

  if (!selectedTutorial) {
    return (
      <div className="h-full bg-[#0D1117] flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-sui-cyan/10 flex items-center justify-center border border-sui-cyan/20">
              <BookOpen size={20} className="text-sui-cyan" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tech tracking-wide">Guided Tutorials</h3>
              <p className="text-xs text-slate-400 font-medium">Learn Sui Move step-by-step</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {tutorials.map((tutorial) => {
            const Icon = tutorial.icon;
            return (
              <button
                key={tutorial.id}
                onClick={() => setSelectedTutorial(tutorial)}
                className="w-full group p-4 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/5 hover:border-sui-cyan/30 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/[0.02] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${tutorial.bg} border border-white/5`}>
                    <Icon className={`w-5 h-5 ${tutorial.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate pr-2 font-tech">
                        {tutorial.title}
                      </h4>
                      <ChevronRight size={16} className="text-slate-600 group-hover:text-sui-cyan transition-colors transform group-hover:translate-x-1" />
                    </div>

                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                      {tutorial.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <Terminal size={10} />
                        {tutorial.steps.length} Steps
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                        <CheckCircle2 size={10} />
                        ~15 Min
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const step = selectedTutorial.steps[currentStep];

  return (
    <div className="h-full bg-[#0D1117] flex flex-col">
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <button
          onClick={() => {
            setSelectedTutorial(null);
            setCurrentStep(0);
          }}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-4 transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Tutorials
        </button>

        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTutorial.bg}`}>
            <selectedTutorial.icon className={`w-4 h-4 ${selectedTutorial.color}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-tech">
              {selectedTutorial.title}
            </h3>
            <p className="text-xs text-slate-400">
              Step {currentStep + 1} of {selectedTutorial.steps.length}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h4 className="text-lg font-bold text-white mb-3 font-tech flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sui-cyan/10 text-sui-cyan text-xs flex items-center justify-center border border-sui-cyan/20 font-mono">
              {currentStep + 1}
            </span>
            {step.title}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed pl-8 border-l border-white/10 ml-3">
            {step.content}
          </p>
        </div>

        {step.code && (
          <div className="mb-6 pl-8 ml-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Code2 size={14} />
                <span>Example Code</span>
              </div>
              <button
                onClick={() => loadTutorialCode(step.code!)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-sui-cyan/10 text-sui-cyan rounded-lg hover:bg-sui-cyan/20 transition-all hover:scale-105 active:scale-95 border border-sui-cyan/20 group"
              >
                <Play size={10} className="fill-current" />
                <span className="font-bold">Run Code</span>
              </button>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sui-cyan/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <pre className="relative p-4 bg-black/40 rounded-xl border border-white/10 overflow-x-auto shadow-inner">
                <code className="text-xs text-blue-300 font-mono leading-relaxed">{step.code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 disabled:cursor-not-allowed transition-all font-bold text-xs"
          >
            Previous
          </button>

          {currentStep < selectedTutorial.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sui-cyan hover:bg-sui-cyan-light text-black rounded-xl transition-all font-bold text-xs shadow-lg shadow-sui-cyan/20 hover:shadow-sui-cyan/30 active:scale-95"
            >
              Next Step
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => {
                // Just close for now or show completion visual
                setSelectedTutorial(null);
                setCurrentStep(0);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-neon text-black rounded-xl hover:shadow-neon transition-all font-bold text-xs active:scale-95"
            >
              Complete Tutorial
              <CheckCircle2 size={14} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 h-1">
          {selectedTutorial.steps.map((s, idx) => (
            <div
              key={s.id}
              className={`flex-1 h-full rounded-full transition-all duration-500 ${idx <= currentStep
                ? `bg-gradient-to-r ${selectedTutorial.bg.replace('/10', '')} to-white`
                : 'bg-white/10'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;
