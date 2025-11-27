import React, { useState, useEffect } from 'react';
import { Users, Wifi, WifiOff, Circle, Video, VideoOff } from 'lucide-react';
import { collaborationService } from '../../services/collaborationService';
import VideoChat from './VideoChat';

interface CollaborationUser {
  userId: string;
  userName: string;
  cursorPosition?: { line: number; column: number };
  color?: string;
}

const CollaborationPanel: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [showVideoChat, setShowVideoChat] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [roomInput, setRoomInput] = useState('');

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

  if (showVideoChat) {
    return <VideoChat roomId={roomId} onClose={() => setShowVideoChat(false)} />;
  }

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
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {users.length} {users.length === 1 ? 'user' : 'users'} online
          </div>
          
          {/* Video Chat Button */}
          <button
            onClick={() => setShowRoomDialog(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] transition-colors text-xs font-semibold"
            title="Start video call"
          >
            <Video size={14} />
            <span>Video Call</span>
          </button>
        </div>
      </div>

      {/* Room Dialog */}
      {showRoomDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-sui-cyan/30 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Join Video Call</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Enter Room ID or create a new room
                </label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  placeholder="room-123 or leave empty for new room"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:border-sui-cyan"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const newRoomId = roomInput.trim() || `room-${Date.now()}`;
                    setRoomId(newRoomId);
                    setShowVideoChat(true);
                    setShowRoomDialog(false);
                  }}
                  className="flex-1 px-4 py-2 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] transition-colors font-semibold"
                >
                  Join Room
                </button>
                <button
                  onClick={() => {
                    setShowRoomDialog(false);
                    setRoomInput('');
                  }}
                  className="px-4 py-2 bg-dark-bg border border-dark-border text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="pt-4 border-t border-dark-border">
                <p className="text-xs text-slate-400 mb-2">Share this room ID with your team:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-dark-bg border border-dark-border rounded text-sui-cyan text-sm">
                    {roomInput || 'room-' + Date.now()}
                  </code>
                  <button
                    onClick={() => {
                      const id = roomInput || `room-${Date.now()}`;
                      navigator.clipboard.writeText(id);
                    }}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Copy room ID"
                  >
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
