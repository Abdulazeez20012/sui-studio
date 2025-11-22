import React from 'react';
import { useIDEStore } from '../../store/ideStore';
import DeploymentPanel from './DeploymentPanel';
import GasAnalyzer from './GasAnalyzer';

const RightPanel: React.FC = () => {
  const { rightPanelType } = useIDEStore();

  const renderPanel = () => {
    switch (rightPanelType) {
      case 'deployment':
        return <DeploymentPanel />;
      case 'gas':
        return <GasAnalyzer />;
      case 'docs':
        return (
          <div className="h-full bg-dark-surface p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Documentation</h3>
            <p className="text-sm text-slate-400">Documentation panel coming soon...</p>
          </div>
        );
      default:
        return <DeploymentPanel />;
    }
  };

  return <>{renderPanel()}</>;
};

export default RightPanel;
