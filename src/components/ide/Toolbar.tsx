import React, { useState } from 'react';
import { 
  Menu, Save, Play, Bug, Settings, 
  Layout, LogOut, User, Rocket, Zap, PanelRightOpen, PanelRightClose, Users,
  Hammer, TestTube, Loader, TrendingUp, CheckCircle, XCircle, PanelBottom, PanelBottomClose, Package, Bot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';

const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { 
    rightPanelOpen, 
    toggleRightPanel, 
    setRightPanelType, 
    rightPanelType, 
    collaborationEnabled, 
    toggleCollaboration, 
    tabs, 
    activeTab, 
    bottomPanelOpen, 
    toggleBottomPanel,
    activeTerminal,
    addTerminalOutput
  } = useIDEStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRightPanelMenu, setShowRightPanelMenu] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuild = async () => {
    if (!currentTab || isBuilding) return;
    
    setIsBuilding(true);
    setBuildStatus('idle');
    try {
      const result = await apiService.compileCode(currentTab.content, currentTab.name.replace('.move', ''));
      if (result.success) {
        setBuildStatus('success');
        console.log('Build successful!');
        setTimeout(() => setBuildStatus('idle'), 3000);
      } else {
        setBuildStatus('error');
        console.error('Build failed. Check console for errors.');
        console.error('Build errors:', result.errors);
        setTimeout(() => setBuildStatus('idle'), 3000);
      }
    } catch (error: any) {
      setBuildStatus('error');
      console.error('Build failed:', error.message);
      setTimeout(() => setBuildStatus('idle'), 3000);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleTest = async () => {
    if (!currentTab || isTesting) return;
    
    setIsTesting(true);
    setTestStatus('idle');
    try {
      // Simulate running tests
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestStatus('success');
      console.log('All tests passed!');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (error: any) {
      setTestStatus('error');
      console.error('Tests failed:', error.message);
      setTimeout(() => setTestStatus('idle'), 3000);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeploy = () => {
    if (!currentTab) return;
    
    // Toggle deployment panel
    if (rightPanelType === 'deployment' && rightPanelOpen) {
      toggleRightPanel();
    } else {
      setRightPanelType('deployment');
      if (!rightPanelOpen) toggleRightPanel();
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sui-cyan hover:text-white transition-all group"
        >
          <div className="w-8 h-8 bg-sui-cyan/10 rounded-lg flex items-center justify-center p-1 border border-sui-cyan/30 group-hover:border-sui-cyan group-hover:shadow-neon transition-all">
            <img 
              src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
              alt="Sui Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-black text-lg text-white tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>SUI STUDIO</span>
        </button>

        <div className="flex items-center gap-1 ml-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 px-2 py-1 bg-dark-panel rounded-lg border border-sui-cyan/20">
          {/* Build Button */}
          <button
            onClick={handleBuild}
            disabled={isBuilding || !currentTab}
            className={`flex items-center gap-2 px-4 py-2 bg-dark-bg border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech ${
              buildStatus === 'success' 
                ? 'border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,148,0.3)]'
                : buildStatus === 'error'
                ? 'border-neon-pink text-neon-pink shadow-[0_0_20px_rgba(255,20,147,0.3)]'
                : 'border-blue-500/30 hover:border-blue-500 text-blue-400 hover:text-white hover:shadow-neon'
            }`}
            title="Build project (Ctrl+B)"
          >
            {isBuilding ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Building...</span>
              </>
            ) : buildStatus === 'success' ? (
              <>
                <CheckCircle size={16} />
                <span>Built</span>
              </>
            ) : buildStatus === 'error' ? (
              <>
                <XCircle size={16} />
                <span>Failed</span>
              </>
            ) : (
              <>
                <Hammer size={16} />
                <span>Build</span>
              </>
            )}
          </button>

          {/* Test Button */}
          <button
            onClick={handleTest}
            disabled={isTesting || !currentTab}
            className={`flex items-center gap-2 px-4 py-2 bg-dark-bg border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech ${
              testStatus === 'success'
                ? 'border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,148,0.3)]'
                : testStatus === 'error'
                ? 'border-neon-pink text-neon-pink shadow-[0_0_20px_rgba(255,20,147,0.3)]'
                : 'border-neon-green/30 hover:border-neon-green text-neon-green hover:text-white hover:shadow-[0_0_20px_rgba(0,255,148,0.3)]'
            }`}
            title="Run tests (Ctrl+T)"
          >
            {isTesting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Testing...</span>
              </>
            ) : testStatus === 'success' ? (
              <>
                <CheckCircle size={16} />
                <span>Passed</span>
              </>
            ) : testStatus === 'error' ? (
              <>
                <XCircle size={16} />
                <span>Failed</span>
              </>
            ) : (
              <>
                <TestTube size={16} />
                <span>Test</span>
              </>
            )}
          </button>

          {/* Deploy Button */}
          <button
            onClick={handleDeploy}
            disabled={!currentTab}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech"
            title="Deploy to network (Ctrl+D)"
          >
            <Rocket size={16} />
            <span>Deploy</span>
          </button>
        </div>

        <div className="h-8 w-px bg-sui-cyan/20"></div>
        
        {/* Nexi AI Quick Access */}
        <button
          onClick={() => {
            if (rightPanelType === 'nexi' && rightPanelOpen) {
              toggleRightPanel();
            } else {
              setRightPanelType('nexi');
              if (!rightPanelOpen) toggleRightPanel();
            }
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-bold uppercase text-xs tracking-wider font-tech ${
            rightPanelType === 'nexi' && rightPanelOpen
              ? 'text-black bg-gradient-neon border-sui-cyan shadow-neon-lg' 
              : 'text-sui-cyan bg-sui-cyan/10 border-sui-cyan/30 hover:bg-gradient-neon hover:text-black hover:shadow-neon'
          }`}
          title="Toggle Nexi AI Assistant"
        >
          <Bot size={18} />
          <span>Nexi AI</span>
        </button>
        
        {/* Bottom Panel Toggle */}
        <button
          onClick={toggleBottomPanel}
          className={`p-2 rounded-lg border transition-all ${
            bottomPanelOpen 
              ? 'text-sui-cyan bg-sui-cyan/10 border-sui-cyan/50 shadow-neon' 
              : 'text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/5 border-transparent hover:border-sui-cyan/30'
          }`}
          title="Toggle Panel (Ctrl+J)"
        >
          <Layout size={18} />
        </button>
        
        {/* Right Panel Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowRightPanelMenu(!showRightPanelMenu)}
            className={`p-2 rounded-lg border transition-all ${
              rightPanelOpen 
                ? 'text-sui-cyan bg-sui-cyan/10 border-sui-cyan/50 shadow-neon' 
                : 'text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/5 border-transparent hover:border-sui-cyan/30'
            }`}
            title="Toggle Right Panel"
          >
            {rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
          </button>

          {/* Right Panel Menu */}
          {showRightPanelMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-sui-cyan/30 rounded-lg shadow-neon-lg py-1 z-50">
              <button
                onClick={() => {
                  if (rightPanelType === 'nexi' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('nexi');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'nexi' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Bot size={16} />
                <span>Nexi AI</span>
              </button>
              <div className="h-px bg-sui-cyan/10 my-1" />
              <button
                onClick={() => {
                  if (rightPanelType === 'deployment' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('deployment');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'deployment' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Rocket size={16} />
                <span>Deployment</span>
              </button>
              <button
                onClick={() => {
                  if (rightPanelType === 'gas' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('gas');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'gas' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Zap size={16} />
                <span>Gas Analyzer</span>
              </button>
              <button
                onClick={() => {
                  if (rightPanelType === 'collaboration' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('collaboration');
                    if (!rightPanelOpen) toggleRightPanel();
                    if (!collaborationEnabled) toggleCollaboration();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'collaboration' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Users size={16} />
                <span>Collaboration</span>
              </button>
              <button
                onClick={() => {
                  if (rightPanelType === 'stats' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('stats');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'stats' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <TrendingUp size={16} />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => {
                  if (rightPanelType === 'extensions' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('extensions');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'extensions' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Package size={16} />
                <span>Extensions</span>
              </button>
              <button
                onClick={() => {
                  if (rightPanelType === 'settings' && rightPanelOpen) {
                    toggleRightPanel();
                  } else {
                    setRightPanelType('settings');
                    if (!rightPanelOpen) toggleRightPanel();
                  }
                  setShowRightPanelMenu(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${
                  rightPanelType === 'settings' && rightPanelOpen
                    ? 'text-sui-cyan bg-sui-cyan/10'
                    : 'text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/5'
                }`}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>

        <button className="p-2 text-slate-500 hover:text-neon-pink hover:bg-neon-pink/10 rounded-lg border border-transparent hover:border-neon-pink/30 transition-all">
          <Bug size={18} />
        </button>
        <button className="p-2 text-slate-500 hover:text-sui-cyan hover:bg-sui-cyan/10 rounded-lg border border-transparent hover:border-sui-cyan/30 transition-all">
          <Save size={18} />
        </button>
        <button 
          onClick={() => {
            if (rightPanelType === 'settings' && rightPanelOpen) {
              toggleRightPanel();
            } else {
              setRightPanelType('settings');
              if (!rightPanelOpen) toggleRightPanel();
            }
          }}
          className="p-2 text-slate-500 hover:text-neon-purple hover:bg-neon-purple/10 rounded-lg border border-transparent hover:border-neon-purple/30 transition-all"
          title="Toggle Settings"
        >
          <Settings size={18} />
        </button>

        {/* User Profile */}
        <div className="relative ml-2">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-dark-panel border border-sui-cyan/30 rounded-lg hover:border-sui-cyan hover:shadow-neon transition-all"
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-6 h-6 rounded-full border-2 border-sui-cyan/50"
              />
            ) : (
              <User size={18} className="text-sui-cyan" />
            )}
            <span className="text-sm text-white font-semibold">{user?.name || 'User'}</span>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-sui-cyan/30 rounded-lg shadow-neon-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-sui-cyan/20">
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-neon-pink hover:bg-neon-pink/10 transition-all"
              >
                <LogOut size={16} />
                <span className="font-semibold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
