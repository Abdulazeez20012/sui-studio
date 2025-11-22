import React, { useState } from 'react';
import { BookOpen, CheckCircle, Circle, ChevronRight, Play } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { templates } from '../../data/templates';

interface Tutorial {
  id: string;
  title: string;
  description: string;
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
  const { setFiles, addTab } = useIDEStore();

  const loadTutorialCode = (code: string) => {
    // Create a temporary file with the tutorial code
    const tempFile = {
      id: `tutorial-${Date.now()}`,
      name: 'tutorial.move',
      type: 'file' as const,
      path: '/tutorial.move',
      language: 'rust',
      content: code,
    };

    addTab({
      id: `tab-${Date.now()}`,
      name: 'tutorial.move',
      path: '/tutorial.move',
      content: code,
      language: 'rust',
      isDirty: false,
    });
  };

  if (!selectedTutorial) {
    return (
      <div className="h-full bg-dark-surface flex flex-col">
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-sui-cyan" />
            <h3 className="text-sm font-semibold text-white">Guided Tutorials</h3>
          </div>
          <p className="text-xs text-slate-400">
            Learn Sui Move step-by-step
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {tutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className="p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-sui-cyan/50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-white group-hover:text-sui-cyan transition-colors">
                  {tutorial.title}
                </h4>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-sui-cyan transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mb-3">{tutorial.description}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{tutorial.steps.length} steps</span>
                <span>•</span>
                <span>~15 min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const step = selectedTutorial.steps[currentStep];

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <button
          onClick={() => {
            setSelectedTutorial(null);
            setCurrentStep(0);
          }}
          className="text-sm text-slate-400 hover:text-white mb-3 transition-colors"
        >
          ← Back to tutorials
        </button>
        <h3 className="text-sm font-semibold text-white mb-1">
          {selectedTutorial.title}
        </h3>
        <p className="text-xs text-slate-400">
          Step {currentStep + 1} of {selectedTutorial.steps.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        <div className="mb-4">
          <h4 className="text-base font-medium text-white mb-2">{step.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{step.content}</p>
        </div>

        {step.code && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Example Code</span>
              <button
                onClick={() => loadTutorialCode(step.code!)}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-sui-cyan/10 text-sui-cyan rounded hover:bg-sui-cyan/20 transition-colors"
              >
                <Play size={12} />
                <span>Try it</span>
              </button>
            </div>
            <pre className="p-3 bg-dark-bg rounded border border-dark-border overflow-x-auto">
              <code className="text-xs text-slate-300 font-mono">{step.code}</code>
            </pre>
          </div>
        )}

        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white hover:bg-white/5 transition-colors"
            >
              Previous
            </button>
          )}
          {currentStep < selectedTutorial.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex-1 px-4 py-2 bg-sui-cyan text-black rounded hover:bg-[#2ba6eb] transition-colors font-medium"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => {
                alert('Tutorial completed! 🎉');
                setSelectedTutorial(null);
                setCurrentStep(0);
              }}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors font-medium"
            >
              Complete Tutorial
            </button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-2">
          {selectedTutorial.steps.map((s, idx) => (
            <div
              key={s.id}
              className={`flex-1 h-1 rounded-full ${
                idx <= currentStep ? 'bg-sui-cyan' : 'bg-dark-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;
