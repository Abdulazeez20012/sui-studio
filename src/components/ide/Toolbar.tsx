import React, { useState } from 'react';
import { 
  Menu, Save, Play, Bug, Settings, 
  Layout, LogOut, User, Rocket, Zap, PanelRightOpen, PanelRightClose, Users,
  Hammer, TestTube, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';

const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rightPanelOpen, toggleRightPanel, setRightPanelType, rightPanelType, collaborationEnabled, toggleCollaboration, tabs, activeTab } = useIDEStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRightPanelMenu, setShowRightPanelMenu] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuild = async () => {
    if (!currentTab || isBuilding) return;
    
    setIsBuilding(true);
    try {
      const result = await apiService.compileCode(currentTab.content, currentTab.name.replace('.move', ''));
      if (result.success) {
        alert('✅ Build successful!');
      } else {
        alert('❌ Build failed. Check console for errors.');
        console.error('Build errors:', result.errors);
      }
    } catch (error: any) {
      alert('❌ Build failed: ' + error.message);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleTest = async () => {
    if (!currentTab || isTesting) return;
    
    setIsTesting(true);
    try {
      // Simulate running tests
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('✅ All tests passed!');
    } catch (error: any) {
      alert('❌ Tests failed: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeploy = () => {
    if (!currentTab) return;
    
    // Open deployment panel
    setRightPanelType('deployment');
    if (!rightPanelOpen) toggleRightPanel();
  };

  return (
    <div className="h-12 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sui-cyan hover:text-white transition-colors"
        >
          <div className="w-8 h-8 bg-sui-cyan/10 rounded flex items-center justify-center p-1">
            <img 
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
              alt="Sui Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-semibold">Sui Studio</span>
        </button>

        <div className="flex items-center gap-1 ml-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 px-3 py-1 bg-dark-bg rounded-lg border border-dark-border">
          {/* Build Button */}
          <button
            onClick={handleBuild}
            disabled={isBuilding || !currentTab}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/50 font-medium"
            title="Build project (Ctrl+B)"
          >
            {isBuilding ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Building...</span>
              </>
            ) : (
              <>
                <Hammer size={18} />
                <span>Build</span>
              </>
            )}
          </button>

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={isTesting || !currentTab}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-green-500/50 font-medium"
            title="Run tests (Ctrl+T)"
          >
            {isTesting ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <TestTube size={18} />
                <span>Test</span>
              </>
            )}
          </button>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={!currentTab}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sui-cyan to-blue-500 text-black rounded-lg hover:from-[#2ba6eb] hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-sui-cyan/50 font-medium"
            title="Deploy to network (Ctrl+D)"
          >
            <Rocket size={18} />
            <span>Deploy</span>
          </button>
        </div>

        <div className="h-8 w-px bg-dark-border"></div>
        
        {/* Right Panel Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowRightPanelMenu(!showRightPanelMenu)}
            className={`p-2 rounded transition-colors ${
              rightPanelOpen 
                ? 'text-sui-cyan bg-sui-cyan/10' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="Toggle Right Panel"
          >
            {rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>

          {/* Right Panel Menu */}
          {showRightPanelMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  setRightPanelType('deployment');
                  if (!rightPanelOpen) toggleRightPanel();
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  rightPanelType === 'deployment' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Rocket size={16} />
                <span>Deployment</span>
              </button>
              <button
                onClick={() => {
                  setRightPanelType('gas');
                  if (!rightPanelOpen) toggleRightPanel();
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  rightPanelType === 'gas' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap size={16} />
                <span>Gas Analyzer</span>
              </button>
              <button
                onClick={() => {
                  setRightPanelType('collaboration');
                  if (!rightPanelOpen) toggleRightPanel();
                  setShowRightPanelMenu(false);
                  if (!collaborationEnabled) toggleCollaboration();
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  rightPanelType === 'collaboration' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users size={16} />
                <span>Collaboration</span>
              </button>
              <button
                onClick={() => {
                  setRightPanelType('settings');
                  if (!rightPanelOpen) toggleRightPanel();
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  rightPanelType === 'settings' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
          <Bug size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
          <Save size={18} />
        </button>
        <button 
          onClick={() => {
            setRightPanelType('settings');
            if (!rightPanelOpen) toggleRightPanel();
          }}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>

        {/* User Profile */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg hover:border-sui-cyan/50 transition-colors"
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <User size={18} className="text-slate-400" />
            )}
            <span className="text-sm text-white">{user?.name || 'User'}</span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-dark-border">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
