
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Hexagon, Wallet, Globe, Moon, Sun,
  ChevronDown, ChevronRight, ExternalLink,
  Layout, Terminal, Cpu, Book, Users, FileText, LifeBuoy, Shield, Zap, Code2, Rocket, MessageSquare, User, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import { useAuthStore } from '../src/store/authStore';
import { useThemeStore } from '../src/store/themeStore';
import AuthModal from '../src/components/auth/AuthModal';
import { useSuiWallet } from '../src/hooks/useSuiWallet';

type NavItem = {
  label: string;
  href?: string;
  children?: {
    name: string;
    description?: string;
    icon?: React.ElementType;
    href: string;
  }[];
};

const NAV_MENU: NavItem[] = [
  {
    label: 'Platform',
    children: [
      { name: 'Web IDE', description: 'Browser-based editor', icon: Globe, href: '#platform' },
      { name: 'Desktop IDE', description: 'Native performance', icon: Terminal, href: '#platform' },
      { name: 'Templates', description: 'Pre-built dApps', icon: Layout, href: '#' },
      { name: 'Extensions', description: 'Community plugins', icon: Cpu, href: '#' },
    ]
  },
  {
    label: 'Resources',
    children: [
      { name: 'Documentation', description: 'Guides & References', icon: Book, href: '#' },
      { name: 'Tutorials', description: 'Step-by-step learning', icon: FileText, href: '#' },
      { name: 'Community', description: 'Forums & Discord', icon: Users, href: '#' },
      { name: 'Support', description: 'Get help fast', icon: LifeBuoy, href: '#' },
    ]
  },
  {
    label: 'Company',
    children: [
      { name: 'About', icon: Shield, href: '#' },
      { name: 'Careers', icon: Rocket, href: '#' },
      { name: 'Contact', icon: MessageSquare, href: '#' },
    ]
  },
  { label: 'Pricing', href: '#pricing' }
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { connected, address, availableWallets, connect, disconnect, formatAddress, loading } = useSuiWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [network, setNetwork] = useState('Testnet');
  const [lang, setLang] = useState('EN');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleConnect = () => {
    if (connected) {
      disconnect();
      setShowWalletMenu(false);
    } else {
      if (availableWallets.length === 1) {
        // Auto-connect if only one wallet available
        connect(availableWallets[0].name);
      } else if (availableWallets.length > 1) {
        // Show wallet selection menu
        setShowWalletMenu(true);
      } else {
        alert('No Sui wallet detected. Please install Sui Wallet, Suiet, Ethos, or Slush.');
      }
    }
  };

  const handleWalletSelect = (walletName: string) => {
    connect(walletName);
    setShowWalletMenu(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate('/ide');
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-3 ${isScrolled || isMobileMenuOpen
          ? 'bg-neo-bg border-neo-black py-4 shadow-neo'
          : 'bg-transparent border-transparent py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">

          {/* Logo Area */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer">
            <div className="relative group">
              <img
                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png"
                alt="Sui Logo"
                className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-200"
              />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-neo-black uppercase">Sui Studio</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_MENU.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href || '#'}
                  className={`px-4 py-2 text-sm font-bold rounded-none flex items-center gap-1.5 transition-colors border-2 ${activeDropdown === item.label
                      ? 'bg-neo-primary text-neo-black border-neo-black shadow-neo-sm'
                      : 'text-neo-black border-transparent hover:bg-neo-accent hover:border-neo-black hover:shadow-neo-sm'
                    }`}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 text-neo-black ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                  )}
                </a>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === item.label && item.children && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-neo-white border-3 border-neo-black shadow-neo p-2 overflow-hidden z-50"
                    >

                      <div className="grid gap-1">
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            className="flex items-start gap-3 p-3 hover:bg-neo-bg border-2 border-transparent hover:border-neo-black transition-all group/item"
                          >
                            <div className="p-2 bg-neo-secondary border-2 border-neo-black text-neo-black group-hover/item:shadow-neo-sm transition-all">
                              {child.icon && <child.icon className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-neo-black">
                                {child.name}
                              </div>
                              {child.description && (
                                <div className="text-xs text-gray-600 mt-0.5 font-medium">
                                  {child.description}
                                </div>
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Web3 Toolbar (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Network Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neo-white border-2 border-neo-black shadow-neo-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-mono font-bold text-neo-black">{network}</span>
              <ChevronDown className="w-3 h-3 text-neo-black cursor-pointer" />
            </div>

            {/* Auth / User Profile */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-white/10 rounded-lg hover:border-sui-cyan/30 transition-colors"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User size={16} className="text-slate-400" />
                  )}
                  <span className="text-sm text-white">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => navigate('/ide')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Terminal size={16} />
                      <span>Open IDE</span>
                    </button>
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
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Wallet Connect */}
            <div className="relative">
              <Button
                variant={connected ? 'outline' : 'outline'}
                size="sm"
                onClick={handleConnect}
                disabled={loading}
                className={connected ? "border-sui-cyan/30 text-sui-cyan bg-sui-cyan/5" : ""}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {loading ? 'Connecting...' : connected && address ? formatAddress(address) : 'Connect Wallet'}
              </Button>

              {/* Wallet Selection Menu */}
              {showWalletMenu && !connected && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">Select Wallet</p>
                  </div>
                  {availableWallets.map((wallet) => (
                    <button
                      key={wallet.name}
                      onClick={() => handleWalletSelect(wallet.name)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {wallet.icon ? (
                        <img src={wallet.icon} alt={wallet.name} className="w-4 h-4" />
                      ) : (
                        <Wallet size={16} />
                      )}
                      <span>{wallet.name}</span>
                    </button>
                  ))}
                  {availableWallets.length === 0 && (
                    <div className="px-4 py-2 text-sm text-slate-400">
                      No wallets detected
                    </div>
                  )}
                  <button
                    onClick={() => setShowWalletMenu(false)}
                    className="w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-t border-white/10 mt-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Settings Toggles */}
            <div className="flex items-center gap-1 border-l-2 border-neo-black pl-4">
              <button className="p-2 text-neo-black hover:bg-neo-accent border-2 border-transparent hover:border-neo-black hover:shadow-neo-sm transition-all">
                <Globe className="w-4 h-4" />
                <span className="sr-only">Language</span>
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 text-neo-black hover:bg-neo-accent border-2 border-transparent hover:border-neo-black hover:shadow-neo-sm transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="sr-only">Theme</span>
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-neo-black p-2 hover:bg-neo-accent border-2 border-transparent hover:border-neo-black hover:shadow-neo-sm transition-all relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0B0F14] border-l border-white/10 z-50 overflow-y-auto lg:hidden"
            >
              <div className="p-6 pt-24 space-y-8">
                {/* Mobile Nav Items */}
                <div className="space-y-2">
                  {NAV_MENU.map((item) => (
                    <div key={item.label} className="border-b border-white/5 pb-2">
                      {item.children ? (
                        <div className="space-y-2">
                          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
                            {item.label}
                          </div>
                          <div className="pl-2 space-y-1">
                            {item.children.map((child) => (
                              <a
                                key={child.name}
                                href={child.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                              >
                                {child.icon && <child.icon className="w-4 h-4 text-sui-cyan" />}
                                <span className="text-base font-medium">{child.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block p-3 rounded-lg text-lg font-medium text-white hover:bg-white/5 transition-colors"
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#161b22] border border-white/10">
                    <span className="text-sm text-slate-400">Network</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-mono text-white">{network}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={handleConnect}
                    disabled={loading}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    {loading ? 'Connecting...' : connected && address ? formatAddress(address) : 'Connect Wallet'}
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition-colors">
                      <Globe className="w-4 h-4" />
                      English
                    </button>
                    <button 
                      onClick={toggleTheme}
                      className="flex items-center justify-center gap-2 p-3 rounded-lg border border-white/10 hover:bg-white/5 text-slate-300 transition-colors"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </nav>
  );
};

export default Navbar;
