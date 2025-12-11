// Type definitions for Electron API exposed via contextBridge

interface ElectronAPI {
  // File system operations
  readFile: (filePath: string) => Promise<string>;
  writeFile: (filePath: string, content: string) => Promise<void>;
  readDirectory: (dirPath: string) => Promise<any[]>;
  createDirectory: (dirPath: string) => Promise<void>;
  deleteFile: (filePath: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  
  // Terminal operations
  executeCommand: (command: string, cwd?: string) => Promise<{
    success: boolean;
    output: string;
    error?: string;
  }>;
  onTerminalOutput: (callback: (data: any) => void) => void;
  
  // File watcher operations
  startFileWatcher: (folderPath: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  stopFileWatcher: () => Promise<{ success: boolean; message?: string; error?: string }>;
  onFileChanged: (callback: (filePath: string) => void) => void;
  onFileAdded: (callback: (filePath: string) => void) => void;
  onFileDeleted: (callback: (filePath: string) => void) => void;
  onDirectoryAdded: (callback: (dirPath: string) => void) => void;
  onDirectoryDeleted: (callback: (dirPath: string) => void) => void;
  
  // Dialog operations
  showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
  showSaveDialog: (options: any) => Promise<{ canceled: boolean; filePath?: string }>;
  
  // Menu events
  onMenuNewProject: (callback: () => void) => void;
  onMenuOpenFolder: (callback: (path: string) => void) => void;
  onMenuSave: (callback: () => void) => void;
  onMenuSaveAll: (callback: () => void) => void;
  onMenuFind: (callback: () => void) => void;
  onMenuReplace: (callback: () => void) => void;
  onMenuToggleSidebar: (callback: () => void) => void;
  onMenuToggleTerminal: (callback: () => void) => void;
  onMenuBuild: (callback: () => void) => void;
  onMenuTest: (callback: () => void) => void;
  onMenuDeploy: (callback: () => void) => void;
  
  // Platform info
  platform: string;
  isElectron: boolean;
}

interface Window {
  electron?: ElectronAPI;
  versions?: {
    node: string;
    chrome: string;
    electron: string;
  };
}
