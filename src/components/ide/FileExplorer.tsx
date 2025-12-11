import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight, ChevronDown, File, Folder, FolderOpen,
  Plus, Trash2, Edit2, Download, Upload, MoreVertical,
  FilePlus, FolderPlus, X, Check, FolderOpen as FolderOpenIcon
} from 'lucide-react';
import { FileNode } from '../../types/ide';
import { useIDEStore } from '../../store/ideStore';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';
import { useRecentFiles } from '../../hooks/useRecentFiles';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onRename: (node: FileNode, newName: string) => void;
  onDelete: (node: FileNode) => void;
  onCreateFile: (parentNode: FileNode) => void;
  onCreateFolder: (parentNode: FileNode) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  node,
  level,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const [showMenu, setShowMenu] = useState(false);
  const { addTab, setActiveTab, tabs } = useIDEStore();
  const { addRecentFile } = useRecentFiles();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = async () => {
    if (isRenaming) return;

    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      const existingTab = tabs.find(t => t.path === node.path);
      if (existingTab) {
        setActiveTab(existingTab.id);
      } else {
        // Load file content if in Electron
        let content = node.content || '';
        if (window.electron?.isElectron && node.path) {
          try {
            const result = await window.electron.readFile(node.id);
            if (result.success && typeof result.content === 'string') {
              content = result.content;
            }
          } catch (error) {
            console.error('Failed to load file:', error);
          }
        }
        
        const newTab = {
          id: `tab-${Date.now()}`,
          name: node.name,
          path: node.path,
          content: typeof content === 'string' ? content : '',
          language: node.language || 'move',
          isDirty: false
        };
        addTab(newTab);
        
        // Add to recent files
        if (node.path) {
          addRecentFile(node.path, node.name);
        }
      }
    }
  };

  const handleRename = () => {
    if (newName.trim() && newName !== node.name) {
      onRename(node, newName.trim());
    }
    setIsRenaming(false);
  };

  const startRename = () => {
    setIsRenaming(true);
    setShowMenu(false);
    setTimeout(() => inputRef.current?.select(), 0);
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer group transition-all duration-200 border-l-2 border-transparent hover:border-walrus-cyan/50 relative"
        style={{ paddingLeft: `${level * 12 + 12}px` }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0" onClick={handleClick}>
          {node.type === 'folder' && (
            <span className="text-gray-500 group-hover:text-white transition-colors">
              {isOpen ? <ChevronDown size={14} strokeWidth={2.5} /> : <ChevronRight size={14} strokeWidth={2.5} />}
            </span>
          )}
          <span className={node.type === 'folder' ? 'text-walrus-purple group-hover:text-walrus-purple-light transition-colors' : 'text-gray-500 group-hover:text-walrus-cyan transition-colors'}>
            {node.type === 'folder' ? (
              isOpen ? <FolderOpen size={16} strokeWidth={2} /> : <Folder size={16} strokeWidth={2} />
            ) : (
              <File size={16} strokeWidth={2} />
            )}
          </span>

          {isRenaming ? (
            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') {
                    setNewName(node.name);
                    setIsRenaming(false);
                  }
                }}
                className="flex-1 px-1.5 py-0.5 bg-black/40 border border-walrus-cyan/50 rounded text-xs text-white focus:outline-none focus:border-walrus-cyan focus:shadow-neon-sm"
              />
            </div>
          ) : (
            <span className="text-sm text-gray-400 group-hover:text-white font-medium transition-colors truncate">
              {node.name}
            </span>
          )}
        </div>

        {!isRenaming && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-all"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        )}

        {/* Context Menu */}
        {showMenu && (
          <div className="absolute right-2 top-8 bg-walrus-dark-800 border border-white/10 rounded-xl shadow-glass py-1 z-50 min-w-[160px] backdrop-blur-xl">
            {node.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFile(node);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-walrus-cyan hover:bg-walrus-cyan/5 transition-all font-medium"
                >
                  <FilePlus size={14} />
                  <span>New File</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFolder(node);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-walrus-cyan hover:bg-walrus-cyan/5 transition-all font-medium"
                >
                  <FolderPlus size={14} />
                  <span>New Folder</span>
                </button>
                <div className="h-px bg-white/5 my-1" />
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                startRename();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
            >
              <Edit2 size={14} />
              <span>Rename</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
                setShowMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-red-400 hover:bg-red-400/5 transition-all font-medium"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {node.type === 'folder' && isOpen && node.children && (
        <div className="border-l border-white/5 ml-[23px]">
          {node.children.map((child) => (
            <FileTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              onRename={onRename}
              onDelete={onDelete}
              onCreateFile={onCreateFile}
              onCreateFolder={onCreateFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC = () => {
  const { files, setFiles, addTab, tabs, activeTab, updateTabContent, markTabAsSaved } = useIDEStore();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Electron file system integration
  const {
    isElectron,
    currentFolder,
    isLoading,
    openFolder,
    readFile,
    writeFile,
    createFile,
    createDirectory,
    deleteFile: deleteFileFromDisk,
    renameFile: renameFileOnDisk,
  } = useElectronFileSystem();

  const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateNodeInTree = (nodes: FileNode[], targetId: string, updater: (node: FileNode) => FileNode): FileNode[] => {
    return nodes.map(node => {
      if (node.id === targetId) {
        return updater(node);
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeInTree(node.children, targetId, updater)
        };
      }
      return node;
    });
  };

  const deleteNodeFromTree = (nodes: FileNode[], targetId: string): FileNode[] => {
    return nodes.filter(node => {
      if (node.id === targetId) return false;
      if (node.children) {
        node.children = deleteNodeFromTree(node.children, targetId);
      }
      return true;
    });
  };

  const handleCreateFile = async (parentNode?: FileNode) => {
    const fileName = prompt('Enter file name:', 'untitled.move');
    if (!fileName) return;

    const filePath = parentNode ? `${parentNode.path}/${fileName}` : `/${fileName}`;
    const content = '// New Move file\n';

    // If in Electron, create file on disk
    if (isElectron && currentFolder) {
      try {
        await createFile(filePath, content);
        // Reload folder to show new file
        const loadedFiles = await openFolder();
        if (loadedFiles) {
          setFiles(loadedFiles);
        }
      } catch (error: any) {
        alert(`Failed to create file: ${error.message}`);
        return;
      }
    } else {
      // Web: create in memory
      const newFile: FileNode = {
        id: generateId(),
        name: fileName,
        type: 'file',
        path: filePath,
        content,
        language: fileName.endsWith('.move') ? 'move' : 'plaintext'
      };

      if (parentNode) {
        const updatedFiles = updateNodeInTree(files, parentNode.id, (node) => ({
          ...node,
          children: [...(node.children || []), newFile]
        }));
        setFiles(updatedFiles);
      } else {
        setFiles([...files, newFile]);
      }
    }

    // Open the new file in editor
    setTimeout(() => {
      addTab({
        id: `tab-${Date.now()}`,
        name: fileName,
        path: filePath,
        content,
        language: fileName.endsWith('.move') ? 'move' : 'plaintext',
        isDirty: false
      });
    }, 100);
  };

  const handleCreateFolder = async (parentNode?: FileNode) => {
    const folderName = prompt('Enter folder name:', 'new-folder');
    if (!folderName) return;

    const folderPath = parentNode ? `${parentNode.path}/${folderName}` : `/${folderName}`;

    // If in Electron, create folder on disk
    if (isElectron && currentFolder) {
      try {
        await createDirectory(folderPath);
        // Reload folder to show new directory
        const loadedFiles = await openFolder();
        if (loadedFiles) {
          setFiles(loadedFiles);
        }
      } catch (error: any) {
        alert(`Failed to create folder: ${error.message}`);
      }
    } else {
      // Web: create in memory
      const newFolder: FileNode = {
        id: generateId(),
        name: folderName,
        type: 'folder',
        path: folderPath,
        children: []
      };

      if (parentNode) {
        const updatedFiles = updateNodeInTree(files, parentNode.id, (node) => ({
          ...node,
          children: [...(node.children || []), newFolder]
        }));
        setFiles(updatedFiles);
      } else {
        setFiles([...files, newFolder]);
      }
    }
  };

  const handleRename = async (node: FileNode, newName: string) => {
    // If in Electron, rename on disk
    if (isElectron && currentFolder) {
      try {
        const oldPath = node.path;
        const newPath = node.path.replace(node.name, newName);
        
        // Use native rename
        await renameFileOnDisk(oldPath, newPath);
        
        // Reload folder to show changes
        const loadedFiles = await openFolder();
        if (loadedFiles) {
          setFiles(loadedFiles);
        }
        
        // Update open tabs with new path
        const openTab = tabs.find(t => t.path === oldPath);
        if (openTab) {
          // Update tab path
          updateTabContent(openTab.id, openTab.content);
        }
      } catch (error: any) {
        alert(`Failed to rename: ${error.message}`);
      }
    } else {
      // Web: rename in memory
      const updatedFiles = updateNodeInTree(files, node.id, (n) => ({
        ...n,
        name: newName,
        path: n.path.replace(n.name, newName)
      }));
      setFiles(updatedFiles);
    }
  };

  const handleDelete = async (node: FileNode) => {
    if (!confirm(`Are you sure you want to delete "${node.name}"?`)) return;

    // If in Electron, delete from disk
    if (isElectron && currentFolder) {
      try {
        await deleteFileFromDisk(node.path);
        
        // Reload folder to show changes
        const loadedFiles = await openFolder();
        if (loadedFiles) {
          setFiles(loadedFiles);
        }
        
        // Close tab if file is open
        const openTab = tabs.find(t => t.path === node.path);
        if (openTab) {
          // Dispatch event to close tab
          document.dispatchEvent(new CustomEvent('ide:closeTab', { detail: openTab.id }));
        }
      } catch (error: any) {
        alert(`Failed to delete: ${error.message}`);
      }
    } else {
      // Web: delete from memory
      const updatedFiles = deleteNodeFromTree(files, node.id);
      setFiles(updatedFiles);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFile: FileNode = {
        id: generateId(),
        name: file.name,
        type: 'file',
        path: `/${file.name}`,
        content,
        language: file.name.endsWith('.move') ? 'move' : 'plaintext'
      };
      setFiles([...files, newFile]);

      // Open the uploaded file
      addTab({
        id: `tab-${Date.now()}`,
        name: newFile.name,
        path: newFile.path,
        content: content,
        language: newFile.language,
        isDirty: false
      });
    };
    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadAll = () => {
    const exportData = JSON.stringify(files, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project-files.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle opening folder in Electron
  const handleOpenFolder = async () => {
    console.log('handleOpenFolder called, isElectron:', isElectron);
    if (!isElectron) {
      console.warn('Not in Electron environment');
      return;
    }
    
    try {
      console.log('Calling openFolder...');
      const loadedFiles = await openFolder();
      console.log('openFolder returned:', loadedFiles);
      if (loadedFiles) {
        setFiles(loadedFiles);
        // Notify status bar of folder change
        if (currentFolder) {
          document.dispatchEvent(new CustomEvent('ide:folderChanged', { detail: currentFolder }));
        }
      }
    } catch (error: any) {
      console.error('Error in handleOpenFolder:', error);
      alert(`Failed to open folder: ${error.message}`);
    }
  };
  
  // Update status bar when currentFolder changes
  useEffect(() => {
    if (currentFolder) {
      document.dispatchEvent(new CustomEvent('ide:folderChanged', { detail: currentFolder }));
    }
  }, [currentFolder]);

  // Listen for open folder event from header
  useEffect(() => {
    const handleOpenFolderEvent = () => handleOpenFolder();
    document.addEventListener('ide:openFolder', handleOpenFolderEvent);
    return () => document.removeEventListener('ide:openFolder', handleOpenFolderEvent);
  }, []);

  // Listen for save events (Ctrl+S)
  useEffect(() => {
    const handleSaveFile = async () => {
      if (!isElectron || !currentFolder) return;
      
      const currentTab = tabs.find(t => t.id === activeTab);
      if (currentTab && currentTab.isDirty && currentTab.path) {
        try {
          await writeFile(currentTab.path, currentTab.content);
          markTabAsSaved(currentTab.id); // Mark as saved (not dirty)
          console.log('File saved:', currentTab.name);
        } catch (error: any) {
          alert(`Failed to save file: ${error.message}`);
        }
      }
    };

    const handleSaveAllFiles = async () => {
      if (!isElectron || !currentFolder) return;
      
      for (const tab of tabs) {
        if (tab.isDirty && tab.path) {
          try {
            await writeFile(tab.path, tab.content);
            markTabAsSaved(tab.id); // Mark as saved (not dirty)
          } catch (error: any) {
            console.error('Failed to save file:', tab.name, error);
          }
        }
      }
      console.log('All files saved');
    };

    document.addEventListener('ide:saveFile', handleSaveFile);
    document.addEventListener('ide:saveAllFiles', handleSaveAllFiles);
    
    return () => {
      document.removeEventListener('ide:saveFile', handleSaveFile);
      document.removeEventListener('ide:saveAllFiles', handleSaveAllFiles);
    };
  }, [isElectron, currentFolder, tabs, activeTab, writeFile, markTabAsSaved]);

  // Auto-save files when content changes (for Electron)
  useEffect(() => {
    if (!isElectron || !currentFolder) return;

    const saveInterval = setInterval(async () => {
      for (const tab of tabs) {
        if (tab.isDirty && tab.path) {
          try {
            await writeFile(tab.path, tab.content);
            // Mark as saved
            markTabAsSaved(tab.id);
          } catch (error) {
            console.error('Auto-save failed:', error);
          }
        }
      }
    }, 5000); // Auto-save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [isElectron, currentFolder, tabs, writeFile, markTabAsSaved]);

  return (
    <div className="h-full bg-transparent overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/20 scrollbar-track-transparent">
      <div className="p-4 border-b border-white/5 mx-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-tech select-none">
            EXPLORER
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Open Folder Button (Electron only) */}
            {isElectron && (
              <button
                onClick={handleOpenFolder}
                disabled={isLoading}
                className="p-1.5 text-gray-400 hover:text-walrus-cyan hover:bg-walrus-cyan/10 rounded-lg transition-all disabled:opacity-50"
                title="Open Folder"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-walrus-cyan border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FolderOpenIcon size={14} />
                )}
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-gray-400 hover:text-neon-green hover:bg-neon-green/10 rounded-lg transition-all"
              title="Upload File"
            >
              <Upload size={14} />
            </button>
            <button
              onClick={handleDownloadAll}
              className="p-1.5 text-gray-400 hover:text-neon-purple hover:bg-neon-purple/10 rounded-lg transition-all"
              title="Download Project"
            >
              <Download size={14} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="p-1.5 text-gray-400 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded-lg transition-all"
                title="New File/Folder"
              >
                <Plus size={14} />
              </button>

              {showNewMenu && (
                <div className="absolute right-0 top-8 bg-walrus-dark-800 border border-white/10 rounded-xl shadow-glass py-1 z-50 min-w-[140px] backdrop-blur-xl">
                  <button
                    onClick={() => {
                      handleCreateFile();
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
                  >
                    <FilePlus size={14} />
                    <span>New File</span>
                  </button>
                  <button
                    onClick={() => {
                      handleCreateFolder();
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
                  >
                    <FolderPlus size={14} />
                    <span>New Folder</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".move,.toml,.json,.md,.txt"
        />
      </div>

      <div className="py-2 px-2 group">
        {files.length === 0 ? (
          <div className="text-center py-8 px-4 opacity-60 hover:opacity-100 transition-opacity">
            <Folder size={40} className="text-gray-600 mx-auto mb-3" />
            <p className="text-xs text-gray-500 mb-4 font-tech">
              {isElectron ? 'No folder opened' : 'No files yet'}
            </p>
            {isElectron ? (
              <button
                onClick={handleOpenFolder}
                disabled={isLoading}
                className="px-4 py-2 bg-walrus-cyan/10 border border-walrus-cyan/30 rounded-lg text-walrus-cyan hover:bg-walrus-cyan/20 transition-all text-[10px] font-bold uppercase tracking-wider font-tech shadow-neon-sm disabled:opacity-50 flex items-center gap-2 mx-auto"
              >
                <FolderOpenIcon size={14} />
                {isLoading ? 'Opening...' : 'Open Folder'}
              </button>
            ) : (
              <button
                onClick={() => handleCreateFile()}
                className="px-4 py-2 bg-sui-cyan/5 border border-sui-cyan/20 rounded-lg text-sui-cyan hover:bg-sui-cyan/10 transition-all text-[10px] font-bold uppercase tracking-wider font-tech shadow-neon-sm"
              >
                Initialize Project
              </button>
            )}
          </div>
        ) : (
          files.map((node) => (
            <FileTreeItem
              key={node.id}
              node={node}
              level={0}
              onRename={handleRename}
              onDelete={handleDelete}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
