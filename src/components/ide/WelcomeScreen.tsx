import React, { useState, useRef } from 'react';
import { FileText, Folder, Download, Zap, X } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { templates, TemplateKey } from '../../data/templates';
import { FileNode } from '../../types/ide';

const WelcomeScreen: React.FC = () => {
  const { setFiles } = useIDEStore();
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [isCloning, setIsCloning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadTemplate = (key: TemplateKey) => {
    const template = templates[key];
    setFiles(template.files);
  };

  const handleOpenFolder = () => {
    // Trigger file input for folder selection
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFolderSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to FileNode structure
    const fileNodes: FileNode[] = [];
    const fileMap = new Map<string, FileNode>();

    // Process all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.webkitRelativePath || file.name;
      const parts = path.split('/');
      
      // Read file content
      const content = await file.text();
      
      // Determine language based on extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      const languageMap: Record<string, string> = {
        'move': 'rust',
        'toml': 'toml',
        'md': 'markdown',
        'json': 'json',
        'js': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'jsx': 'javascript',
      };

      const fileNode: FileNode = {
        id: `file-${i}`,
        name: file.name,
        type: 'file',
        path: `/${path}`,
        content,
        language: languageMap[extension || ''] || 'plaintext',
      };

      fileMap.set(path, fileNode);
    }

    // Build tree structure
    const rootFiles: FileNode[] = [];
    fileMap.forEach((node, path) => {
      const parts = path.split('/');
      if (parts.length === 1) {
        rootFiles.push(node);
      } else {
        // Create folder structure
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += (i > 0 ? '/' : '') + parts[i];
          if (!fileMap.has(currentPath)) {
            const folderNode: FileNode = {
              id: `folder-${currentPath}`,
              name: parts[i],
              type: 'folder',
              path: `/${currentPath}`,
              children: [],
            };
            fileMap.set(currentPath, folderNode);
          }
        }
      }
    });

    // Organize into tree
    fileMap.forEach((node, path) => {
      const parts = path.split('/');
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join('/');
        const parent = fileMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      } else {
        if (!rootFiles.includes(node)) {
          rootFiles.push(node);
        }
      }
    });

    setFiles(rootFiles);
  };

  const handleCloneRepo = async () => {
    if (!repoUrl.trim()) return;

    setIsCloning(true);
    try {
      // Simulate cloning (in production, this would call a backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, load a template
      loadTemplate('helloWorld');
      setShowCloneDialog(false);
      setRepoUrl('');
      alert('Repository cloned successfully! (Demo mode)');
    } catch (error) {
      alert('Failed to clone repository');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-dark-bg cyber-grid">
      <div className="max-w-4xl w-full px-8">
        <div className="text-center mb-12">
          {/* Sui Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-sui-cyan/10 rounded-2xl mb-6 border-2 border-sui-cyan/30 shadow-neon-lg relative group">
            <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity"></div>
            <img 
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
              alt="Sui Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 
            className="text-5xl font-black text-white mb-3 tracking-tight glitch-text scanline" 
            style={{ fontFamily: "'Orbitron', 'Rajdhani', sans-serif" }}
            data-text="WELCOME TO SUI STUDIO"
          >
            WELCOME TO SUI STUDIO
          </h1>
          <p className="text-lg text-slate-400 font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Start building on Sui with our templates or create a new project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key as TemplateKey)}
              className="p-6 bg-dark-surface border border-sui-cyan/20 rounded-xl hover:border-sui-cyan hover:shadow-neon transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="w-12 h-12 bg-sui-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sui-cyan/20 group-hover:shadow-neon transition-all border border-sui-cyan/30">
                <FileText className="w-6 h-6 text-sui-cyan" />
              </div>
              <h3 className="text-white font-bold mb-2 text-lg" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{template.name}</h3>
              <p className="text-sm text-slate-400 font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{template.description}</p>
            </button>
          ))}
        </div>

        {/* Core Analyzer Extension Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-neon-purple/10 via-sui-cyan/10 to-neon-pink/10 border border-sui-cyan/30 rounded-xl relative overflow-hidden group hover:border-sui-cyan hover:shadow-neon-lg transition-all">
          <div className="absolute inset-0 bg-gradient-cyber opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neon-purple/20 rounded-xl flex items-center justify-center border-2 border-neon-purple/50 shadow-purple-glow">
                <svg className="w-10 h-10 text-neon-purple" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-cyber tracking-wide glitch-text" data-text="CORE ANALYZER EXTENSION">
                  CORE ANALYZER EXTENSION
                </h3>
                <p className="text-sm text-slate-400 font-medium font-tech">
                  Enhance your VS Code with advanced Sui Move analysis and debugging tools
                </p>
              </div>
            </div>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=your-team-name.core-analyzer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-neon-purple hover:bg-neon-purple/90 text-white rounded-lg transition-all font-bold uppercase text-sm tracking-wider font-tech shadow-purple-glow hover:shadow-[0_0_30px_rgba(176,38,255,0.5)]"
            >
              <Download size={20} />
              <span>Download</span>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button 
            onClick={handleOpenFolder}
            className="flex items-center gap-2 px-6 py-3 bg-dark-panel border border-sui-cyan/30 rounded-lg hover:border-sui-cyan hover:shadow-neon transition-all text-slate-300 hover:text-sui-cyan font-bold uppercase text-sm tracking-wider"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <Folder size={20} />
            <span>Open Folder</span>
          </button>
          <button 
            onClick={() => setShowCloneDialog(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg transition-all font-bold uppercase text-sm tracking-wider"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <Download size={20} />
            <span>Clone Repository</span>
          </button>
        </div>

        {/* Hidden file input for folder selection */}
        <input
          ref={fileInputRef}
          type="file"
          /* @ts-ignore */
          webkitdirectory=""
          directory=""
          multiple
          onChange={handleFolderSelect}
          className="hidden"
        />

        {/* Clone Repository Dialog */}
        {showCloneDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Clone Repository</h3>
                <button
                  onClick={() => setShowCloneDialog(false)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-slate-400 mb-2">
                  Repository URL
                </label>
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo.git"
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan"
                  autoFocus
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCloneRepo}
                  disabled={!repoUrl.trim() || isCloning}
                  className="flex-1 px-4 py-2 bg-sui-cyan text-black rounded hover:bg-[#2ba6eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isCloning ? 'Cloning...' : 'Clone'}
                </button>
                <button
                  onClick={() => setShowCloneDialog(false)}
                  className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
