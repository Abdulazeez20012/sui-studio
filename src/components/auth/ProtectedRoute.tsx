import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import AuthModal from './AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if running in Electron (desktop app)
  const isElectron = typeof window !== 'undefined' && (window as any).electron?.isElectron;

  useEffect(() => {
    // Skip authentication for desktop app
    if (isElectron) {
      setIsChecking(false);
      return;
    }

    // Check authentication status for web version
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
    setIsChecking(false);
  }, [isAuthenticated, isElectron]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    // Redirect to home if user closes modal without authenticating
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  };

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sui-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Desktop app: no authentication required
  if (isElectron) {
    return <>{children}</>;
  }

  // Web version: require authentication
  if (!isAuthenticated && !showAuthModal) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthClose}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default ProtectedRoute;
