import React, { useState, useEffect } from 'react';
import { GitBranch, AlertCircle, CheckCircle, Hammer, TestTube, Rocket, Folder } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const StatusBar: React.FC = () => {
  const { activeTab, tabs, syntaxErrors, syntaxWarnings, setRightPanelType, toggleRightPanel, rightPanelOpen } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Check if running in Electron and get current folder
  useEffect(() => {
    const isElectron = typeof window !== 'undefined' && (window as any).electron?.isElectron;
    if (isElectron) {
      // Listen for folder changes
      const handleFolderChange = (event: any) => {
        setCurrentFolder(event.detail);
      };
      document.addEventListener('ide:folderChanged', handleFolderChange);
      return () => document.removeEventListener('ide:folderChanged', handleFolderChange);
    }
  }, []);

  return (
    <div className="h-6 sm:h-7 bg-dark-header border-t border-sui-cyan/20 flex items-center justify-between px-2 sm:px-4 text-[10px] sm:text-xs relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sui-cyan/30 to-transparent"></div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Current Folder (Desktop only) */}
        {currentFolder && (
          <>
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 hover:text-walrus-cyan transition-colors duration-200 cursor-pointer" title={currentFolder}>
              <Folder size={13} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-semibold max-w-[200px] truncate">{currentFolder.split('/').pop() || currentFolder.split('\\').pop()}</span>
            </div>
            <div className="hidden md:block h-3 w-px bg-sui-cyan/20"></div>
          </>
        )}
        <div className="flex items-center gap-1.5 text-slate-400 hover:text-sui-cyan transition-colors duration-200 cursor-pointer">
          <GitBranch size={13} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="font-semibold">main</span>
        </div>
        {/* Syntax Status */}
        {syntaxErrors > 0 || syntaxWarnings > 0 ? (
          <button
            onClick={() => {
              setRightPanelType('debugger');
              if (!rightPanelOpen) toggleRightPanel();
            }}
            className="flex items-center gap-1.5 hover:bg-white/5 px-2 py-0.5 rounded transition-all duration-200 cursor-pointer"
          >
            <AlertCircle size={13} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${syntaxErrors > 0 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`} />
            <span className={`font-semibold ${syntaxErrors > 0 ? 'text-red-400' : 'text-yellow-400'}`}>
              {syntaxErrors > 0 ? `${syntaxErrors} Error${syntaxErrors !== 1 ? 's' : ''}` : `${syntaxWarnings} Warning${syntaxWarnings !== 1 ? 's' : ''}`}
            </span>
          </button>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 text-neon-green">
            <CheckCircle size={13} className="w-3 h3 sm:w-3.5 sm:h-3.5" />
            <span className="font-semibold">No Issues</span>
          </div>
        )}
        <div className="hidden sm:block h-3 w-px bg-sui-cyan/20"></div>
        <div className="hidden lg:flex items-center gap-3 text-slate-500">
          <div className="flex items-center gap-1 hover:text-sui-cyan transition-colors duration-200 cursor-pointer" title="Last build status">
            <Hammer size={12} />
            <span className="font-medium">Build: Ready</span>
          </div>
          <div className="flex items-center gap-1 hover:text-neon-green transition-colors duration-200 cursor-pointer" title="Last test status">
            <TestTube size={12} />
            <span className="font-medium">Tests: Passed</span>
          </div>
          <div className="flex items-center gap-1 hover:text-neon-purple transition-colors duration-200 cursor-pointer" title="Deployment status">
            <Rocket size={12} />
            <span className="font-medium">Deploy: Testnet</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 text-slate-400">
        {currentTab && (
          <>
            <span className="hidden sm:inline font-semibold">Ln 1, Col 1</span>
            <span className="uppercase font-bold text-neon-purple">{currentTab.language}</span>
            <span className="hidden md:inline font-medium">UTF-8</span>
          </>
        )}
        <span className="font-black text-white tracking-widest uppercase text-[9px] sm:text-[10px]" style={{ fontFamily: "'Rajdhani', sans-serif" }}>SUI STUDIO</span>
      </div>
    </div>
  );
};

export default StatusBar;
