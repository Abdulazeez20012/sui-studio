import React from 'react';
import { FileText, Search, GitBranch, Package, ChevronLeft } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { PanelType } from '../../types/ide';

const Sidebar: React.FC = () => {
  const { leftPanelType, setLeftPanelType, leftPanelOpen, toggleLeftPanel } = useIDEStore();

  const items: { type: PanelType; icon: React.ReactNode; label: string }[] = [
    { type: 'explorer', icon: <FileText size={20} />, label: 'Explorer' },
    { type: 'search', icon: <Search size={20} />, label: 'Search' },
    { type: 'git', icon: <GitBranch size={20} />, label: 'Projects & Cloud Sync' },
    { type: 'extensions', icon: <Package size={20} />, label: 'Guided Tutorials' },
  ];

  return (
    <div className="w-12 bg-dark-surface border-r border-dark-border flex flex-col items-center py-4 gap-2">
      {items.map((item) => (
        <button
          key={item.type}
          onClick={() => {
            if (leftPanelType === item.type && leftPanelOpen) {
              toggleLeftPanel();
            } else {
              setLeftPanelType(item.type);
              if (!leftPanelOpen) toggleLeftPanel();
            }
          }}
          className={`p-2 rounded hover:bg-white/5 transition-colors ${
            leftPanelType === item.type && leftPanelOpen
              ? 'text-sui-cyan bg-sui-cyan/10'
              : 'text-slate-400'
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
