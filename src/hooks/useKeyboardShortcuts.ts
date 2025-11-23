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

      // Ctrl/Cmd + Shift + B: Build
      if (modifier && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        // Trigger build button click
        document.querySelector('[title="Build project (Ctrl+B)"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }

      // Ctrl/Cmd + Shift + T: Test
      if (modifier && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        // Trigger test button click
        document.querySelector('[title="Run tests (Ctrl+T)"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }

      // Ctrl/Cmd + Shift + D: Deploy
      if (modifier && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        // Trigger deploy button click
        document.querySelector('[title="Deploy to network (Ctrl+D)"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftPanel, toggleBottomPanel, tabs, activeTab, setActiveTab, removeTab]);
};
