import React, { useState, useEffect } from 'react';
import {
    Rocket, Hammer, TestTube, UploadCloud, Plus,
    Menu, User, Settings, LogOut, Wifi, WifiOff,
    ChevronDown, CheckCircle, XCircle, Loader, FolderOpen, HelpCircle, AlertCircle, Bug
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';
import BuildStatus from './BuildStatus';
import RecentFiles from './RecentFiles';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const {
        tabs,
        activeTab,
        toggleBottomPanel,
        activeTerminal,
        addTerminalOutput,
        bottomPanelOpen,
        rightPanelOpen,
        toggleRightPanel,
        rightPanelType,
        setRightPanelType,
        addTab,
    } = useIDEStore();
    
    const { readFile, currentFolder } = useElectronFileSystem();

    const [backendConnected, setBackendConnected] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Status States
    const [isBuilding, setIsBuilding] = useState(false);
    const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'error'>('idle');
    const [buildResult, setBuildResult] = useState<any>(null);

    const [isTesting, setIsTesting] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const currentTab = tabs.find(t => t.id === activeTab);

    useEffect(() => {
        const unsubscribe = apiService.onConnectionChange(setBackendConnected);
        return unsubscribe;
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCreate = () => {
        // Trigger new project flow
        // Dispath event or use store to open dialog
        console.log("Create new project triggered");
        // Ideally open NewProjectDialog via store or event
        document.dispatchEvent(new CustomEvent('ide:newProject'));
    };

    const handleBuild = async () => {
        if (isBuilding) return;
        
        setIsBuilding(true);
        setBuildStatus('building');
        setBuildResult(null);

        if (!bottomPanelOpen) toggleBottomPanel();
        if (activeTerminal) addTerminalOutput(activeTerminal, '$ sui move build');

        try {
            // Use Electron terminal if available, otherwise use backend API
            if (window.electron?.isElectron) {
                const result = await window.electron.executeCommand('sui move build', currentFolder || undefined);

                if (activeTerminal && result.output) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success) {
                    setBuildStatus('success');
                    setBuildResult({ status: 'success', message: 'Build successful' });
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Build successful!');
                } else {
                    setBuildStatus('error');
                    setBuildResult({ 
                        status: 'error', 
                        message: 'Build failed', 
                        fullOutput: result.output || result.error 
                    });
                    if (activeTerminal && result.error) {
                        addTerminalOutput(activeTerminal, `Error: ${result.error}`);
                    }
                }
            } else if (backendConnected) {
                // Fallback to backend API for web version
                await apiService.executeCommand('save-file', currentTab?.content || '');
                const result = await apiService.executeCommand('sui move build');

                if (activeTerminal) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success) {
                    setBuildStatus('success');
                    setBuildResult({ status: 'success', message: 'Build successful' });
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Build successful!');
                } else {
                    setBuildStatus('error');
                    setBuildResult({ status: 'error', message: 'Build failed', fullOutput: result.output });
                }
            } else {
                throw new Error('No build system available. Please open a Sui Move project folder.');
            }
        } catch (error: any) {
            setBuildStatus('error');
            setBuildResult({ status: 'error', message: error.message, fullOutput: error.toString() });
            if (activeTerminal) addTerminalOutput(activeTerminal, `Error: ${error.message}`);
        } finally {
            setIsBuilding(false);
            setTimeout(() => {
                if (buildStatus !== 'error') setBuildStatus('idle');
            }, 3000);
        }
    };

    const handleTest = async () => {
        if (isTesting) return;
        
        setIsTesting(true);
        setTestStatus('idle');

        if (!bottomPanelOpen) toggleBottomPanel();
        if (activeTerminal) addTerminalOutput(activeTerminal, '$ sui move test');

        try {
            // Use Electron terminal if available, otherwise use backend API
            if (window.electron?.isElectron) {
                const result = await window.electron.executeCommand('sui move test', currentFolder || undefined);

                if (activeTerminal && result.output) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success && !result.output?.includes('FAILED')) {
                    setTestStatus('success');
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Tests passed!');
                } else {
                    setTestStatus('error');
                    if (activeTerminal && result.error) {
                        addTerminalOutput(activeTerminal, `Error: ${result.error}`);
                    }
                }
            } else if (backendConnected) {
                // Fallback to backend API for web version
                const result = await apiService.executeCommand('sui move test');

                if (activeTerminal) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success && !result.output.includes('FAILED')) {
                    setTestStatus('success');
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Tests passed!');
                } else {
                    setTestStatus('error');
                }
            } else {
                throw new Error('No test system available. Please open a Sui Move project folder.');
            }
        } catch (error: any) {
            setTestStatus('error');
            if (activeTerminal) addTerminalOutput(activeTerminal, `Error: ${error.message}`);
        } finally {
            setIsTesting(false);
            setTimeout(() => setTestStatus('idle'), 3000);
        }
    };

    const handlePublish = async () => {
        if (!bottomPanelOpen) toggleBottomPanel();
        if (activeTerminal) addTerminalOutput(activeTerminal, '$ sui client publish --gas-budget 100000000');

        try {
            // Use Electron terminal if available
            if (window.electron?.isElectron) {
                const result = await window.electron.executeCommand(
                    'sui client publish --gas-budget 100000000',
                    currentFolder || undefined
                );

                if (activeTerminal && result.output) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success) {
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Package published successfully!');
                } else {
                    if (activeTerminal && result.error) {
                        addTerminalOutput(activeTerminal, `Error: ${result.error}`);
                    }
                }
            } else if (backendConnected) {
                // Fallback to backend API for web version
                const result = await apiService.executeCommand('sui client publish --gas-budget 100000000');
                
                if (activeTerminal) {
                    result.output.split('\n').forEach((line: string) => {
                        if (line.trim()) addTerminalOutput(activeTerminal, line);
                    });
                }

                if (result.success) {
                    if (activeTerminal) addTerminalOutput(activeTerminal, '✓ Package published successfully!');
                }
            } else {
                throw new Error('No publish system available. Please open a Sui Move project folder.');
            }
        } catch (error: any) {
            if (activeTerminal) addTerminalOutput(activeTerminal, `Error: ${error.message}`);
        }
    };

    const handleDeploy = () => {
        if (!currentTab || !backendConnected) return;

        if (rightPanelOpen && rightPanelType === 'deployment') {
            toggleRightPanel();
        } else {
            setRightPanelType('deployment');
            if (!rightPanelOpen) toggleRightPanel();
        }
    };

    return (
        <>
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

            <div className="h-16 bg-walrus-dark-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50 select-none">

                {/* Left: Branding */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-gradient-to-br from-walrus-cyan to-walrus-purple rounded-xl flex items-center justify-center shadow-neon-sm group-hover:shadow-neon transition-all">
                            <img
                                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1765140543/Logo_-_Cloud-removebg-preview_obkvso.png"
                                alt="Sui Studio"
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-bold text-xl text-white tracking-widest font-display">SUI STUDIO</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${backendConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{backendConnected ? 'ONLINE' : 'OFFLINE'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center: 5 Critical Actions */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">

                    {/* Open Folder (Desktop only) */}
                    {typeof window !== 'undefined' && (window as any).electron?.isElectron && (
                        <ActionButton
                            icon={<FolderOpen size={18} />}
                            label="Open"
                            onClick={() => document.dispatchEvent(new CustomEvent('ide:openFolder'))}
                            primary
                        />
                    )}

                    <ActionButton
                        icon={<Plus size={18} />}
                        label="Create"
                        onClick={handleCreate}
                        primary={!(typeof window !== 'undefined' && (window as any).electron?.isElectron)}
                    />

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <ActionButton
                        icon={isBuilding ? <Loader size={18} className="animate-spin" /> : <Hammer size={18} />}
                        label={isBuilding ? "Building..." : "Build"}
                        onClick={handleBuild}
                        disabled={isBuilding || (!window.electron?.isElectron && !backendConnected) || !currentFolder}
                        active={buildStatus === 'success'}
                        error={buildStatus === 'error'}
                        title={!currentFolder ? "Open a folder first" : "Build project (Ctrl+Shift+B)"}
                    />

                    <ActionButton
                        icon={isTesting ? <Loader size={18} className="animate-spin" /> : <TestTube size={18} />}
                        label={isTesting ? "Testing..." : "Test"}
                        onClick={handleTest}
                        disabled={isTesting || (!window.electron?.isElectron && !backendConnected) || !currentFolder}
                        active={testStatus === 'success'}
                        error={testStatus === 'error'}
                        title={!currentFolder ? "Open a folder first" : "Run tests (Ctrl+Shift+T)"}
                    />

                    <ActionButton
                        icon={<UploadCloud size={18} />}
                        label="Publish"
                        onClick={handlePublish}
                        disabled={(!window.electron?.isElectron && !backendConnected) || !currentFolder}
                        title={!currentFolder ? "Open a folder first" : "Publish package to network"}
                    />

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <ActionButton
                        icon={<Rocket size={18} />}
                        label="Deploy"
                        onClick={handleDeploy}
                        disabled={!backendConnected}
                        special
                        title="Deploy contract"
                    />

                </div>

                {/* Right: User & Settings */}
                <div className="flex items-center gap-4">

                    {/* Syntax Checker Error Indicator */}
                    <SyntaxErrorIndicator />

                    <RecentFiles 
                        onFileSelect={async (path, name) => {
                            try {
                                const content = await readFile(path);
                                const newTab = {
                                    id: `tab-${Date.now()}`,
                                    name,
                                    path,
                                    content,
                                    language: path.endsWith('.move') ? 'move' : 'plaintext',
                                    isDirty: false,
                                };
                                addTab(newTab);
                            } catch (error) {
                                console.error('Failed to open recent file:', error);
                            }
                        }}
                    />

                    <button 
                        onClick={() => document.dispatchEvent(new CustomEvent('ide:showKeyboardShortcuts'))}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Keyboard Shortcuts (?)"
                    >
                        <HelpCircle size={20} />
                    </button>

                    <button 
                        onClick={() => {
                            if (rightPanelOpen && rightPanelType === 'settings') {
                                // If settings panel is already open, close it
                                toggleRightPanel();
                            } else {
                                // Otherwise, open settings panel
                                setRightPanelType('settings');
                                if (!rightPanelOpen) toggleRightPanel();
                            }
                        }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-1 pr-3 py-1 bg-walrus-dark-900 border border-white/5 rounded-full hover:border-walrus-cyan/50 hover:shadow-neon-sm transition-all"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-walrus-cyan to-walrus-purple p-[1px]">
                                <img
                                    src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                                    alt="User"
                                    className="w-full h-full rounded-full object-cover bg-black"
                                />
                            </div>
                            <div className="flex flex-col items-start hidden xl:flex">
                                <span className="text-xs font-bold text-white leading-tight">{user?.name?.split(' ')[0] || 'Guest'}</span>
                                <span className="text-[10px] text-gray-500 font-mono">Free Plan</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-walrus-dark-900 border border-white/10 rounded-xl shadow-premium p-1 z-50 backdrop-blur-xl">
                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
};

// Syntax Error Indicator Component
const SyntaxErrorIndicator: React.FC = () => {
    const { syntaxErrors, syntaxWarnings, setRightPanelType, toggleRightPanel, rightPanelOpen } = useIDEStore();
    
    const hasIssues = syntaxErrors > 0 || syntaxWarnings > 0;
    
    if (!hasIssues) return null;
    
    const handleClick = () => {
        setRightPanelType('debugger');
        if (!rightPanelOpen) toggleRightPanel();
    };
    
    return (
        <button
            onClick={handleClick}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                syntaxErrors > 0
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse'
                    : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
            }`}
            title={`${syntaxErrors > 0 ? `${syntaxErrors} Error${syntaxErrors !== 1 ? 's' : ''}` : `${syntaxWarnings} Warning${syntaxWarnings !== 1 ? 's' : ''}`} - Click to view`}
        >
            <Bug size={16} />
            <span>{syntaxErrors > 0 ? syntaxErrors : syntaxWarnings}</span>
            {syntaxErrors > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
        </button>
    );
};

// Helper Component for Header Buttons
const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    primary?: boolean;
    special?: boolean;
    disabled?: boolean;
    active?: boolean;
    error?: boolean;
    title?: string;
}> = ({ icon, label, onClick, primary, special, disabled, active, error, title }) => {

    if (primary) {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                title={title}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {icon}
                <span>{label}</span>
            </button>
        )
    }

    if (special) {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                title={title}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-walrus-cyan to-walrus-purple text-black rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-neon hover:shadow-neon-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {icon}
                <span>{label}</span>
            </button>
        )
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`flex items-center gap-2 px-4 py-2 bg-walrus-dark-900 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:bg-walrus-dark-800 disabled:opacity-50 disabled:cursor-not-allowed ${active
                ? 'border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                : error
                    ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                    : 'border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
};

export default Header;
