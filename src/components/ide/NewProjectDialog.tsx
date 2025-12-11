import React, { useState } from 'react';
import {
  X,
  Folder,
  Loader,
  CheckCircle,
  AlertCircle,
  FileCode2,
  Sparkles,
  Coins,
  Palette,
  Gamepad2,
  Code2,
  Terminal,
  Box,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useIDEStore } from '../../store/ideStore';

interface NewProjectDialogProps {
  onClose: () => void;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ onClose }) => {
  const { setFiles } = useIDEStore();
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState<string>('hello_world');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const templates = [
    {
      id: 'empty',
      name: 'Empty Project',
      description: 'Start with a blank Move module',
      icon: FileCode2,
      color: 'text-slate-400',
      bg: 'bg-slate-400/10',
      border: 'border-slate-400/20'
    },
    {
      id: 'hello_world',
      name: 'Hello World',
      description: 'Simple object creation and transfer',
      icon: Sparkles,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20'
    },
    {
      id: 'defi',
      name: 'DeFi AMM Pool',
      description: 'Automated Market Maker with liquidity pools',
      icon: Coins,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/20'
    },
    {
      id: 'nft',
      name: 'NFT Collection',
      description: 'Create and manage NFT collections',
      icon: Palette,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20'
    },
    {
      id: 'gaming',
      name: 'Game Inventory',
      description: 'Player inventory and item management',
      icon: Gamepad2,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
      border: 'border-pink-400/20'
    },
  ];

  const handleCreate = async () => {
    if (!projectName.trim()) {
      setError('Please enter a project name');
      return;
    }

    // Validate project name
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(projectName)) {
      setError('Project name must start with a letter and contain only letters, numbers, and underscores');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      // Use Electron terminal to create project if available
      if (window.electron?.isElectron) {
        // Ask user where to create the project
        const result = await window.electron.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Select folder to create project in',
        });

        if (result.canceled || !result.filePaths[0]) {
          setIsCreating(false);
          return;
        }

        const parentFolder = result.filePaths[0];
        
        // Create project using Sui CLI
        const createResult = await window.electron.executeCommand(
          `sui move new ${projectName}`,
          parentFolder
        );

        if (createResult.success) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            // Dispatch event to open the newly created project
            document.dispatchEvent(new CustomEvent('ide:openFolder'));
          }, 1500);
        } else {
          // Check if it's a "command not found" error
          if (createResult.error?.includes('sui: command not found') || 
              createResult.error?.includes('not found')) {
            setError('Sui CLI is not installed. Please install it first:\n\n' +
                    '1. Install Rust: curl --proto \'=https\' --tlsv1.2 -sSf https://sh.rustup.rs | sh\n' +
                    '2. Install Sui: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui\n' +
                    '3. Restart the IDE\n\n' +
                    'See SUI_CLI_INSTALLATION_GUIDE.md for detailed instructions.');
          } else {
            setError(createResult.error || 'Failed to create project. Make sure Sui CLI is installed.');
          }
        }
      } else {
        // Fallback to backend API for web version
        const result = await apiService.initializeProject(projectName, template);

        if (result.success) {
          // Convert structure to FileNode format
          const convertToFileNodes = (node: any): any => {
            if (node.type === 'folder') {
              return {
                id: `folder-${node.path}`,
                name: node.name,
                type: 'folder',
                path: node.path,
                children: node.children?.map(convertToFileNodes) || [],
              };
            } else {
              return {
                id: `file-${node.path}`,
                name: node.name,
                type: 'file',
                path: node.path,
                content: node.content || '',
                language: node.language || 'plaintext',
              };
            }
          };

          const fileNodes = result.structure.children.map(convertToFileNodes);
          setFiles(fileNodes);

          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setError(result.message || 'Failed to create project');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project. Make sure Sui CLI is installed.');
    } finally {
      setIsCreating(false);
    }
  };

  const selectedTemplate = templates.find(t => t.id === template);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-[#0D1117] border border-sui-cyan/20 rounded-2xl p-0 w-full max-w-4xl max-h-[90vh] overflow-hidden flex shadow-2xl shadow-sui-cyan/10">

        {/* Left Side - Template Details & Form */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-sui-cyan/20 to-blue-600/20 rounded-xl flex items-center justify-center border border-sui-cyan/30 shadow-neon">
              <Folder className="w-6 h-6 text-sui-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight font-tech">
                Create New Project
              </h2>
              <p className="text-slate-400 text-sm">Initialize a new Sui Move project</p>
            </div>
          </div>

          {success ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-green/20 blur-xl rounded-full animate-pulse" />
                <CheckCircle size={80} className="text-neon-green relative z-10 animate-bounce-short" />
              </div>
              <h3 className="text-2xl font-bold text-white mt-6 font-tech">
                Project Created!
              </h3>
              <p className="text-slate-400 mt-2">
                Setting up your development environment...
              </p>
            </div>
          ) : (
            <>
              {/* Project Name Input */}
              <div className="mb-8 group">
                <label className="block text-xs font-bold text-sui-cyan/80 mb-2 uppercase tracking-wider font-mono">
                  Project Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setError('');
                    }}
                    placeholder="my_awesome_project"
                    className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-sui-cyan/50 focus:ring-1 focus:ring-sui-cyan/50 transition-all font-mono text-lg"
                    autoFocus
                    disabled={isCreating}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none group-focus-within:text-sui-cyan/50 transition-colors">
                    <Terminal size={20} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 font-mono ml-1">
                  Only lowercase letters, numbers, and underscores
                </p>
              </div>

              {/* Template Selection */}
              <div className="mb-8">
                <label className="block text-xs font-bold text-sui-cyan/80 mb-3 uppercase tracking-wider font-mono">
                  Select Template
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {templates.map((tmpl) => {
                    const Icon = tmpl.icon;
                    const isSelected = template === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => setTemplate(tmpl.id)}
                        disabled={isCreating}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 text-left ${isSelected
                          ? 'bg-white/5 border-sui-cyan shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                          : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/5'
                          } disabled:opacity-50`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${isSelected ? tmpl.bg : 'bg-white/5 group-hover:bg-white/10'
                            }`}>
                            <Icon className={`w-6 h-6 transition-colors ${isSelected ? tmpl.color : 'text-slate-400 group-hover:text-white'
                              }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className={`font-bold font-tech transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                                }`}>
                                {tmpl.name}
                              </h3>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-sui-cyan shadow-[0_0_10px_#38bdf8]" />
                              )}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">
                              {tmpl.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-500 font-medium whitespace-pre-line">{error}</div>
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button
                  onClick={onClose}
                  disabled={isCreating}
                  className="px-6 py-3.5 bg-transparent border border-white/10 rounded-xl text-slate-400 hover:text-white hover:border-white/30 transition-all font-bold text-sm tracking-wide disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating || !projectName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-sui-cyan hover:bg-sui-cyan-light text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-sm tracking-wide shadow-lg shadow-sui-cyan/20 hover:shadow-sui-cyan/40"
                >
                  {isCreating ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Project</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="w-[320px] bg-black/40 border-l border-white/5 p-6 hidden md:flex flex-col">
          <div className="sticky top-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 font-mono">
                Project Structure
              </h3>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3 font-mono text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <Folder size={14} className="text-sui-cyan" />
                  <span className="text-sui-cyan font-bold">{projectName || 'project_name'}</span>
                </div>

                <div className="pl-4 space-y-3 relative before:absolute before:left-[5px] before:top-0 before:bottom-2 before:w-[1px] before:bg-white/10">
                  <div className="flex items-center gap-2 text-slate-400 relative">
                    <div className="absolute -left-[11px] top-1/2 w-2 h-[1px] bg-white/10" />
                    <FileCode2 size={14} className="text-orange-400" />
                    <span>Move.toml</span>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[11px] top-[10px] w-2 h-[1px] bg-white/10" />
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Folder size={14} className="text-blue-400" />
                      <span>sources</span>
                    </div>
                    {(selectedTemplate?.id === 'hello_world' || selectedTemplate?.id === 'empty') && (
                      <div className="pl-6 flex items-center gap-2 text-slate-500 text-xs">
                        <Code2 size={12} />
                        <span>module.move</span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <div className="absolute -left-[11px] top-[10px] w-2 h-[1px] bg-white/10" />
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <Folder size={14} className="text-green-400" />
                      <span>tests</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 relative">
                    <div className="absolute -left-[11px] top-1/2 w-2 h-[1px] bg-white/10" />
                    <FileCode2 size={14} className="text-purple-400" />
                    <span>README.md</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-sui-cyan/5 to-transparent border border-sui-cyan/10">
              <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" />
                Quick Tip
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {selectedTemplate?.id === 'defi'
                  ? 'The DeFi template includes a basic AMM implementation with swap functions and liquidity pools.'
                  : selectedTemplate?.id === 'nft'
                    ? 'Start with a complete NFT collection standard including minting caps and metadata.'
                    : 'All projects come pre-configured with the latest Sui Move framework dependencies.'}
              </p>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default NewProjectDialog;
