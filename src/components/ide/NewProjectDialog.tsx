import React, { useState } from 'react';
import { X, Folder, Loader, CheckCircle, AlertCircle } from 'lucide-react';
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
      icon: '📄',
    },
    {
      id: 'hello_world',
      name: 'Hello World',
      description: 'Simple object creation and transfer',
      icon: '👋',
    },
    {
      id: 'defi',
      name: 'DeFi AMM Pool',
      description: 'Automated Market Maker with liquidity pools',
      icon: '💰',
    },
    {
      id: 'nft',
      name: 'NFT Collection',
      description: 'Create and manage NFT collections',
      icon: '🎨',
    },
    {
      id: 'gaming',
      name: 'Game Inventory',
      description: 'Player inventory and item management',
      icon: '🎮',
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
      const result = await apiService.createProject(projectName, template);

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
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-surface border border-sui-cyan/30 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sui-cyan/10 rounded-lg flex items-center justify-center border border-sui-cyan/30">
              <Folder className="w-6 h-6 text-sui-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider font-tech">
              Create New Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-12">
            <CheckCircle size={64} className="text-neon-green mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-bold text-neon-green mb-2 font-tech">
              Project Created Successfully!
            </h3>
            <p className="text-slate-400 font-tech">
              Your project structure has been generated
            </p>
          </div>
        ) : (
          <>
            {/* Project Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider font-tech">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  setError('');
                }}
                placeholder="my_awesome_project"
                className="w-full px-4 py-3 bg-dark-bg border border-sui-cyan/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan focus:shadow-neon transition-all font-mono"
                autoFocus
                disabled={isCreating}
              />
              <p className="text-xs text-slate-500 mt-2 font-tech">
                Must start with a letter and contain only letters, numbers, and underscores
              </p>
            </div>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider font-tech">
                Choose Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                    disabled={isCreating}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      template === tmpl.id
                        ? 'bg-sui-cyan/10 border-sui-cyan shadow-neon'
                        : 'bg-dark-bg border-sui-cyan/20 hover:border-sui-cyan/50'
                    } disabled:opacity-50`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{tmpl.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1 font-tech">
                          {tmpl.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-tech">
                          {tmpl.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* What Gets Created */}
            <div className="mb-6 p-4 bg-dark-bg border border-sui-cyan/20 rounded-lg">
              <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider font-tech">
                📦 What Gets Created
              </h3>
              <div className="space-y-2 text-sm text-slate-300 font-mono">
                <div className="flex items-start gap-2">
                  <span className="text-sui-cyan">📁</span>
                  <div>
                    <span className="text-sui-cyan">{projectName || 'project_name'}/</span>
                    <span className="text-slate-500 ml-2">Project directory</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 ml-4">
                  <span className="text-neon-green">📄</span>
                  <div>
                    <span className="text-white">Move.toml</span>
                    <span className="text-slate-500 ml-2">Package manifest</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 ml-4">
                  <span className="text-neon-purple">📁</span>
                  <div>
                    <span className="text-white">sources/</span>
                    <span className="text-slate-500 ml-2">Move modules</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 ml-4">
                  <span className="text-neon-pink">📁</span>
                  <div>
                    <span className="text-white">tests/</span>
                    <span className="text-slate-500 ml-2">Test files</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 ml-4">
                  <span className="text-blue-400">📄</span>
                  <div>
                    <span className="text-white">README.md</span>
                    <span className="text-slate-500 ml-2">Documentation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-neon-pink flex-shrink-0 mt-0.5" />
                <p className="text-sm text-neon-pink font-tech">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={isCreating || !projectName.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-sm tracking-wider font-tech"
              >
                {isCreating ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Folder size={20} />
                    <span>Create Project</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isCreating}
                className="px-6 py-3 bg-dark-bg border border-sui-cyan/30 rounded-lg text-white hover:bg-white/5 hover:border-sui-cyan transition-all font-bold uppercase text-sm tracking-wider font-tech disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewProjectDialog;
