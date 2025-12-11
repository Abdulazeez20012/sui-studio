# Sui Studio IDE - Comprehensive Technical Report
## Part 7: Advanced Features & Hooks

---

## 7. ADVANCED FEATURES

### 7.1 File Watcher System

**Purpose:** Real-time file system monitoring for external changes

**Hook: useFileWatcher.ts**

**Architecture:**
```
File System Change
    ↓
Chokidar (Main Process)
    ↓
IPC Event (file-changed, file-added, etc.)
    ↓
useFileWatcher Hook
    ↓
Callback Functions
    ↓
UI Update
```

**Implementation:**
```typescript
export const useFileWatcher = (callbacks: FileWatcherCallbacks = {}) => {
  const { currentFolder, isElectron } = useElectronFileSystem();

  // Start watcher when folder changes
  useEffect(() => {
    if (!isElectron || !currentFolder || !window.electron) return;

    window.electron.startFileWatcher(currentFolder);

    return () => {
      window.electron?.stopFileWatcher();
    };
  }, [currentFolder, isElectron]);

  // Set up event listeners
  useEffect(() => {
    if (!isElectron || !window.electron) return;

    if (callbacks.onFileChanged) {
      window.electron.onFileChanged(callbacks.onFileChanged);
    }
    if (callbacks.onFileAdded) {
      window.electron.onFileAdded(callbacks.onFileAdded);
    }
    if (callbacks.onFileDeleted) {
      window.electron.onFileDeleted(callbacks.onFileDeleted);
    }
    if (callbacks.onDirectoryAdded) {
      window.electron.onDirectoryAdded(callbacks.onDirectoryAdded);
    }
    if (callbacks.onDirectoryDeleted) {
      window.electron.onDirectoryDeleted(callbacks.onDirectoryDeleted);
    }
  }, [callbacks, isElectron]);

  return { isWatching: isElectron && !!currentFolder };
};
```

**Usage in FileExplorer:**
```typescript
useFileWatcher({
  onFileChanged: (filePath) => {
    console.log('File changed:', filePath);
    // Reload file if open in editor
    const openTab = tabs.find(t => t.path === filePath);
    if (openTab) {
      reloadFileContent(openTab.id);
    }
  },
  onFileAdded: (filePath) => {
    console.log('File added:', filePath);
    // Refresh file tree
    refreshFileTree();
  },
  onFileDeleted: (filePath) => {
    console.log('File deleted:', filePath);
    // Close tab if open
    const openTab = tabs.find(t => t.path === filePath);
    if (openTab) {
      removeTab(openTab.id);
    }
    refreshFileTree();
  },
});
```

**Chokidar Configuration (Main Process):**
```javascript
fileWatcher = chokidar.watch(folderPath, {
  ignored: /(^|[\/\\])\../,  // Ignore dotfiles
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 300,  // Wait 300ms after last change
    pollInterval: 100
  },
  ignored: [
    '**/node_modules/**',
    '**/.git/**',
    '**/build/**',
    '**/dist/**',
    '**/.next/**',
    '**/target/**'
  ]
});
```

**Events Emitted:**
- `file-changed`: File content modified
- `file-added`: New file created
- `file-deleted`: File removed
- `directory-added`: New folder created
- `directory-deleted`: Folder removed



### 7.2 Keyboard Shortcuts System

**Hook: useKeyboardShortcuts.ts**

**Purpose:** Global keyboard shortcut handling

**Supported Shortcuts:**

| Shortcut | Action | Description |
|----------|--------|-------------|
| Ctrl/Cmd + B | Toggle Sidebar | Show/hide file explorer |
| Ctrl/Cmd + J | Toggle Terminal | Show/hide terminal panel |
| Ctrl/Cmd + S | Save File | Save current file |
| Ctrl/Cmd + Shift + S | Save All | Save all open files |
| Ctrl/Cmd + W | Close Tab | Close current tab |
| Ctrl/Cmd + Tab | Next Tab | Switch to next tab |
| Ctrl/Cmd + Shift + B | Build | Build project |
| Ctrl/Cmd + Shift + T | Test | Run tests |
| Ctrl/Cmd + Shift + D | Deploy | Deploy contract |

**Implementation:**
```typescript
export const useKeyboardShortcuts = () => {
  const { 
    toggleLeftPanel, 
    toggleBottomPanel, 
    tabs, 
    activeTab, 
    setActiveTab,
    removeTab 
  } = useIDEStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + B: Toggle sidebar
      if (modifier && e.key === 'b') {
        e.preventDefault();
        toggleLeftPanel();
      }

      // Ctrl/Cmd + J: Toggle terminal
      if (modifier && e.key === 'j') {
        e.preventDefault();
        toggleBottomPanel();
      }

      // Ctrl/Cmd + S: Save file
      if (modifier && e.key === 's') {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent('ide:saveFile'));
      }
      
      // Ctrl/Cmd + W: Close tab
      if (modifier && e.key === 'w') {
        e.preventDefault();
        if (activeTab) {
          removeTab(activeTab);
        }
      }

      // Ctrl/Cmd + Tab: Next tab
      if (modifier && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex !== -1 && tabs.length > 1) {
          const nextIndex = (currentIndex + 1) % tabs.length;
          setActiveTab(tabs[nextIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftPanel, toggleBottomPanel, tabs, activeTab, setActiveTab, removeTab]);
};
```

**Platform Detection:**
- Automatically detects Mac vs Windows/Linux
- Uses Cmd on Mac, Ctrl on Windows/Linux
- Consistent behavior across platforms

### 7.3 Recent Files System

**Hook: useRecentFiles.ts**

**Purpose:** Track and display recently opened files

**Features:**
- Persistent storage (localStorage)
- Maximum 10 recent files
- Duplicate prevention
- Quick access menu

**Implementation:**
```typescript
export const useRecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentFiles');
    if (stored) {
      setRecentFiles(JSON.parse(stored));
    }
  }, []);

  const addRecentFile = (path: string, name: string) => {
    setRecentFiles(prev => {
      // Remove if already exists
      const filtered = prev.filter(f => f.path !== path);
      
      // Add to beginning
      const updated = [
        { path, name, timestamp: Date.now() },
        ...filtered
      ].slice(0, 10);  // Keep only 10 most recent
      
      // Save to localStorage
      localStorage.setItem('recentFiles', JSON.stringify(updated));
      
      return updated;
    });
  };

  const clearRecentFiles = () => {
    setRecentFiles([]);
    localStorage.removeItem('recentFiles');
  };

  return { recentFiles, addRecentFile, clearRecentFiles };
};
```

**UI Component:**
```typescript
<div className="recent-files">
  <h3>Recent Files</h3>
  {recentFiles.map(file => (
    <button
      key={file.path}
      onClick={() => openFile(file.path)}
      className="recent-file-item"
    >
      <FileIcon type={getFileType(file.name)} />
      <span>{file.name}</span>
      <span className="file-path">{file.path}</span>
    </button>
  ))}
</div>
```

