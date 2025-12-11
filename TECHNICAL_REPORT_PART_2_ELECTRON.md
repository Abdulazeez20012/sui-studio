# Sui Studio IDE - Comprehensive Technical Report
## Part 2: Electron Desktop Integration

---

## 2. ELECTRON ARCHITECTURE

### 2.1 Process Model

Electron uses a multi-process architecture for security and stability:

**Main Process (electron/main.js):**
- Node.js environment with full system access
- Manages application lifecycle
- Creates and controls browser windows
- Handles native OS interactions (menus, dialogs, file system)
- Implements IPC (Inter-Process Communication) handlers

**Renderer Process (React App):**
- Chromium browser environment
- Runs the React application
- Sandboxed for security
- Communicates with main process via IPC

**Preload Script (electron/preload.js):**
- Bridge between main and renderer processes
- Exposes safe APIs to renderer using contextBridge
- Prevents direct Node.js access from renderer
- Implements security best practices

### 2.2 Security Architecture

**Context Isolation:** Enabled
- Renderer process cannot access Node.js or Electron APIs directly
- All communication goes through preload script

**Node Integration:** Disabled
- Prevents arbitrary code execution in renderer
- Reduces attack surface

**Web Security:** Enabled
- Same-origin policy enforced
- No insecure content allowed

**Preload Script API Surface:**
```javascript
window.electron = {
  // File System Operations
  readFile: (filePath) => Promise<{success, content, error}>
  writeFile: (filePath, content) => Promise<{success, error}>
  readDirectory: (dirPath) => Promise<{success, files, error}>
  createDirectory: (dirPath) => Promise<{success, error}>
  deleteFile: (filePath) => Promise<{success, error}>
  renameFile: (oldPath, newPath) => Promise<{success, error}>
  
  // Dialog Operations
  showOpenDialog: (options) => Promise<{canceled, filePaths}>
  showSaveDialog: (options) => Promise<{canceled, filePath}>
  
  // Terminal Operations
  executeCommand: (command, cwd) => Promise<{success, output, error, exitCode}>
  onTerminalOutput: (callback) => void
  
  // File Watcher Operations
  startFileWatcher: (folderPath) => Promise<{success, message}>
  stopFileWatcher: () => Promise<{success, message}>
  onFileChanged: (callback) => void
  onFileAdded: (callback) => void
  onFileDeleted: (callback) => void
  onDirectoryAdded: (callback) => void
  onDirectoryDeleted: (callback) => void
  
  // Menu Events
  onMenuNewProject: (callback) => void
  onMenuOpenFolder: (callback) => void
  onMenuSave: (callback) => void
  onMenuSaveAll: (callback) => void
  onMenuFind: (callback) => void
  onMenuReplace: (callback) => void
  onMenuToggleSidebar: (callback) => void
  onMenuToggleTerminal: (callback) => void
  onMenuBuild: (callback) => void
  onMenuTest: (callback) => void
  onMenuDeploy: (callback) => void
  
  // Platform Info
  platform: string
  isElectron: boolean
}
```



### 2.3 File System Integration

**Implementation Strategy:**
- All file operations go through IPC handlers in main process
- Async/await pattern for clean error handling
- UTF-8 encoding for text files
- Recursive directory operations with depth limits

**Key Features:**

1. **Recursive Directory Reading:**
   - Traverses folder structure up to 10 levels deep
   - Filters hidden files and common ignore patterns
   - Returns structured FileNode tree
   - Sorts folders before files alphabetically

2. **File Watching with Chokidar:**
   - Real-time file system monitoring
   - Debounced write detection (300ms stability threshold)
   - Ignores node_modules, .git, build directories
   - Emits events for: change, add, unlink, addDir, unlinkDir

3. **File Operations:**
   - Read: Loads file content as UTF-8 string
   - Write: Saves content with automatic directory creation
   - Delete: Handles both files and directories recursively
   - Rename: Atomic file/folder renaming
   - Create Directory: Recursive directory creation

**Error Handling:**
- All operations return {success, data/error} objects
- Graceful degradation on permission errors
- User-friendly error messages
- Console logging for debugging

### 2.4 Terminal Integration

**Architecture:**
- Spawns child processes for command execution
- Platform-specific shell selection (bash/cmd.exe)
- Real-time output streaming via IPC events
- Working directory support

**Implementation Details:**

```javascript
const child = spawn(shell, shellArgs, {
  cwd: cwd || process.cwd(),
  env: process.env,
  shell: false,  // Direct execution for security
});

// Stream stdout in real-time
child.stdout.on('data', (data) => {
  mainWindow.webContents.send('terminal-output', data.toString());
});

// Stream stderr in real-time
child.stderr.on('data', (data) => {
  mainWindow.webContents.send('terminal-output', data.toString());
});

// Handle completion
child.on('close', (code) => {
  resolve({ success: code === 0, output, error, exitCode: code });
});
```

**Features:**
- Real-time output streaming
- Exit code capture
- Error output handling
- Environment variable inheritance
- Working directory specification

