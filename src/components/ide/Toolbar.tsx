import React, { useState, useEffect } from 'react';
import {
  Menu, Save, Bug, Settings,
  Layout, LogOut, User, Rocket, Zap, PanelRightOpen, PanelRightClose, Users,
  Hammer, TestTube, Loader, TrendingUp, CheckCircle, XCircle, Package, Bot, FileCheck,
  Wifi, WifiOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';
import BuildStatus from './BuildStatus';

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
  const [isCompiling, setIsCompiling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [compileStatus, setCompileStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [buildResult, setBuildResult] = useState<any>(null);
  const [compileResult, setCompileResult] = useState<any>(null);
  const [backendConnected, setBackendConnected] = useState(false);

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    // Subscribe to backend connection status
    const unsubscribe = apiService.onConnectionChange((connected) => {
      setBackendConnected(connected);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuild = async () => {
    if (!currentTab || isBuilding || !backendConnected) return;

    setIsBuilding(true);
    setBuildStatus('building');
    setBuildResult(null);

    // Show terminal and add build command
    if (!bottomPanelOpen) toggleBottomPanel();
    if (activeTerminal) {
      addTerminalOutput(activeTerminal, '$ sui move build');
    }

    try {
      // Save current file to workspace first
      await apiService.executeCommand('save-file', currentTab.content);

      // Execute build command
      const result = await apiService.executeCommand('sui move build');

      if (activeTerminal) {
        const lines = result.output.split('\n');
        lines.forEach((line: string) => {
          if (line.trim()) {
            addTerminalOutput(activeTerminal, line);
          }
        });
      }

      if (result.success) {
        setBuildStatus('success');
        setBuildResult({ status: 'success', message: 'Build completed successfully' });
        if (activeTerminal) {
          addTerminalOutput(activeTerminal, '✓ Build successful!');
        }
      } else {
        setBuildStatus('error');
        setBuildResult({
          status: 'error',
          message: 'Build failed',
          fullOutput: result.output
        });
        if (activeTerminal) {
          addTerminalOutput(activeTerminal, '✗ Build failed. Check errors above.');
        }
      }
    } catch (error: any) {
      setBuildStatus('error');
      setBuildResult({
        status: 'error',
        message: error.message,
        fullOutput: error.toString()
      });
      if (activeTerminal) {
        addTerminalOutput(activeTerminal, `✗ Error: ${error.message}`);
      }
    } finally {
      setIsBuilding(false);
    }
  };

  const handleCompileCheck = async () => {
    if (!currentTab || isCompiling || !backendConnected) return;

    setIsCompiling(true);
    setCompileStatus('building');
    setCompileResult(null);

    try {
      const packageName = currentTab.name.replace('.move', '').replace(/[^a-zA-Z0-9_]/g, '_');
      const result = await apiService.compileCode(currentTab.content, packageName);

      if (result.success) {
        setCompileStatus('success');
        setCompileResult({
          status: 'success',
          message: result.simulated
            ? 'Compilation successful (simulated - Sui CLI not installed)'
            : 'Compilation successful',
          bytecode: result.bytecode,
          modules: result.modules,
        });
      } else {
        setCompileStatus('error');
        setCompileResult({
          status: 'error',
          message: 'Compilation failed',
          errors: result.errors || [],
          fullOutput: result.fullOutput,
        });
      }
    } catch (error: any) {
      setCompileStatus('error');
      setCompileResult({
        status: 'error',
        message: error.message || 'Compilation failed',
        fullOutput: error.toString(),
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleTest = async () => {
    if (!currentTab || isTesting || !backendConnected) return;

    setIsTesting(true);
    setTestStatus('idle');

    // Show terminal and add test command
    if (!bottomPanelOpen) toggleBottomPanel();
    if (activeTerminal) {
      addTerminalOutput(activeTerminal, '$ sui move test');
    }

    try {
      // Execute test command
      const result = await apiService.executeCommand('sui move test');

      if (activeTerminal) {
        const lines = result.output.split('\n');
        lines.forEach((line: string) => {
          if (line.trim()) {
            addTerminalOutput(activeTerminal, line);
          }
        });
      }

      if (result.success && !result.output.includes('FAILED')) {
        setTestStatus('success');
        if (activeTerminal) {
          addTerminalOutput(activeTerminal, '✓ All tests passed!');
        }
        setTimeout(() => setTestStatus('idle'), 3000);
      } else {
        setTestStatus('error');
        if (activeTerminal) {
          addTerminalOutput(activeTerminal, '✗ Some tests failed. Check output above.');
        }
        setTimeout(() => setTestStatus('idle'), 3000);
      }
    } catch (error: any) {
      setTestStatus('error');
      if (activeTerminal) {
        addTerminalOutput(activeTerminal, `✗ Error: ${error.message}`);
      }
      setTimeout(() => setTestStatus('idle'), 3000);
    } finally {
      setIsTesting(false);
    }
  };

  const handleDeploy = () => {
    if (!currentTab || !backendConnected) return;

    // Toggle deployment panel
    if (rightPanelType === 'deployment' && rightPanelOpen) {
      toggleRightPanel();
    } else {
      setRightPanelType('deployment');
      if (!rightPanelOpen) toggleRightPanel();
    }
  };

  return (
    <>
      {/* Build Status Notifications */}
      {buildResult && (
        <BuildStatus
          status={buildStatus}
          message={buildResult.message}
          errors={buildResult.errors}
          fullOutput={buildResult.fullOutput}
          onClose={() => {
            setBuildResult(null);
            setBuildStatus('idle');
          }}
        />
      )}

      {/* Compile Status Notifications */}
      {compileResult && (
        <BuildStatus
          status={compileStatus}
          message={compileResult.message}
          errors={compileResult.errors}
          fullOutput={compileResult.fullOutput}
          onClose={() => {
            setCompileResult(null);
            setCompileStatus('idle');
          }}
        />
      )}

      <div className="flex items-center justify-between w-full h-full">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-walrus-cyan hover:text-white transition-all group"
          >
            <div className="w-8 h-8 bg-walrus-cyan/10 rounded-lg flex items-center justify-center p-1 border border-walrus-cyan/30 group-hover:border-walrus-cyan group-hover:shadow-neon transition-all">
              <img
                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
                alt="Sui Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-black text-lg text-white tracking-widest uppercase" style={{ fontFamily: "'Rajdhani', sans-serif" }}>SUI STUDIO</span>
          </button>

          <div className="flex items-center gap-1 ml-4">
            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded transition-colors">
              <Menu size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Backend Status Indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${backendConnected
                ? 'bg-green-500/10 border-green-500/30 text-green-500'
                : 'bg-red-500/10 border-red-500/30 text-red-500'
              }`}
            title={backendConnected ? "Backend Connected" : "Backend Disconnected - Run start-backend.bat"}
          >
            {backendConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span className="hidden md:inline">{backendConnected ? 'Connected' : 'Offline'}</span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 px-2 py-1 bg-walrus-dark-800 rounded-lg border border-walrus-dark-600">
            {/* Compile & Check Button */}
            <button
              onClick={handleCompileCheck}
              disabled={isCompiling || !currentTab || !backendConnected}
              className={`flex items-center gap-2 px-4 py-2 bg-walrus-dark-900 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech ${compileStatus === 'success'
                ? 'border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : compileStatus === 'error'
                  ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-walrus-purple/30 hover:border-walrus-purple text-walrus-purple hover:text-white hover:shadow-neon'
                }`}
              title={backendConnected ? "Compile & Check (Ctrl+Shift+B)" : "Backend Disconnected"}
            >
              {isCompiling ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Checking...</span>
                </>
              ) : compileStatus === 'success' ? (
                <>
                  <CheckCircle size={16} />
                  <span>Valid</span>
                </>
              ) : compileStatus === 'error' ? (
                <>
                  <XCircle size={16} />
                  <span>Errors</span>
                </>
              ) : (
                <>
                  <FileCheck size={16} />
                  <span>Check</span>
                </>
              )}
            </button>

            {/* Build Button */}
            <button
              onClick={handleBuild}
              disabled={isBuilding || !currentTab || !backendConnected}
              className={`flex items-center gap-2 px-4 py-2 bg-walrus-dark-900 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech ${buildStatus === 'success'
                ? 'border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : buildStatus === 'error'
                  ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-walrus-blue/30 hover:border-walrus-blue text-walrus-blue hover:text-white hover:shadow-neon'
                }`}
              title={backendConnected ? "Build project (Ctrl+B)" : "Backend Disconnected"}
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
              disabled={isTesting || !currentTab || !backendConnected}
              className={`flex items-center gap-2 px-4 py-2 bg-walrus-dark-900 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech ${testStatus === 'success'
                ? 'border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : testStatus === 'error'
                  ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'border-walrus-cyan/30 hover:border-walrus-cyan text-walrus-cyan hover:text-white hover:shadow-neon'
                }`}
              title={backendConnected ? "Run tests (Ctrl+T)" : "Backend Disconnected"}
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
              disabled={!currentTab || !backendConnected}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase text-xs tracking-wider font-tech"
              title={backendConnected ? "Deploy to network (Ctrl+D)" : "Backend Disconnected"}
            >
              <Rocket size={16} />
              <span>Deploy</span>
            </button>
          </div>

          <div className="h-8 w-px bg-white/10"></div>

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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-bold uppercase text-xs tracking-wider font-tech ${rightPanelType === 'nexi' && rightPanelOpen
              ? 'text-black bg-gradient-neon border-walrus-cyan shadow-neon-lg'
              : 'text-walrus-cyan bg-walrus-cyan/10 border-walrus-cyan/30 hover:bg-gradient-neon hover:text-black hover:shadow-neon'
              }`}
            title="Toggle Nexi AI Assistant"
          >
            <Bot size={18} />
            <span>Nexi AI</span>
          </button>

          {/* Bottom Panel Toggle */}
          <button
            onClick={toggleBottomPanel}
            className={`p-2 rounded-lg border transition-all ${bottomPanelOpen
              ? 'text-walrus-cyan bg-walrus-cyan/10 border-walrus-cyan/50 shadow-neon'
              : 'text-gray-500 hover:text-walrus-cyan hover:bg-walrus-cyan/5 border-transparent hover:border-walrus-cyan/30'
              }`}
            title="Toggle Panel (Ctrl+J)"
          >
            <Layout size={18} />
          </button>

          {/* Right Panel Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowRightPanelMenu(!showRightPanelMenu)}
              className={`p-2 rounded-lg border transition-all ${rightPanelOpen
                ? 'text-walrus-cyan bg-walrus-cyan/10 border-walrus-cyan/50 shadow-neon'
                : 'text-gray-500 hover:text-walrus-cyan hover:bg-walrus-cyan/5 border-transparent hover:border-walrus-cyan/30'
                }`}
              title="Toggle Right Panel"
            >
              {rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </button>

            {/* Right Panel Menu */}
            {showRightPanelMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-walrus-dark-800 border border-walrus-dark-600 rounded-lg shadow-glass py-1 z-50 backdrop-blur-xl">
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'nexi' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
                    }`}
                >
                  <Bot size={16} />
                  <span>Nexi AI</span>
                </button>
                <div className="h-px bg-white/5 my-1" />
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'deployment' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'gas' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'collaboration' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
                    }`}
                >
                  <Users size={16} />
                  <span>Collaboration</span>
                </button>
                <button
                  onClick={() => {
                    if (rightPanelType === 'wallet' && rightPanelOpen) {
                      toggleRightPanel();
                    } else {
                      setRightPanelType('wallet');
                      if (!rightPanelOpen) toggleRightPanel();
                    }
                    setShowRightPanelMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'wallet' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
                    }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                  </svg>
                  <span>Wallet</span>
                </button>
                <button
                  onClick={() => {
                    if (rightPanelType === 'contract' && rightPanelOpen) {
                      toggleRightPanel();
                    } else {
                      setRightPanelType('contract');
                      if (!rightPanelOpen) toggleRightPanel();
                    }
                    setShowRightPanelMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'contract' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
                    }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                  </svg>
                  <span>Contract Interaction</span>
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'stats' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'extensions' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
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
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all ${rightPanelType === 'settings' && rightPanelOpen
                    ? 'text-walrus-cyan bg-walrus-cyan/10'
                    : 'text-gray-400 hover:text-walrus-cyan hover:bg-white/5'
                    }`}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </button>
              </div>
            )}
          </div>

          <button className="p-2 text-gray-500 hover:text-walrus-pink hover:bg-walrus-pink/10 rounded-lg border border-transparent hover:border-walrus-pink/30 transition-all">
            <Bug size={18} />
          </button>
          <button className="p-2 text-gray-500 hover:text-walrus-cyan hover:bg-walrus-cyan/10 rounded-lg border border-transparent hover:border-walrus-cyan/30 transition-all">
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
            className="p-2 text-gray-500 hover:text-walrus-purple hover:bg-walrus-purple/10 rounded-lg border border-transparent hover:border-walrus-purple/30 transition-all"
            title="Toggle Settings"
          >
            <Settings size={18} />
          </button>

          {/* User Profile */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-walrus-dark-800 border border-walrus-dark-600 rounded-lg hover:border-walrus-cyan hover:shadow-neon transition-all"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-6 h-6 rounded-full border-2 border-walrus-cyan/50"
                />
              ) : (
                <User size={18} className="text-walrus-cyan" />
              )}
              <span className="text-sm text-white font-semibold">{user?.name || 'User'}</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-walrus-dark-800 border border-walrus-dark-600 rounded-lg shadow-glass py-1 z-50 backdrop-blur-xl">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-bold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-walrus-pink hover:bg-walrus-pink/10 transition-all"
                >
                  <LogOut size={16} />
                  <span className="font-semibold">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Toolbar;
