import React, { useState } from 'react';
import { 
  Menu, Save, Play, Bug, Settings, 
  Layout, LogOut, User, Rocket, Zap, PanelRightOpen, PanelRightClose
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';

const Toolbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { rightPanelOpen, toggleRightPanel, setRightPanelType, rightPanelType } = useIDEStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRightPanelMenu, setShowRightPanelMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-12 bg-dark-surface border-b border-dark-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sui-cyan hover:text-white transition-colors"
        >
          <div className="w-8 h-8 bg-sui-cyan rounded flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <span className="font-semibold">Sui Studio</span>
        </button>

        <div className="flex items-center gap-1 ml-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
            <Menu size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-sui-cyan text-black rounded hover:bg-[#2ba6eb] transition-colors">
          <Play size={16} />
          <span>Run</span>
        </button>
        
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
            </div>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
          <Bug size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
          <Save size={18} />
        </button>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded transition-colors">
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
