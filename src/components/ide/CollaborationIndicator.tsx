import React from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';
import { CollaborationUser } from '../../hooks/useYjsCollaboration';

interface CollaborationIndicatorProps {
  connected: boolean;
  users: CollaborationUser[];
}

export const CollaborationIndicator: React.FC<CollaborationIndicatorProps> = ({
  connected,
  users,
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-walrus-dark-800/50 rounded-lg border border-white/5">
      {/* Connection Status */}
      <div className="flex items-center gap-1.5">
        {connected ? (
          <>
            <Wifi className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-tech">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-500 font-tech">Offline</span>
          </>
        )}
      </div>

      {/* User Count */}
      {users.length > 0 && (
        <>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-tech">{users.length}</span>
          </div>

          {/* User Avatars */}
          <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <div
                key={user.id}
                className="w-6 h-6 rounded-full border-2 border-walrus-dark-800 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {users.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-walrus-dark-800 bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                +{users.length - 3}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
