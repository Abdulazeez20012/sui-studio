import { create } from 'zustand';
import { FileNode, Tab, Terminal, PanelType, ViewMode, RightPanelType } from '../types/ide';

interface IDEState {
  // File System
  files: FileNode[];
  activeFile: string | null;
  
  // Tabs
  tabs: Tab[];
  activeTab: string | null;
  
  // Panels
  leftPanelOpen: boolean;
  leftPanelType: PanelType;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  
  // Terminal
  terminals: Terminal[];
  activeTerminal: string | null;
  
  // View
  viewMode: ViewMode;
  rightPanelType: RightPanelType;
  collaborationEnabled: boolean;
  
  // Actions
  setFiles: (files: FileNode[]) => void;
  setActiveFile: (path: string | null) => void;
  
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string) => void;
  
  toggleLeftPanel: () => void;
  setLeftPanelType: (type: PanelType) => void;
  toggleRightPanel: () => void;
  setRightPanelType: (type: RightPanelType) => void;
  toggleBottomPanel: () => void;
  toggleCollaboration: () => void;
  
  addTerminal: (terminal: Terminal) => void;
  setActiveTerminal: (id: string) => void;
  addTerminalOutput: (id: string, output: string) => void;
  clearTerminal: (id: string) => void;
  
  setViewMode: (mode: ViewMode) => void;
}

export const useIDEStore = create<IDEState>((set) => ({
  files: [],
  activeFile: null,
  
  tabs: [],
  activeTab: null,
  
  leftPanelOpen: true,
  leftPanelType: 'explorer',
  rightPanelOpen: false,
  bottomPanelOpen: true,
  
  terminals: [{
    id: 'terminal-1',
    name: 'Terminal 1',
    output: ['Welcome to Sui Studio IDE', '$ ']
  }],
  activeTerminal: 'terminal-1',
  
  viewMode: 'editor',
  rightPanelType: 'deployment',
  collaborationEnabled: false,
  
  setFiles: (files) => set({ files }),
  setActiveFile: (path) => set({ activeFile: path }),
  
  addTab: (tab) => set((state) => ({
    tabs: [...state.tabs, tab],
    activeTab: tab.id
  })),
  
  removeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== id);
    const activeTab = state.activeTab === id 
      ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null)
      : state.activeTab;
    return { tabs: newTabs, activeTab };
  }),
  
  setActiveTab: (id) => set({ activeTab: id }),
  
  updateTabContent: (id, content) => set((state) => ({
    tabs: state.tabs.map(tab => 
      tab.id === id ? { ...tab, content, isDirty: true } : tab
    )
  })),
  
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  setLeftPanelType: (type) => set({ leftPanelType: type }),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelType: (type: RightPanelType) => set({ rightPanelType: type }),
  toggleBottomPanel: () => set((state) => ({ bottomPanelOpen: !state.bottomPanelOpen })),
  toggleCollaboration: () => set((state) => ({ collaborationEnabled: !state.collaborationEnabled })),
  
  addTerminal: (terminal) => set((state) => ({
    terminals: [...state.terminals, terminal],
    activeTerminal: terminal.id
  })),
  
  setActiveTerminal: (id) => set({ activeTerminal: id }),
  
  addTerminalOutput: (id, output) => set((state) => ({
    terminals: state.terminals.map(t =>
      t.id === id ? { ...t, output: [...t.output, output] } : t
    )
  })),

  clearTerminal: (id) => set((state) => ({
    terminals: state.terminals.map(t =>
      t.id === id ? { ...t, output: [] } : t
    )
  })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
}));
