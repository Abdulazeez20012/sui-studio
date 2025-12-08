import React, { useState, useEffect } from 'react';
import {
    Rocket, Hammer, TestTube, UploadCloud, Plus,
    Menu, User, Settings, LogOut, Wifi, WifiOff,
    ChevronDown, CheckCircle, XCircle, Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';
import { apiService } from '../../services/apiService';
import BuildStatus from './BuildStatus';

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
        setRightPanelType
    } = useIDEStore();

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
        if (!currentTab || isBuilding || !backendConnected) return;
        setIsBuilding(true);
        setBuildStatus('building');
        setBuildResult(null);

        if (!bottomPanelOpen) toggleBottomPanel();
        if (activeTerminal) addTerminalOutput(activeTerminal, '$ sui move build');

        try {
            await apiService.executeCommand('save-file', currentTab.content);
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
        } catch (error: any) {
            setBuildStatus('error');
            setBuildResult({ status: 'error', message: error.message, fullOutput: error.toString() });
        } finally {
            setIsBuilding(false);
        }
    };

    const handleTest = async () => {
        if (!currentTab || isTesting || !backendConnected) return;
        setIsTesting(true);
        setTestStatus('idle');

        if (!bottomPanelOpen) toggleBottomPanel();
        if (activeTerminal) addTerminalOutput(activeTerminal, '$ sui move test');

        try {
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
        } catch (error: any) {
            setTestStatus('error');
            if (activeTerminal) addTerminalOutput(activeTerminal, `Error: ${error.message}`);
        } finally {
            setIsTesting(false);
            setTimeout(() => setTestStatus('idle'), 3000);
        }
    };

    const handlePublish = () => {
        // Placeholder for publish logic
        console.log("Publish triggered");
    };

    const handleDeploy = () => {
        if (!currentTab || !backendConnected) return;
        if (rightPanelOpen) {
            // If already open and not deployment, switch. If deployment, close? 
            // User asked for specific button. Let's just open deployment panel.
            setRightPanelType('deployment');
        } else {
            setRightPanelType('deployment');
            toggleRightPanel();
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

                    <ActionButton
                        icon={<Plus size={18} />}
                        label="Create"
                        onClick={handleCreate}
                        primary
                    />

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <ActionButton
                        icon={isBuilding ? <Loader size={18} className="animate-spin" /> : <Hammer size={18} />}
                        label={isBuilding ? "Building..." : "Build"}
                        onClick={handleBuild}
                        disabled={isBuilding || !backendConnected}
                        active={buildStatus === 'success'}
                        error={buildStatus === 'error'}
                    />

                    <ActionButton
                        icon={isTesting ? <Loader size={18} className="animate-spin" /> : <TestTube size={18} />}
                        label={isTesting ? "Testing..." : "Test"}
                        onClick={handleTest}
                        disabled={isTesting || !backendConnected}
                        active={testStatus === 'success'}
                        error={testStatus === 'error'}
                    />

                    <ActionButton
                        icon={<UploadCloud size={18} />}
                        label="Publish"
                        onClick={handlePublish}
                        disabled={!backendConnected}
                    />

                    <div className="w-px h-8 bg-white/10 mx-1" />

                    <ActionButton
                        icon={<Rocket size={18} />}
                        label="Deploy"
                        onClick={handleDeploy}
                        disabled={!backendConnected}
                        special
                    />

                </div>

                {/* Right: User & Settings */}
                <div className="flex items-center gap-4">

                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
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
}> = ({ icon, label, onClick, primary, special, disabled, active, error }) => {

    if (primary) {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
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
