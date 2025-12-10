import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  show: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...', show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-walrus-dark-800 border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm font-tech text-gray-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
