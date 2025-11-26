import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export const BackendWakeUp = ({ onReady }: { onReady: () => void }) => {
  const [status, setStatus] = useState<'checking' | 'waking' | 'ready'>('checking');
  const [dots, setDots] = useState('');

  useEffect(() => {
    const checkBackend = async () => {
      setStatus('waking');
      
      // Try to wake up the backend
      const isReady = await apiService.wakeUpBackend();
      
      if (isReady) {
        setStatus('ready');
        setTimeout(onReady, 500);
      } else {
        // Retry after a delay
        setTimeout(checkBackend, 2000);
      }
    };

    checkBackend();
  }, [onReady]);

  // Animated dots
  useEffect(() => {
    if (status !== 'ready') {
      const interval = setInterval(() => {
        setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [status]);

  if (status === 'ready') return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Waking up backend{dots}
          </h2>
          <p className="text-gray-400 text-sm max-w-md">
            The backend is starting up. This may take 30-60 seconds on first load.
          </p>
        </div>
      </div>
    </div>
  );
};
