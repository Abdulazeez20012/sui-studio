import React, { useState } from 'react';
import { Settings, User, Code, Terminal as TerminalIcon, Palette, Save, X } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

const SettingsPanel: React.FC = () => {
  const {
    fontSize,
    tabSize,
    wordWrap,
    minimap,
    lineNumbers,
    terminalFontSize,
    autoSave,
    theme,
    setFontSize,
    setTabSize,
    setWordWrap,
    setMinimap,
    setLineNumbers,
    setTerminalFontSize,
    setAutoSave,
    setTheme,
    resetToDefaults,
  } = useSettingsStore();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Settings are automatically persisted by zustand
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved and applied!');
    }, 500);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default?')) {
      resetToDefaults();
      alert('Settings reset to defaults!');
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
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-sui-cyan"
              />
            </div>

            {/* Tab Size */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Tab Size: {tabSize} spaces
              </label>
              <input
                type="range"
                min="2"
                max="8"
                step="2"
                value={tabSize}
                onChange={(e) => setTabSize(parseInt(e.target.value))}
                className="w-full accent-sui-cyan"
              />
            </div>

            {/* Word Wrap */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Word Wrap</span>
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Minimap */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Show Minimap</span>
              <input
                type="checkbox"
                checked={minimap}
                onChange={(e) => setMinimap(e.target.checked)}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Line Numbers */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Line Numbers</span>
              <input
                type="checkbox"
                checked={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.checked)}
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
                Font Size: {terminalFontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="20"
                value={terminalFontSize}
                onChange={(e) => setTerminalFontSize(parseInt(e.target.value))}
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
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="w-4 h-4 accent-sui-cyan"
              />
            </label>

            {/* Theme */}
            <div>
              <label className="block text-xs text-slate-400 mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-sm text-white focus:outline-none focus:border-sui-cyan"
              >
                <option value="dark">Dark</option>
                <option value="light">Light (Coming Soon)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Extensions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-sui-cyan" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
            </svg>
            <h4 className="text-sm font-medium text-white">Extensions</h4>
          </div>

          <div className="pl-6">
            <div className="p-4 bg-dark-panel border border-neon-purple/30 rounded-lg hover:border-neon-purple hover:shadow-purple-glow transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-neon-purple/20 rounded-lg flex items-center justify-center border border-neon-purple/50 flex-shrink-0">
                  <svg className="w-6 h-6 text-neon-purple" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h5 className="text-sm font-bold text-white mb-1">Core Analyzer</h5>
                  <p className="text-xs text-slate-400 mb-3">
                    Advanced Sui Move analysis and debugging tools for VS Code
                  </p>
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=your-team-name.core-analyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-neon-purple hover:bg-neon-purple/90 text-white rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Extension</span>
                  </a>
                </div>
              </div>
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
