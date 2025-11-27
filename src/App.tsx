import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import IDEPage from './pages/IDEPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { WalletProvider } from './providers/WalletProvider';
import { ThemeInitializer } from './components/ThemeInitializer';
import '@mysten/dapp-kit/dist/index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <WalletProvider>
        <ThemeInitializer />
        <Router>
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
        </Router>
      </WalletProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
