import React, { useState, useRef } from 'react';
import { 
  ChevronRight, ChevronDown, File, Folder, FolderOpen, 
  Plus, Trash2, Edit2, Download, Upload, MoreVertical,
  FilePlus, FolderPlus, X, Check
} from 'lucide-react';
import { FileNode } from '../../types/ide';
import { useIDEStore } from '../../store/ideStore';

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (isRenaming) return;
    
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      const existingTab = tabs.find(t => t.path === node.path);
      if (existingTab) {
        setActiveTab(existingTab.id);
      } else {
        const newTab = {
          id: `tab-${Date.now()}`,
          name: node.name,
          path: node.path,
          content: node.content || '',
          language: node.language || 'move',
          isDirty: false
        };
        addTab(newTab);
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
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-sui-cyan/5 cursor-pointer group rounded-sm transition-all duration-200 border-l-2 border-transparent hover:border-sui-cyan/50 relative"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2 flex-1" onClick={handleClick}>
          {node.type === 'folder' && (
            <span className="text-slate-600 group-hover:text-sui-cyan transition-colors">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
          <span className={node.type === 'folder' ? 'text-neon-purple' : 'text-slate-500 group-hover:text-sui-cyan'}>
            {node.type === 'folder' ? (
              isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
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
                className="flex-1 px-1 py-0.5 bg-dark-panel border border-sui-cyan/50 rounded text-xs text-white focus:outline-none focus:border-sui-cyan"
              />
              <button
                onClick={handleRename}
                className="p-0.5 text-neon-green hover:bg-neon-green/10 rounded"
              >
                <Check size={12} />
              </button>
              <button
                onClick={() => {
                  setNewName(node.name);
                  setIsRenaming(false);
                }}
                className="p-0.5 text-neon-pink hover:bg-neon-pink/10 rounded"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <span className="text-sm text-slate-400 group-hover:text-white font-medium transition-colors">
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
              className="p-1 text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded transition-all"
            >
              <MoreVertical size={14} />
            </button>
          </div>
        )}

        {/* Context Menu */}
        {showMenu && (
          <div className="absolute right-2 top-8 bg-dark-surface border border-sui-cyan/30 rounded-lg shadow-neon-lg py-1 z-50 min-w-[160px]">
            {node.type === 'folder' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateFile(node);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
                >
                  <FolderPlus size={14} />
                  <span>New Folder</span>
                </button>
                <div className="h-px bg-sui-cyan/10 my-1" />
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                startRename();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-neon-purple hover:bg-neon-purple/5 transition-all"
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
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-neon-pink hover:bg-neon-pink/5 transition-all"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
      
      {node.type === 'folder' && isOpen && node.children && (
        <div>
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
  const { files, setFiles, addTab } = useIDEStore();
  const [showNewMenu, setShowNewMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreateFile = (parentNode?: FileNode) => {
    const newFile: FileNode = {
      id: generateId(),
      name: 'untitled.move',
      type: 'file',
      path: parentNode ? `${parentNode.path}/untitled.move` : '/untitled.move',
      content: '// New Move file\n',
      language: 'move'
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

    // Open the new file in editor
    setTimeout(() => {
      addTab({
        id: `tab-${Date.now()}`,
        name: newFile.name,
        path: newFile.path,
        content: newFile.content || '',
        language: 'move',
        isDirty: false
      });
    }, 100);
  };

  const handleCreateFolder = (parentNode?: FileNode) => {
    const newFolder: FileNode = {
      id: generateId(),
      name: 'new-folder',
      type: 'folder',
      path: parentNode ? `${parentNode.path}/new-folder` : '/new-folder',
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
  };

  const handleRename = (node: FileNode, newName: string) => {
    const updatedFiles = updateNodeInTree(files, node.id, (n) => ({
      ...n,
      name: newName,
      path: n.path.replace(n.name, newName)
    }));
    setFiles(updatedFiles);
  };

  const handleDelete = (node: FileNode) => {
    if (confirm(`Are you sure you want to delete "${node.name}"?`)) {
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

  return (
    <div className="h-full bg-dark-surface overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent">
      <div className="p-4 border-b border-sui-cyan/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-sui-cyan uppercase tracking-widest font-tech">
            FILES
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-slate-500 hover:text-neon-green hover:bg-neon-green/10 rounded transition-all"
              title="Upload File"
            >
              <Upload size={14} />
            </button>
            <button
              onClick={handleDownloadAll}
              className="p-1.5 text-slate-500 hover:text-neon-purple hover:bg-neon-purple/10 rounded transition-all"
              title="Download Project"
            >
              <Download size={14} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="p-1.5 text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded transition-all"
                title="New File/Folder"
              >
                <Plus size={14} />
              </button>
              
              {showNewMenu && (
                <div className="absolute right-0 top-8 bg-dark-surface border border-sui-cyan/30 rounded-lg shadow-neon-lg py-1 z-50 min-w-[140px]">
                  <button
                    onClick={() => {
                      handleCreateFile();
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
                  >
                    <FilePlus size={14} />
                    <span>New File</span>
                  </button>
                  <button
                    onClick={() => {
                      handleCreateFolder();
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5 transition-all"
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
      
      <div className="py-2 px-1">
        {files.length === 0 ? (
          <div className="text-center py-8 px-4">
            <Folder size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 mb-4 font-tech">No files yet</p>
            <button
              onClick={() => handleCreateFile()}
              className="px-4 py-2 bg-sui-cyan/10 border border-sui-cyan/30 rounded-lg text-sui-cyan hover:bg-sui-cyan/20 transition-all text-xs font-bold uppercase tracking-wider font-tech"
            >
              Create First File
            </button>
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
