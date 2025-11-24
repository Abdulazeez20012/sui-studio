import React from 'react';
import { useIDEStore } from '../../store/ideStore';
import NexiAI from './NexiAI';
import DeploymentPanel from './DeploymentPanel';
import GasAnalyzer from './GasAnalyzer';
import CollaborationPanel from './CollaborationPanel';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';
import ExtensionsMarketplace from './ExtensionsMarketplace';

const RightPanel: React.FC = () => {
  const { rightPanelType } = useIDEStore();

  const renderPanel = () => {
    switch (rightPanelType) {
      case 'nexi':
        return <NexiAI />;
      case 'deployment':
        return <DeploymentPanel />;
      case 'gas':
        return <GasAnalyzer />;
      case 'collaboration':
        return <CollaborationPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'stats':
        return <StatsPanel />;
      case 'extensions':
        return <ExtensionsMarketplace />;
      case 'docs':
        return (
          <div className="h-full bg-dark-surface p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Documentation</h3>
            <p className="text-sm text-slate-400">Documentation panel coming soon...</p>
          </div>
        );
      default:
        return <NexiAI />;
    }
  };

  return <>{renderPanel()}</>;
};

export default RightPanel;
