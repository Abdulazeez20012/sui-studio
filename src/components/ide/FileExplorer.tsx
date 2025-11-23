import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { FileNode } from '../../types/ide';
import { useIDEStore } from '../../store/ideStore';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addTab, setActiveTab, tabs } = useIDEStore();

  const handleClick = () => {
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
          language: node.language || 'plaintext',
          isDirty: false
        };
        addTab(newTab);
      }
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-sui-cyan/5 cursor-pointer group rounded-sm transition-all duration-200 border-l-2 border-transparent hover:border-sui-cyan/50"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
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
        <span className="text-sm text-slate-400 group-hover:text-white font-medium transition-colors">
          {node.name}
        </span>
      </div>
      {node.type === 'folder' && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC = () => {
  const { files } = useIDEStore();

  return (
    <div className="h-full bg-dark-surface overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent">
      <div className="p-4 border-b border-sui-cyan/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-sui-cyan uppercase tracking-widest font-tech">
            FILES
          </h3>
          <button className="text-slate-500 hover:text-sui-cyan text-xs font-semibold hover:shadow-neon transition-all">
            + ADD
          </button>
        </div>
      </div>
      <div className="py-2 px-1">
        {files.map((node) => (
          <FileTreeItem key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
