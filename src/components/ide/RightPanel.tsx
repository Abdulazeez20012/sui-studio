import React from 'react';
import { useIDEStore } from '../../store/ideStore';
import NexiAI from './NexiAI';
import DeploymentPanel from './DeploymentPanel';
import GasAnalyzer from './GasAnalyzer';
import CollaborationPanel from './CollaborationPanel';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';
import ExtensionsMarketplace from './ExtensionsMarketplace';
import { WalletPanel } from './WalletPanel';
import { ContractInteractionPanel } from './ContractInteractionPanel';
import { PackageManager } from './PackageManager';
import { SyntaxChecker } from './SyntaxChecker';
import { SystemDesigner } from './SystemDesigner';
import { Profiler } from './Profiler';
import MarketplacePanel from './MarketplacePanel';

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
      case 'wallet':
        return <WalletPanel />;
      case 'contract':
        return <ContractInteractionPanel />;
      case 'packages':
        return <PackageManager />;
      case 'debugger':
        return <SyntaxChecker />;
      case 'designer':
        return <SystemDesigner />;
      case 'profiler':
        return <Profiler />;
      case 'marketplace':
        return <MarketplacePanel />;
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
