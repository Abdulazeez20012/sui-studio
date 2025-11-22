import React from 'react';
import { useIDEStore } from '../../store/ideStore';
import FileExplorer from './FileExplorer';
import SearchPanel from './SearchPanel';
import ProjectManager from './ProjectManager';
import TutorialPanel from './TutorialPanel';

const LeftPanel: React.FC = () => {
  const { leftPanelType } = useIDEStore();

  const renderPanel = () => {
    switch (leftPanelType) {
      case 'explorer':
        return <FileExplorer />;
      case 'search':
        return <SearchPanel />;
      case 'git':
        return <ProjectManager />;
      case 'extensions':
        return <TutorialPanel />;
      default:
        return <FileExplorer />;
    }
  };

  return <>{renderPanel()}</>;
};

export default LeftPanel;
