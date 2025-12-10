# 🚀 Desktop IDE - Next Steps Action Plan

## 🔴 CRITICAL: Make Desktop Actually Work

The desktop app currently has a **major limitation**: it can't interact with the real file system!

### Current Problems:
1. ❌ Files only exist in memory (lost on refresh)
2. ❌ Can't open folders from your computer
3. ❌ Can't save files to disk
4. ❌ Terminal can't execute real commands
5. ❌ No access to Sui CLI

---

## 📋 PHASE 1: File System Integration (2-3 days)

### Task 1: Implement "Open Folder" Feature
**File:** `src/hooks/useElectronFileSystem.ts` (new)

```typescript
export const useElectronFileSystem = () => {
  const openFolder = async () => {
    if (window.electron?.isElectron) {
      const result = await window.electron.showOpenDialog({
        properties: ['openDirectory']
      });
      
      if (!result.canceled && result.filePaths[0]) {
        const folderPath = result.filePaths[0];
        const files = await loadFolderRecursive(folderPath);
        return files;
      }
    }
  };
  
  const loadFolderRecursive = async (path: string) => {
    const result = await window.electron.readDirectory(path);
    // Build file tree...
  };
  
  return { openFolder };
};
```

**Integration:** Add "Open Folder" button to File Explorer header

---

### Task 2: Implement Real File Save
**File:** `src/hooks/useElectronFileSystem.ts`

```typescript
const saveFile = async (filePath: string, content: string) => {
  if (window.electron?.isElectron) {
    const result = await window.electron.writeFile(filePath, content);
    return result.success;
  }
};

const saveAllFiles = async (tabs: Tab[]) => {
  for (const tab of tabs) {
    if (tab.isDirty && tab.path) {
      await saveFile(tab.path, tab.content);
    }
  }
};
```

**Integration:** 
- Hook up Ctrl+S to save current file
- Hook up Ctrl+Shift+S to save all files
- Show save indicator in tabs

---

### Task 3: File Watcher
**File:** `electron/main.js`

```javascript
const chokidar = require('chokidar');

let watcher;

ipcMain.handle('watch-directory', async (event, dirPath) => {
  if (watcher) watcher.close();
  
  watcher = chokidar.watch(dirPath, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });
  
  watcher
    .on('change', path => {
      mainWindow.webContents.send('file-changed', path);
    })
    .on('add', path => {
      mainWindow.webContents.send('file-added', path);
    })
    .on('unlink', path => {
      mainWindow.webContents.send('file-deleted', path);
    });
});
```

**Integration:** Reload files when changed externally

---

## 📋 PHASE 2: Terminal Integration (1-2 days)

### Task 4: Real Terminal Execution
**File:** `electron/main.js`

```javascript
const { spawn } = require('child_process');

ipcMain.handle('execute-command', async (event, command, cwd) => {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      cwd: cwd || process.cwd(),
      env: process.env
    });
    
    let output = '';
    let error = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
      mainWindow.webContents.send('terminal-output', data.toString());
    });
    
    child.stderr.on('data', (data) => {
      error += data.toString();
      mainWindow.webContents.send('terminal-output', data.toString());
    });
    
    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output,
        error,
        exitCode: code
      });
    });
  });
});
```

**Integration:** Update Terminal component to use real execution

---

### Task 5: Working Directory Management
**File:** `src/components/ide/Terminal.tsx`

```typescript
const [workingDirectory, setWorkingDirectory] = useState(process.cwd());

const executeCommand = async (command: string) => {
  if (command.startsWith('cd ')) {
    const newDir = command.substring(3).trim();
    setWorkingDirectory(newDir);
    return;
  }
  
  const result = await window.electron.executeCommand(command, workingDirectory);
  // Handle output...
};
```

---

## 📋 PHASE 3: UI Improvements (1 day)

### Task 6: Add "Open Folder" Button
**File:** `src/components/ide/Header.tsx`

```tsx
<button
  onClick={handleOpenFolder}
  className="flex items-center gap-2 px-4 py-2 bg-walrus-dark-900 border border-white/5 rounded-xl hover:bg-walrus-dark-800"
>
  <FolderOpen size={18} />
  <span>Open Folder</span>
</button>
```

---

### Task 7: Recent Projects
**File:** `src/components/ide/NexiHome.tsx`

