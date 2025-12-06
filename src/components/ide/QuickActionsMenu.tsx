import React, { useState } from 'react';
import { Zap, Package, FileCode, Rocket, X } from 'lucide-react';
import { projectInitService } from '../../services/projectInitService';
import { useIDEStore } from '../../store/ideStore';

export const QuickActionsMenu: React.FC = () => {
  const { setFiles } = useIDEStore();
  const [showDialog, setShowDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleQuickCreate = async () => {
    if (!projectName.trim()) return;

    setCreating(true);
    try {
      // Create complete Move project structure
      const files = projectInitService.createMoveProject({
        name: projectName,
      });

      // Set files in IDE
      setFiles(files);

      // Success!
      setShowDialog(false);
      setProjectName('');
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sui-cyan to-neon-purple text-black rounded-lg font-tech font-bold hover:shadow-neon transition-all"
        title="Quick Create Move Project"
      >
        <Zap size={18} />
        <span>Quick Create</span>
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface border border-sui-cyan/30 rounded-xl max-w-2xl w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-sui-cyan/20 flex items-center justify-center">
                  <Rocket className="text-sui-cyan" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white font-tech">
                    Quick Create Move Project
                  </h2>
                  <p className="text-sm text-slate-400 font-tech">
                    One-click setup with all necessary files
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-sui-cyan/10 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            {/* What's Included */}
            <div className="bg-dark-panel border border-sui-cyan/20 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-sui-cyan mb-3 font-tech">
                ✨ What's Included:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <Package size={16} className="text-sui-cyan" />
                  <span>Move.toml (configured)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <FileCode size={16} className="text-neon-purple" />
                  <span>Main module</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <FileCode size={16} className="text-neon-green" />
                  <span>Test file</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <FileCode size={16} className="text-neon-pink" />
                  <span>README.md</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <FileCode size={16} className="text-sui-cyan" />
                  <span>sources/ folder</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300 font-tech">
                  <FileCode size={16} className="text-neon-purple" />
                  <span>tests/ folder</span>
                </div>
              </div>
            </div>

            {/* Project Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-2 font-tech">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="my_awesome_project"
                className="w-full px-4 py-3 bg-dark-panel border border-sui-cyan/30 rounded-lg text-white font-tech focus:outline-none focus:border-sui-cyan"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleQuickCreate();
                }}
              />
              <p className="text-xs text-slate-500 mt-2 font-tech">
                Use lowercase letters, numbers, and underscores only
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleQuickCreate}
                disabled={!projectName.trim() || creating}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-sui-cyan text-black rounded-lg font-tech font-bold hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket size={20} />
                    Create Project
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDialog(false)}
                disabled={creating}
                className="px-6 py-3 border border-slate-600 text-slate-400 rounded-lg font-tech font-bold hover:border-slate-400 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-sui-cyan/10 border border-sui-cyan/30 rounded-lg">
              <p className="text-xs text-slate-300 font-tech">
                💡 <strong>Tip:</strong> After creation, you can right-click on folders to add more Move modules!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
