import React, { useState } from 'react';
import { Settings, User, Code, Terminal as TerminalIcon, Palette, Save, X } from 'lucide-react';

interface SettingsState {
  fontSize: number;
  tabSize: number;
  theme: 'dark' | 'light';
  autoSave: boolean;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  terminalFontSize: number;
}

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    fontSize: 14,
    tabSize: 2,
    theme: 'dark',
    autoSave: true,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
    terminalFontSize: 14,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem('sui-studio-settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default?')) {
      const defaultSettings: SettingsState = {
        fontSize: 14,
        tabSize: 2,
        theme: 'dark',
        autoSave: true,
        wordWrap: true,
        minimap: true,
        lineNumbers: true,
        terminalFontSize: 14,
      };
      setSettings(defaultSettings);
      localStorage.setItem('sui-studio-settings', JSON.stringify(defaultSettings));
    }
  };

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={18} className="text-sui-cyan" />
          <h3 className="text-sm font-semibold text-white">Settings</h3>
        </div>
        <p className="text-xs text-slate-400">
          Customize your IDE experience
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {/* Editor Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code size={16} className="text-sui-cyan" />
            <h4 className="text-sm font-medium text-white">Editor</h4>
          </div>

          <div className="space-y-3 pl-6">
            {/* Font Size */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Font Size: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={settings.fontSize}
                onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                className="w-full accent-sui-cyan"
              />
            </div>

            {/* Tab Size */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Tab Size: {settings.tabSize} spaces
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="2"
                value={settings.tabSize}
                onChange={(e) => setSettings({ ...settings, tabSize: parseInt(e.target.value) })}
                className="w-full accent-sui-cyan"
              />
            </div>

            {/* Word Wrap */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Word Wrap</span>
              <input
                type="checkbox"
                checked={settings.wordWrap}
                onChange={(e) => setSettings({ ...settings, wordWrap: e.target.checked })}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Minimap */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Show Minimap</span>
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) => setSettings({ ...settings, minimap: e.target.checked })}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Line Numbers */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Line Numbers</span>
              <input
                type="checkbox"
                checked={settings.lineNumbers}
                onChange={(e) => setSettings({ ...settings, lineNumbers: e.target.checked })}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>
          </div>
        </div>

        {/* Terminal Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon size={16} className="text-sui-cyan" />
            <h4 className="text-sm font-medium text-white">Terminal</h4>
          </div>

          <div className="space-y-3 pl-6">
            {/* Terminal Font Size */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Font Size: {settings.terminalFontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={settings.terminalFontSize}
                onChange={(e) => setSettings({ ...settings, terminalFontSize: parseInt(e.target.value) })}
                className="w-full accent-sui-cyan"
              />
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} className="text-sui-cyan" />
            <h4 className="text-sm font-medium text-white">General</h4>
          </div>

          <div className="space-y-3 pl-6">
            {/* Auto Save */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Auto Save</span>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Theme */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'dark' | 'light' })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white focus:outline-none focus:border-sui-cyan"
              >
                <option value="dark">Dark</option>
                <option value="light">Light (Coming Soon)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-dark-border space-y-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] disabled:opacity-50 transition-colors font-medium"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white hover:bg-white/5 transition-colors text-sm"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
