# 🔌 Quick Create Integration Guide

## How to Integrate

### 1. Add Quick Create Button to Toolbar

**File**: `src/components/ide/Toolbar.tsx`

```typescript
import { QuickActionsMenu } from './QuickActionsMenu';

// In the toolbar component, add:
<QuickActionsMenu />
```

### 2. Add Context Menu to File Explorer

**File**: `src/components/ide/FileExplorer.tsx`

```typescript
import { FolderContextMenu } from './FolderContextMenu';
import { useState } from 'react';

// Add state for context menu
const [contextMenu, setContextMenu] = useState<{
  folder: FileNode;
  position: { x: number; y: number };
} | null>(null);

// On folder right-click:
<div
  onContextMenu={(e) => {
    e.preventDefault();
    setContextMenu({
      folder: node,
      position: { x: e.clientX, y: e.clientY }
    });
  }}
>
  {/* Folder content */}
</div>

// Render context menu:
{contextMenu && (
  <FolderContextMenu
    folder={contextMenu.folder}
    position={contextMenu.position}
    onClose={() => setContextMenu(null)}
  />
)}
```

### 3. Update IDE Store

**File**: `src/store/ideStore.ts`

Ensure these methods exist:
```typescript
addFile: (file: FileNode) => void;
addFolder: (folder: FileNode) => void;
setFiles: (files: FileNode[]) => void;
```

---

## Quick Test

### Test Quick Create
1. Open IDE
2. Click "Quick Create" button
3. Enter "test_project"
4. Click "Create Project"
5. Verify files are created ✅

### Test Context Menu
1. Right-click on "sources" folder
2. Select "New Move Module"
3. Enter "test_module"
4. Click "Create Module"
5. Verify module and test files created ✅

---

## Files Created

✅ `src/services/projectInitService.ts` - Core service  
✅ `src/components/ide/QuickActionsMenu.tsx` - Quick create button  
✅ `src/components/ide/FolderContextMenu.tsx` - Context menu  
✅ `ONE_CLICK_MOVE_PROJECT.md` - Full documentation  
✅ `QUICK_CREATE_INTEGRATION.md` - This file  

---

## Status

**Ready to integrate!** Just add the components to your toolbar and file explorer.
