import React, { useState, useEffect } from 'react';
import { Users, Wifi, WifiOff, Circle } from 'lucide-react';
import { collaborationService } from '../../services/collaborationService';

interface CollaborationUser {
  userId: string;
  userName: string;
  cursorPosition?: { line: number; column: number };
  color?: string;
}

const CollaborationPanel: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<CollaborationUser[]>([]);

  useEffect(() => {
    // Listen for connection status
    const checkConnection = setInterval(() => {
      setIsConnected(collaborationService.isConnected());
    }, 1000);

    // Listen for user events
    const handleInit = (message: any) => {
      setUsers(message.clients || []);
    };

    const handleUserJoined = (message: any) => {
      setUsers(prev => [...prev, {
        userId: message.userId,
        userName: message.userName,
        color: generateColor(message.userId),
      }]);
    };

    const handleUserLeft = (message: any) => {
      setUsers(prev => prev.filter(u => u.userId !== message.userId));
    };

    const handleCursor = (message: any) => {
      setUsers(prev => prev.map(u => 
        u.userId === message.userId 
          ? { ...u, cursorPosition: message.position }
          : u
      ));
    };

    collaborationService.on('init', handleInit);
    collaborationService.on('user-joined', handleUserJoined);
    collaborationService.on('user-left', handleUserLeft);
    collaborationService.on('cursor', handleCursor);

    return () => {
      clearInterval(checkConnection);
      collaborationService.off('init', handleInit);
      collaborationService.off('user-joined', handleUserJoined);
      collaborationService.off('user-left', handleUserLeft);
      collaborationService.off('cursor', handleCursor);
    };
  }, []);

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-sui-cyan" />
            <h3 className="text-sm font-semibold text-white">Collaboration</h3>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi size={14} className="text-green-400" />
                <span className="text-xs text-green-400">Connected</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-red-400" />
                <span className="text-xs text-red-400">Disconnected</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-xs text-slate-400">
          {users.length} {users.length === 1 ? 'user' : 'users'} online
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No other users online</p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.userId}
              className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg border border-dark-border"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: user.color || '#3CB9FF' }}
              >
                {user.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user.userName}
                </div>
                {user.cursorPosition && (
                  <div className="text-xs text-slate-400">
                    Line {user.cursorPosition.line}, Col {user.cursorPosition.column}
                  </div>
                )}
              </div>
              <Circle 
                size={8} 
                fill="currentColor" 
                className="text-green-400 flex-shrink-0"
              />
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-dark-border">
        <div className="text-xs text-slate-500 text-center">
          Real-time collaboration enabled
        </div>
      </div>
    </div>
  );
};

// Generate consistent color for user
function generateColor(userId: string): string {
  const colors = [
    '#3CB9FF', // sui-cyan
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#FFE66D', // yellow
    '#A8E6CF', // mint
    '#FF8B94', // pink
    '#C7CEEA', // lavender
    '#FFDAC1', // peach
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export default CollaborationPanel;
