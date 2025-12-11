import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  // Editor settings
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  
  // Terminal settings
  terminalFontSize: number;
  
  // General settings
  autoSave: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (enabled: boolean) => void;
  setMinimap: (enabled: boolean) => void;
  setLineNumbers: (enabled: boolean) => void;
  setTerminalFontSize: (size: number) => void;
  setAutoSave: (enabled: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  resetToDefaults: () => void;
}

const defaultSettings = {
  fontSize: 14,
  tabSize: 4,
  wordWrap: true,
  minimap: true,
  lineNumbers: true,
  terminalFontSize: 14,
  autoSave: true,
  theme: 'dark' as const,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      
      setFontSize: (size) => set({ fontSize: size }),
      setTabSize: (size) => set({ tabSize: size }),
      setWordWrap: (enabled) => set({ wordWrap: enabled }),
      setMinimap: (enabled) => set({ minimap: enabled }),
      setLineNumbers: (enabled) => set({ lineNumbers: enabled }),
      setTerminalFontSize: (size) => set({ terminalFontSize: size }),
      setAutoSave: (enabled) => set({ autoSave: enabled }),
      setTheme: (theme) => set({ theme }),
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'sui-studio-settings',
    }
  )
);
