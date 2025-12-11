import React, { useState } from 'react';
import { FileCode, FolderPlus, FilePlus, Trash2, Edit2, Copy, Package } from 'lucide-react';
import { projectInitService } from '../../services/projectInitService';
import { useIDEStore } from '../../store/ideStore';
import { FileNode } from '../../types/ide';

interface FolderContextMenuProps {
  folder: FileNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  position,
  onClose,
}) => {
  const { openFile, files, setFiles } = useIDEStore();
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [moduleName, setModuleName] = useState('');

  const handleCreateMoveModule = () => {
    setShowModuleDialog(true);
  };

  const handleModuleCreate = () => {
    if (!moduleName.trim()) return;

    const packageName = folder.name; // Use folder name as package name
    const { moduleFile, testFile } = projectInitService.createMoveModule({
      moduleName: moduleName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      packageName,
      includeTests: true,
    });

    // Add module file to sources folder
    addFile(moduleFile);

    // Add test file to tests folder if it exists
    if (testFile) {
      addFile(testFile);
    }

    setShowModuleDialog(false);
    setModuleName('');
    onClose();
  };

  const menuItems = [
    {
      icon: <Package size={16} />,
      label: 'New Move Module',
      action: handleCreateMoveModule,
      color: 'text-sui-cyan',
    },
    {
      icon: <FilePlus size={16} />,
      label: 'New File',
      action: () => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
          addFile({
            id: `file-${Date.now()}`,
            name: fileName,
            type: 'file',
            path: `${folder.path}/${fileName}`,
            content: '',
          });
        }
        onClose();
      },
    },
    {
      icon: <FolderPlus size={16} />,
      label: 'New Folder',
      action: () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
          addFolder({
            id: `folder-${Date.now()}`,
            name: folderName,
            type: 'folder',
            path: `${folder.path}/${folderName}`,
            children: [],
          });
        }
        onClose();
      },
    },
    {
      icon: <Edit2 size={16} />,
      label: 'Rename',
      action: () => {
        const newName = prompt('Enter new name:', folder.name);
        if (newName) {
          // Implement rename logic
        }
        onClose();
      },
    },
    {
      icon: <Copy size={16} />,
      label: 'Duplicate',
      action: () => {
        // Implement duplicate logic
        onClose();
      },
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      action: () => {
        if (confirm(`Delete ${folder.name}?`)) {
          // Implement delete logic
        }
        onClose();
      },
      color: 'text-red-500',
    },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-dark-surface border border-sui-cyan/30 rounded-lg shadow-2xl py-2 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-sui-cyan/10 transition-colors text-left ${
              item.color || 'text-slate-300'
            }`}
          >
            {item.icon}
            <span className="font-tech text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Module Creation Dialog */}
      {showModuleDialog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-surface border border-sui-cyan/30 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-black text-white mb-4 font-tech">
              Create Move Module
            </h3>
            <p className="text-sm text-slate-400 mb-4 font-tech">
              This will create a new Move module with a test file
            </p>
            <input
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Module name (e.g., my_module)"
              className="w-full px-4 py-2 bg-dark-panel border border-sui-cyan/30 rounded-lg text-white font-tech mb-4 focus:outline-none focus:border-sui-cyan"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleModuleCreate();
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handleModuleCreate}
                disabled={!moduleName.trim()}
                className="flex-1 px-4 py-2 bg-sui-cyan text-black rounded-lg font-tech font-bold hover:shadow-neon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Module
              </button>
              <button
                onClick={() => {
                  setShowModuleDialog(false);
                  setModuleName('');
                  onClose();
                }}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-400 rounded-lg font-tech font-bold hover:border-slate-400 hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
