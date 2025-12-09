import React from 'react';
import { 
  Play, 
  Bug, 
  Package, 
  Zap, 
  Activity,
  Network,
  Wallet,
  Settings,
  FileCode
} from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';

const Toolbar: React.FC = () => {
  const { setRightPanelType, toggleRightPanel, rightPanelOpen } = useIDEStore();

  const tools = [
    { id: 'debugger', icon: Bug, label: 'Debugger', color: 'text-red-400' },
    { id: 'packages', icon: Package, label: 'Packages', color: 'text-blue-400' },
    { id: 'designer', icon: Network, label: 'Designer', color: 'text-purple-400' },
    { id: 'profiler', icon: Activity, label: 'Profiler', color: 'text-green-400' },
    { id: 'gas', icon: Zap, label: 'Gas Analyzer', color: 'text-yellow-400' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', color: 'text-cyan-400' },
  ];

  const handleToolClick = (toolId: string) => {
    setRightPanelType(toolId as any);
    if (!rightPanelOpen) {
      toggleRightPanel();
    }
  };

  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-2">
      <div className="flex items-center gap-2">
        <FileCode className="w-5 h-5 text-sui-blue" />
        <span className="text-sm font-semibold text-white">Sui Studio</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-1">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`p-2 rounded hover:bg-gray-800 transition-colors ${tool.color}`}
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
