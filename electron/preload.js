const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', dirPath),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', filePath),
  
  // Dialog operations
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  
  // Menu events
  onMenuNewProject: (callback) => ipcRenderer.on('menu-new-project', callback),
  onMenuOpenFolder: (callback) => ipcRenderer.on('menu-open-folder', (event, path) => callback(path)),
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onMenuSaveAll: (callback) => ipcRenderer.on('menu-save-all', callback),
  onMenuFind: (callback) => ipcRenderer.on('menu-find', callback),
  onMenuReplace: (callback) => ipcRenderer.on('menu-replace', callback),
  onMenuToggleSidebar: (callback) => ipcRenderer.on('menu-toggle-sidebar', callback),
  onMenuToggleTerminal: (callback) => ipcRenderer.on('menu-toggle-terminal', callback),
  onMenuBuild: (callback) => ipcRenderer.on('menu-build', callback),
  onMenuTest: (callback) => ipcRenderer.on('menu-test', callback),
  onMenuDeploy: (callback) => ipcRenderer.on('menu-deploy', callback),
  
  // Platform info
  platform: process.platform,
  isElectron: true,
});

// Expose Node.js version info
contextBridge.exposeInMainWorld('versions', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});
