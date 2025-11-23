import React, { useState } from 'react';
import Sidebar from '../components/ide/Sidebar';
import LeftPanel from '../components/ide/LeftPanel';
import RightPanel from '../components/ide/RightPanel';
import EditorTabs from '../components/ide/EditorTabs';
import CodeEditor from '../components/ide/CodeEditor';
import Terminal from '../components/ide/Terminal';
import StatusBar from '../components/ide/StatusBar';
import Toolbar from '../components/ide/Toolbar';
import BuildStatus from '../components/ide/BuildStatus';
import { useIDEStore } from '../store/ideStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const IDEPage: React.FC = () => {
  const { leftPanelOpen, rightPanelOpen, bottomPanelOpen } = useIDEStore();
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [buildMessage, setBuildMessage] = useState('');
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col bg-[#1e2433] text-white">
      {/* Top Header Bar */}
      <div className="h-14 bg-[#2d3748] border-b border-slate-700/50 flex items-center justify-between px-4">
        <Toolbar />
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* File Explorer Panel */}
        {leftPanelOpen && (
          <div className="w-64 flex-shrink-0 bg-[#252b3b]">
            <LeftPanel />
          </div>
        )}
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1e2433]">
          <EditorTabs />
          
          <div className={`flex-1 ${bottomPanelOpen ? 'h-[60%]' : 'h-full'}`}>
            <CodeEditor />
          </div>
          
          {/* Bottom Panel (Terminal/Tests) */}
          {bottomPanelOpen && (
            <div className="h-[40%] border-t border-slate-700/50 bg-[#252b3b]">
              <Terminal />
            </div>
          )}
        </div>

        {/* Right Panel */}
        {rightPanelOpen && (
          <div className="w-80 flex-shrink-0 border-l border-slate-700/50 bg-[#252b3b]">
            <RightPanel />
          </div>
        )}
      </div>
      
      <StatusBar />

      {/* Build Status Toast */}
      <BuildStatus 
        status={buildStatus}
        message={buildMessage}
        onClose={() => setBuildStatus('idle')}
      />
    </div>
  );
};

export default IDEPage;
