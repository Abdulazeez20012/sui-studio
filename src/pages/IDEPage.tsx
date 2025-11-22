import React from 'react';
import Sidebar from '../components/ide/Sidebar';
import LeftPanel from '../components/ide/LeftPanel';
import RightPanel from '../components/ide/RightPanel';
import EditorTabs from '../components/ide/EditorTabs';
import CodeEditor from '../components/ide/CodeEditor';
import Terminal from '../components/ide/Terminal';
import StatusBar from '../components/ide/StatusBar';
import Toolbar from '../components/ide/Toolbar';
import { useIDEStore } from '../store/ideStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const IDEPage: React.FC = () => {
  const { leftPanelOpen, rightPanelOpen, bottomPanelOpen } = useIDEStore();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col bg-dark-bg text-white">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        {leftPanelOpen && (
          <div className="w-64 flex-shrink-0">
            <LeftPanel />
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          <EditorTabs />
          
          <div className={`flex-1 ${bottomPanelOpen ? 'h-[60%]' : 'h-full'}`}>
            <CodeEditor />
          </div>
          
          {bottomPanelOpen && (
            <div className="h-[40%] border-t border-dark-border">
              <Terminal />
            </div>
          )}
        </div>

        {rightPanelOpen && (
          <div className="w-80 flex-shrink-0 border-l border-dark-border">
            <RightPanel />
          </div>
        )}
      </div>
      
      <StatusBar />
    </div>
  );
};

export default IDEPage;
