import React from 'react';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

interface BuildStatusProps {
  status: 'idle' | 'building' | 'success' | 'error';
  message?: string;
  onClose?: () => void;
}

const BuildStatus: React.FC<BuildStatusProps> = ({ status, message, onClose }) => {
  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'building':
        return {
          icon: <Loader size={16} className="animate-spin" />,
          color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          title: 'Building...',
        };
      case 'success':
        return {
          icon: <CheckCircle size={16} />,
          color: 'bg-green-500/10 border-green-500/20 text-green-400',
          title: 'Build Successful',
        };
      case 'error':
        return {
          icon: <XCircle size={16} />,
          color: 'bg-red-500/10 border-red-500/20 text-red-400',
          title: 'Build Failed',
        };
      default:
        return {
          icon: <AlertCircle size={16} />,
          color: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
          title: 'Unknown Status',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${config.color} backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom-5`}>
      {config.icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{config.title}</p>
        {message && <p className="text-xs opacity-80 mt-0.5">{message}</p>}
      </div>
      {onClose && status !== 'building' && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <XCircle size={14} />
        </button>
      )}
    </div>
  );
};

export default BuildStatus;
