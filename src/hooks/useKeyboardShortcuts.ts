import { useEffect } from 'react';
import { useIDEStore } from '../store/ideStore';

export const useKeyboardShortcuts = () => {
  const { 
    toggleLeftPanel, 
    toggleBottomPanel, 
    tabs, 
    activeTab, 
    setActiveTab,
    removeTab 
  } = useIDEStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + B: Toggle sidebar
      if (modifier && e.key === 'b') {
        e.preventDefault();
        toggleLeftPanel();
      }

      // Ctrl/Cmd + J: Toggle terminal
      if (modifier && e.key === 'j') {
        e.preventDefault();
        toggleBottomPanel();
      }

      // Ctrl/Cmd + S: Save file
      if (modifier && e.key === 's') {
        e.preventDefault();
        // TODO: Implement save functionality
        console.log('Save file');
      }

      // Ctrl/Cmd + W: Close tab
      if (modifier && e.key === 'w') {
        e.preventDefault();
        if (activeTab) {
          removeTab(activeTab);
        }
      }

      // Ctrl/Cmd + Tab: Next tab
      if (modifier && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex !== -1 && tabs.length > 1) {
          const nextIndex = (currentIndex + 1) % tabs.length;
          setActiveTab(tabs[nextIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftPanel, toggleBottomPanel, tabs, activeTab, setActiveTab, removeTab]);
};
