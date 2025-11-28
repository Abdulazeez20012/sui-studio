import React from 'react';
import { FileText, Search, GitBranch, Package, Settings, Layers } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { PanelType } from '../../types/ide';

const Sidebar: React.FC = () => {
  const { leftPanelType, setLeftPanelType, leftPanelOpen, toggleLeftPanel } = useIDEStore();

  const items: { type: PanelType; icon: React.ReactNode; label: string }[] = [
    { type: 'explorer', icon: <FileText size={22} />, label: 'Explorer' },
    { type: 'search', icon: <Search size={22} />, label: 'Search' },
    { type: 'git', icon: <GitBranch size={22} />, label: 'Source Control' },
    { type: 'extensions', icon: <Package size={22} />, label: 'Extensions' },
  ];

  return (
    <div className="w-16 bg-walrus-dark-900 border-r border-walrus-dark-600 flex flex-col items-center py-6 gap-4 relative z-20">
      {items.map((item) => (
        <div key={item.type} className="relative group">
          <button
            onClick={() => {
              if (leftPanelType === item.type && leftPanelOpen) {
                toggleLeftPanel();
              } else {
                setLeftPanelType(item.type);
                if (!leftPanelOpen) toggleLeftPanel();
              }
            }}
            className={`p-3 rounded-xl transition-all duration-300 relative ${leftPanelType === item.type && leftPanelOpen
                ? 'text-walrus-cyan bg-walrus-cyan/10 shadow-neon'
                : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}
          >
            {item.icon}

            {/* Active Indicator */}
            {leftPanelType === item.type && leftPanelOpen && (
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-walrus-cyan rounded-r-full shadow-neon"></div>
            )}
          </button>

          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-walrus-dark-800 text-white text-xs font-medium rounded-md border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0">
            {item.label}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-walrus-dark-800"></div>
          </div>
        </div>
      ))}

      <div className="flex-1"></div>

      {/* Bottom Actions */}
      <button className="p-3 text-gray-500 hover:text-white transition-colors rounded-xl hover:bg-white/5 mb-2">
        <Settings size={22} />
      </button>
    </div>
  );
};

export default Sidebar;
