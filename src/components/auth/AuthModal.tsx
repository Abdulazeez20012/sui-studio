import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Chrome } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GoogleJWT {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, setLoading } = useAuthStore();

  if (!isOpen) return null;

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      setError('');

      if (credentialResponse.credential) {
        const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);

        const user: User = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          createdAt: new Date(),
        };

        login(user);
        setLoading(false);
        onSuccess();
      }
    } catch (err) {
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in failed. Please try again.');
    setLoading(false);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate email authentication
    setTimeout(() => {
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name || email.split('@')[0],
        picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=3CB9FF&color=fff`,
        createdAt: new Date(),
      };

      login(mockUser);
      setLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-walrus-dark-950/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-walrus-dark-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-premium overflow-hidden ring-1 ring-white/5">

        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-walrus-cyan via-walrus-purple to-walrus-cyan opacity-50" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-walrus-purple/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-walrus-cyan/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-8 pb-0 text-center">
          <h2 className="text-3xl font-bold text-white font-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {isSignUp ? 'Join Sui Studio' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-400 mt-2 font-medium">
            {isSignUp ? 'Start building the future of Web3 today' : 'Sign in to access your workspace'}
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          {/* Google Sign In */}
          <div className="flex justify-center transform hover:scale-[1.02] transition-transform duration-300">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
              width="100%"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-wide">{error}</p>
            </div>
          )}

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="px-4 bg-walrus-dark-900 text-gray-500">Or Access With Email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <UserIcon size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-walrus-cyan transition-colors" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sui Developer"
                    className="w-full pl-11 pr-4 py-3 bg-walrus-dark-950/50 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-walrus-cyan/50 focus:shadow-neon-sm focus:bg-walrus-dark-950 transition-all font-medium text-sm"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-walrus-cyan transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dev@sui.io"
                  className="w-full pl-11 pr-4 py-3 bg-walrus-dark-950/50 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-walrus-cyan/50 focus:shadow-neon-sm focus:bg-walrus-dark-950 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-walrus-cyan transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-walrus-dark-950/50 border border-white/5 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-walrus-cyan/50 focus:shadow-neon-sm focus:bg-walrus-dark-950 transition-all font-medium text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-walrus-cyan to-walrus-purple text-black rounded-xl font-bold text-sm uppercase tracking-wider shadow-neon hover:shadow-neon-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-2"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="text-center pt-2">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-white transition-colors group"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-walrus-cyan font-bold group-hover:underline decoration-walrus-cyan/30 underline-offset-4">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-walrus-cyan font-bold group-hover:underline decoration-walrus-cyan/30 underline-offset-4">Sign Up</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-walrus-dark-950/30 border-t border-white/5">
          <p className="text-[10px] text-gray-500 text-center font-mono uppercase tracking-wider">
            Protected by Cloud · Terms & Privacy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
