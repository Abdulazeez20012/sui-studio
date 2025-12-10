import React, { useState, useEffect } from 'react';
import Header from '../components/ide/Header';
import Sidebar from '../components/ide/Sidebar';
import LeftPanel from '../components/ide/LeftPanel';
import RightPanel from '../components/ide/RightPanel';
import EditorTabs from '../components/ide/EditorTabs';
import CodeEditor from '../components/ide/CodeEditor';
import Terminal from '../components/ide/Terminal';
import StatusBar from '../components/ide/StatusBar';
import BuildStatus from '../components/ide/BuildStatus';
import ResizeHandle from '../components/ide/ResizeHandle';
import NexiHome from '../components/ide/NexiHome';
import NewProjectDialog from '../components/ide/NewProjectDialog';
import KeyboardShortcuts from '../components/ide/KeyboardShortcuts';
import { BackendWakeUp } from '../components/BackendWakeUp';
import { useIDEStore } from '../store/ideStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useResizable } from '../hooks/useResizable';
import { useFileWatcher } from '../hooks/useFileWatcher';
import { useElectronFileSystem } from '../hooks/useElectronFileSystem';
import ToastContainer from '../components/ide/ToastContainer';

const IDEPage: React.FC = () => {
  const { leftPanelOpen, rightPanelOpen, bottomPanelOpen, toggleLeftPanel, toggleBottomPanel, toggleRightPanel, setRightPanelType, addTab, tabs, updateTabContent, removeTab } = useIDEStore();
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [buildMessage, setBuildMessage] = useState('');
  
  // Check if running in Electron (desktop app)
  const isElectron = typeof window !== 'undefined' && (window as any).electron?.isElectron;
  
  // Skip backend check for desktop app
  const [backendReady, setBackendReady] = useState(isElectron ? true : false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  const { readFile } = useElectronFileSystem();

  // File watcher integration
  useFileWatcher({
    onFileChanged: async (filePath) => {
      // Find if this file is open in a tab
      const openTab = tabs.find(tab => tab.path === filePath);
      if (openTab && !openTab.isDirty) {
        // Only reload if file is not dirty (no unsaved changes)
        try {
          const content = await readFile(filePath);
          updateTabContent(openTab.id, content);
          console.log('File reloaded:', filePath);
        } catch (error) {
          console.error('Failed to reload file:', error);
        }
      }
    },
    onFileDeleted: (filePath) => {
      // Close tab if file was deleted
      const openTab = tabs.find(tab => tab.path === filePath);
      if (openTab) {
        removeTab(openTab.id);
        console.log('File deleted, tab closed:', filePath);
      }
    },
  });

  useEffect(() => {
    const handleNewProject = () => setShowNewProjectDialog(true);
    const handleShowShortcuts = () => setShowKeyboardShortcuts(true);
    
    document.addEventListener('ide:newProject', handleNewProject);
    document.addEventListener('ide:showKeyboardShortcuts', handleShowShortcuts);
    
    // Listen for ? key to show keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only if not typing in an input
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setShowKeyboardShortcuts(true);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.removeEventListener('ide:newProject', handleNewProject);
      document.removeEventListener('ide:showKeyboardShortcuts', handleShowShortcuts);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Resizable panels
  const leftPanel = useResizable({
    initialSize: 256,
    minSize: 200,
    maxSize: 500,
    direction: 'horizontal',
    storageKey: 'ide-left-panel-width',
  });

  const rightPanel = useResizable({
    initialSize: 320,
    minSize: 250,
    maxSize: 600,
    direction: 'horizontal',
    storageKey: 'ide-right-panel-width',
  });

  const bottomPanel = useResizable({
    initialSize: 300,
    minSize: 150,
    maxSize: 600,
    direction: 'vertical',
    storageKey: 'ide-bottom-panel-height',
  });

  // Handle menu bar events (Moved to Header mostly, but keeping listeners if needed for shortcuts)
  useEffect(() => {
    const handleNewFile = () => {
      const newTab = {
        id: `tab-${Date.now()}`,
        name: 'untitled.move',
        path: '/untitled.move',
        content: '// New Move file\n',
        language: 'move',
        isDirty: false
      };
      addTab(newTab);
    };

    const handleSave = () => {
      console.log('Save triggered');
    };

    const handleToggleSidebar = () => toggleLeftPanel();
    const handleTogglePanel = () => toggleBottomPanel();

    const handleOpenExtensions = () => {
      setRightPanelType('extensions');
      if (!rightPanelOpen) {
        toggleRightPanel();
      }
    };

    document.addEventListener('ide:newFile', handleNewFile);
    document.addEventListener('ide:save', handleSave);
    document.addEventListener('ide:openExtensions', handleOpenExtensions);
    document.addEventListener('ide:toggleSidebar', handleToggleSidebar);
    document.addEventListener('ide:togglePanel', handleTogglePanel);

    return () => {
      document.removeEventListener('ide:newFile', handleNewFile);
      document.removeEventListener('ide:save', handleSave);
      document.removeEventListener('ide:openExtensions', handleOpenExtensions);
      document.removeEventListener('ide:toggleSidebar', handleToggleSidebar);
      document.removeEventListener('ide:togglePanel', handleTogglePanel);
    };
  }, [addTab, toggleLeftPanel, toggleBottomPanel, toggleRightPanel, setRightPanelType, rightPanelOpen]);

  return (
    <>
      {/* Backend Wake-Up Screen - Skip for desktop app */}
      {!backendReady && !isElectron && <BackendWakeUp onReady={() => setBackendReady(true)} />}

      {/* Toast Notifications */}
      <ToastContainer />

      <div className="h-screen flex flex-col bg-walrus-dark-950 text-gray-300 overflow-hidden selection:bg-walrus-cyan/30 selection:text-walrus-cyan">

        {/* New Professional Header */}
        <Header />

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative p-4 pt-0 gap-4">

          {/* Activity Bar (Sidebar) */}
          <div className="flex flex-col z-20 pt-2">
            <Sidebar />
          </div>

          {/* Left Panel */}
          {leftPanelOpen && (
            <div className="flex flex-row overflow-hidden rounded-2xl bg-walrus-dark-900 border border-white/5 shadow-premium backdrop-blur-sm z-10 mt-2">
              <div
                className="overflow-hidden flex-shrink-0 h-full"
                style={{ width: `${leftPanel.size}px` }}
              >
                <LeftPanel />
              </div>
              <ResizeHandle
                direction="horizontal"
                onMouseDown={leftPanel.handleMouseDown}
                isResizing={leftPanel.isResizing}
              />
            </div>
          )}

          {/* Center Area (Editor + Terminal) */}
          <div className="flex-1 flex flex-col min-w-0 rounded-2xl overflow-hidden bg-walrus-dark-900/50 border border-white/5 shadow-2xl relative mt-2">

            {/* Editor Area */}
            <div className="flex-1 flex flex-col min-h-0 relative">
              <EditorTabs />
              <div className="flex-1 overflow-hidden relative bg-walrus-dark-950/50">
                {/* Show NexiHome if no tabs are open, overlay CodeEditor if tabs exist */}
                <div className="absolute inset-0 z-0">
                  <NexiHome />
                </div>
                <div
                  className="absolute inset-0 z-10 transition-all duration-300 bg-walrus-dark-950"
                  style={{
                    opacity: tabs.length > 0 ? 1 : 0,
                    pointerEvents: tabs.length > 0 ? 'auto' : 'none'
                  }}
                >
                  <CodeEditor />
                </div>
              </div>
            </div>

            {/* Bottom Panel (Terminal) */}
            {bottomPanelOpen && (
              <div className="flex flex-col border-t border-white/5 bg-walrus-dark-900/90 backdrop-blur-xl">
                <ResizeHandle
                  direction="vertical"
                  onMouseDown={bottomPanel.handleMouseDown}
                  isResizing={bottomPanel.isResizing}
                />
                <div
                  className="overflow-hidden flex-shrink-0"
                  style={{ height: `${bottomPanel.size}px` }}
                >
                  <Terminal />
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <div className="flex flex-row overflow-hidden rounded-2xl bg-walrus-dark-900 border border-white/5 shadow-premium backdrop-blur-sm z-10 mt-2">
              <ResizeHandle
                direction="horizontal"
                onMouseDown={rightPanel.handleMouseDown}
                isResizing={rightPanel.isResizing}
              />
              <div
                className="overflow-hidden flex-shrink-0 h-full"
                style={{ width: `${rightPanel.size}px` }}
              >
                <RightPanel />
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-2 pb-1">
          <div className="rounded-lg overflow-hidden border border-white/5 bg-walrus-dark-900/80 backdrop-blur">
            <StatusBar />
          </div>
        </div>

        {/* Build Status Toast */}
        <BuildStatus
          status={buildStatus}
          message={buildMessage}
          onClose={() => setBuildStatus('idle')}
        />

        {/* New Project Dialog */}
        {showNewProjectDialog && (
          <NewProjectDialog onClose={() => setShowNewProjectDialog(false)} />
        )}
        
        {/* Keyboard Shortcuts Panel */}
        <KeyboardShortcuts 
          isOpen={showKeyboardShortcuts} 
          onClose={() => setShowKeyboardShortcuts(false)} 
        />
      </div>
    </>
  );
};

export default IDEPage;
