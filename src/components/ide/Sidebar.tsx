import React from 'react';
import { FileText, Search, GitBranch, Package, Settings, Home } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { PanelType } from '../../types/ide';

const Sidebar: React.FC = () => {
  const { leftPanelType, setLeftPanelType, leftPanelOpen, toggleLeftPanel } = useIDEStore();

  const items: { type: PanelType | 'home'; icon: React.ReactNode; label: string }[] = [
    { type: 'home', icon: <Home size={20} />, label: 'Home' },
    { type: 'explorer', icon: <FileText size={20} />, label: 'Explorer' },
    { type: 'search', icon: <Search size={20} />, label: 'Search' },
    { type: 'git', icon: <GitBranch size={20} />, label: 'Source Control' },
    { type: 'extensions', icon: <Package size={20} />, label: 'Extensions' },
  ];

  return (
    <div className="w-14 flex flex-col items-center py-4 gap-3 z-20 h-[calc(100vh-60px)]">
      {/* Floating Pill Container */}
      <div className="flex-1 flex flex-col items-center bg-walrus-dark-900/80 backdrop-blur-md border border-white/5 rounded-2xl py-4 gap-4 shadow-premium w-full">
        {items.map((item) => (
          <div key={item.type} className="relative group w-full flex justify-center px-2">
            <button
              onClick={() => {
                if (item.type === 'home') {
                  if (leftPanelOpen) toggleLeftPanel();
                  settingsLeftPanelType(null);
                  return;
                }

                if (leftPanelType === item.type && leftPanelOpen) {
                  toggleLeftPanel();
                } else {
                  setLeftPanelType(item.type as PanelType);
                  if (!leftPanelOpen) toggleLeftPanel();
                }
              }}
              className={`p-2.5 rounded-xl transition-all duration-300 relative group-hover:shadow-neon-sm ${item.type !== 'home' && leftPanelType === item.type && leftPanelOpen
                ? 'text-walrus-cyan bg-walrus-cyan/10 shadow-neon'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {item.icon}

              {/* Active Dot */}
              {item.type !== 'home' && leftPanelType === item.type && leftPanelOpen && (
                <div className="absolute right-1 top-2 w-1 h-1 bg-walrus-cyan rounded-full shadow-neon"></div>
              )}
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-walrus-dark-800 text-white text-xs font-medium rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl translate-x-2 group-hover:translate-x-0 backdrop-blur-xl">
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-walrus-dark-800"></div>
            </div>
          </div>
        ))}

        <div className="flex-1"></div>

        {/* Bottom Actions */}
        <div className="w-full flex flex-col items-center gap-2 pb-2">
          <button className="p-2.5 text-gray-500 hover:text-white transition-all rounded-xl hover:bg-white/5 hover:shadow-neon-sm">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
