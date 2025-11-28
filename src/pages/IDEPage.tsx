import React, { useState } from 'react';
import MenuBar from '../components/ide/MenuBar';
import Sidebar from '../components/ide/Sidebar';
import LeftPanel from '../components/ide/LeftPanel';
import RightPanel from '../components/ide/RightPanel';
import EditorTabs from '../components/ide/EditorTabs';
import CodeEditor from '../components/ide/CodeEditor';
import Terminal from '../components/ide/Terminal';
import StatusBar from '../components/ide/StatusBar';
import Toolbar from '../components/ide/Toolbar';
import BuildStatus from '../components/ide/BuildStatus';
import ResizeHandle from '../components/ide/ResizeHandle';
import { BackendWakeUp } from '../components/BackendWakeUp';
import { useIDEStore } from '../store/ideStore';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useResizable } from '../hooks/useResizable';

const IDEPage: React.FC = () => {
  const { leftPanelOpen, rightPanelOpen, bottomPanelOpen, toggleLeftPanel, toggleBottomPanel, toggleRightPanel, setRightPanelType, addTab } = useIDEStore();
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [buildMessage, setBuildMessage] = useState('');
  const [backendReady, setBackendReady] = useState(false);

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

  // Handle menu bar events
  React.useEffect(() => {
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
      // Implement save logic
    };

    const handleFind = () => {
      console.log('Find triggered');
      // Implement find logic
    };

    const handleToggleSidebar = () => {
      toggleLeftPanel();
    };

    const handleTogglePanel = () => {
      toggleBottomPanel();
    };

    const handleBuild = () => {
      setBuildStatus('building');
      setBuildMessage('Building project...');
      setTimeout(() => {
        setBuildStatus('success');
        setBuildMessage('Build completed successfully');
      }, 2000);
    };

    const handleTest = () => {
      console.log('Test triggered');
      // Implement test logic
    };

    const handleOpenExtensions = () => {
      setRightPanelType('extensions');
      if (!rightPanelOpen) {
        toggleRightPanel();
      }
    };

    document.addEventListener('ide:newFile', handleNewFile);
    document.addEventListener('ide:save', handleSave);
    document.addEventListener('ide:openExtensions', handleOpenExtensions);
    document.addEventListener('ide:find', handleFind);
    document.addEventListener('ide:toggleSidebar', handleToggleSidebar);
    document.addEventListener('ide:togglePanel', handleTogglePanel);
    document.addEventListener('ide:build', handleBuild);
    document.addEventListener('ide:test', handleTest);

    return () => {
      document.removeEventListener('ide:newFile', handleNewFile);
      document.removeEventListener('ide:save', handleSave);
      document.removeEventListener('ide:openExtensions', handleOpenExtensions);
      document.removeEventListener('ide:find', handleFind);
      document.removeEventListener('ide:toggleSidebar', handleToggleSidebar);
      document.removeEventListener('ide:togglePanel', handleTogglePanel);
      document.removeEventListener('ide:build', handleBuild);
      document.removeEventListener('ide:test', handleTest);
    };
  }, [addTab, toggleLeftPanel, toggleBottomPanel, toggleRightPanel, setRightPanelType, rightPanelOpen]);

  return (
    <>
      {/* Backend Wake-Up Screen */}
      {!backendReady && <BackendWakeUp onReady={() => setBackendReady(true)} />}

      <div className="h-screen flex flex-col bg-walrus-dark-950 text-gray-300 overflow-hidden">
        {/* Menu Bar */}
        <MenuBar />

        {/* Top Header Bar with Gradient */}
        <div className="h-14 bg-walrus-dark-900 border-b border-walrus-dark-600 flex items-center justify-between px-4 relative z-30">
          <Toolbar />
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Sidebar */}
          <Sidebar />

          {/* File Explorer Panel */}
          {leftPanelOpen && (
            <>
              <div
                className="bg-walrus-dark-900 border-r border-walrus-dark-600 overflow-hidden flex-shrink-0"
                style={{ width: `${leftPanel.size}px` }}
              >
                <LeftPanel />
              </div>
              <ResizeHandle
                direction="horizontal"
                onMouseDown={leftPanel.handleMouseDown}
                isResizing={leftPanel.isResizing}
              />
            </>
          )}

          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col min-w-0 bg-walrus-dark-950 relative">
            <EditorTabs />

            <div className="flex-1 overflow-hidden relative">
              <CodeEditor />
            </div>

            {/* Bottom Panel (Terminal/Tests) */}
            {bottomPanelOpen && (
              <>
                <ResizeHandle
                  direction="vertical"
                  onMouseDown={bottomPanel.handleMouseDown}
                  isResizing={bottomPanel.isResizing}
                />
                <div
                  className="border-t border-walrus-dark-600 bg-walrus-dark-900 overflow-hidden flex-shrink-0"
                  style={{ height: `${bottomPanel.size}px` }}
                >
                  <Terminal />
                </div>
              </>
            )}
          </div>

          {/* Right Panel */}
          {rightPanelOpen && (
            <>
              <ResizeHandle
                direction="horizontal"
                onMouseDown={rightPanel.handleMouseDown}
                isResizing={rightPanel.isResizing}
              />
              <div
                className="border-l border-walrus-dark-600 bg-walrus-dark-900 overflow-hidden flex-shrink-0"
                style={{ width: `${rightPanel.size}px` }}
              >
                <RightPanel />
              </div>
            </>
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
    </>
  );
};

export default IDEPage;
