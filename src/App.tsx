import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { WalletProvider } from './providers/WalletProvider';
import { ThemeInitializer } from './components/ThemeInitializer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { config } from './config';
import '@mysten/dapp-kit/dist/index.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const IDEPage = lazy(() => import('./pages/IDEPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-bg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sui-cyan mx-auto mb-4" />
      <p className="text-slate-400 font-tech">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={config.auth.googleClientId}>
        <WalletProvider>
          <ThemeInitializer />
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route 
                  path="/ide" 
                  element={
                    <ProtectedRoute>
                      <IDEPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </Router>
        </WalletProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
