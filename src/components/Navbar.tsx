
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Wallet } from 'lucide-react';
import { ConnectButton } from '@mysten/dapp-kit';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Platform', href: '#platform' },
        { name: 'Resources', href: '#resources' },
        { name: 'Company', href: '#company' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-sui-blue/20 rounded-full blur-md group-hover:bg-sui-blue/40 transition-all duration-300" />
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white relative z-10">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">SuiStudio</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Connect Wallet Button (Custom styled wrapper for standard ConnectButton if needed, or direct button) */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4CA2FF] to-[#00E0FF] hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(76,162,255,0.5)]">
                        <Wallet className="w-4 h-4" />
                        Connect Wallet
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 space-y-4 animate-in slide-in-from-top-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="block text-gray-400 hover:text-white text-lg font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="pt-4 border-t border-white/10">
                        <button className="w-full flex justify-center items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#4CA2FF] to-[#00E0FF] text-white font-semibold rounded-lg">
                            <Wallet className="w-4 h-4" />
                            Connect Wallet
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