```tsx
const [recentProjects, setRecentProjects] = useState([]);

useEffect(() => {
  const recent = localStorage.getItem('recentProjects');
  if (recent) setRecentProjects(JSON.parse(recent));
}, []);

const addRecentProject = (path: string) => {
  const updated = [path, ...recentProjects.slice(0, 9)];
  localStorage.setItem('recentProjects', JSON.stringify(updated));
  setRecentProjects(updated);
};
```

---

### Task 8: File Path in Status Bar
**File:** `src/components/ide/StatusBar.tsx`

```tsx
<div className="flex items-center gap-2">
  <Folder size={14} />
  <span className="text-xs text-gray-400">{currentFilePath}</span>
</div>
```

---

## 📋 PHASE 4: Find & Replace (1 day)

### Task 9: Find in File (Ctrl+F)
**File:** `src/components/ide/FindWidget.tsx` (new)

```tsx
const FindWidget = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceWith, setReplaceWith] = useState('');
  
  const handleFind = () => {
    // Use Monaco's built-in find
    editorRef.current?.trigger('', 'actions.find');
  };
  
  return (
    <div className="absolute top-4 right-4 bg-walrus-dark-900 border border-white/10 rounded-xl p-3 shadow-xl">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Find..."
        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg"
      />
      {/* Replace UI... */}
    </div>
  );
};
```

---

### Task 10: Search Across Files
**File:** `src/components/ide/SearchPanel.tsx`

```tsx
const searchInFiles = async (query: string) => {
  const results = [];
  
  for (const file of allFiles) {
    const content = await window.electron.readFile(file.path);
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes(query)) {
        results.push({
          file: file.path,
          line: index + 1,
          content: line
        });
      }
    });
  }
  
  return results;
};
```

---

## 🎯 IMPLEMENTATION ORDER

### Week 1: Core Functionality
```
Day 1-2: File System Integration
  ✓ Open Folder
  ✓ Save File
  ✓ Load Files
  
Day 3-4: Terminal Integration
  ✓ Real Command Execution
  ✓ Working Directory
  ✓ Sui CLI Access
  
Day 5: Testing & Bug Fixes
```

### Week 2: Polish
```
Day 1: UI Improvements
  ✓ Open Folder Button
  ✓ Recent Projects
  ✓ Status Bar Updates
  
Day 2-3: Find & Replace
  ✓ Find in File
  ✓ Search Across Files
  ✓ Regex Support
  
Day 4-5: Testing & Documentation
```

---

## 📦 REQUIRED DEPENDENCIES

Add to `package.json`:

```json
{
  "dependencies": {
    "chokidar": "^3.5.3"  // File watching
  }
}
```

---

## 🧪 TESTING CHECKLIST

### File System Tests:
- [ ] Open a folder from disk
- [ ] Files load correctly
- [ ] Folder structure preserved
- [ ] Save file to disk
- [ ] Save all files
- [ ] File changes detected
- [ ] New files appear automatically
- [ ] Deleted files removed from tree

### Terminal Tests:
- [ ] Execute `ls` command
- [ ] Execute `sui --version`
- [ ] Execute `sui move build`
- [ ] Change directory with `cd`
- [ ] Run multi-line commands
- [ ] Handle errors gracefully
- [ ] Output appears in real-time

### UI Tests:
- [ ] Open Folder button works
- [ ] Recent projects list
- [ ] File path in status bar
- [ ] Save indicator in tabs
- [ ] Keyboard shortcuts work

---

## 🚨 BREAKING CHANGES

### Migration Required:
Current in-memory file system → Real file system

**Impact:** Users will need to:
1. Open a folder to start working
2. Files will persist between sessions
3. Can use external editors alongside IDE

**Benefits:**
- ✅ Real project management
- ✅ Git integration possible
- ✅ External tool compatibility
- ✅ No data loss on refresh

---

## 📝 NOTES

### Security Considerations:
- Validate all file paths
- Prevent directory traversal attacks
- Limit file size for reading
- Sandbox terminal execution

### Performance:
- Lazy load large directories
- Debounce file watcher events
- Cache file contents
- Virtual scrolling for large files

### User Experience:
- Show loading states
- Handle errors gracefully
- Provide helpful error messages
- Auto-save on interval

---

## 🎉 EXPECTED OUTCOME

After completing these phases, the desktop IDE will:

✅ Open real projects from disk
✅ Save changes to actual files
✅ Execute real terminal commands
✅ Run Sui CLI directly
✅ Watch for external file changes
✅ Find and replace in files
✅ Show recent projects
✅ Work like a real IDE!

**This transforms it from a demo to a production-ready tool!**
