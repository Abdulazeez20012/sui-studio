import { useEffect, useRef, useState } from 'react';
import { collaborationService } from '../services/collaborationService';
import { useAuthStore } from '../store/authStore';

interface UseCollaborationOptions {
  projectId: string;
  enabled: boolean;
  onRemoteEdit?: (changes: any[]) => void;
  onSyncRequired?: () => void;
}

export const useCollaboration = (options: UseCollaborationOptions) => {
  const { projectId, enabled, onRemoteEdit, onSyncRequired } = options;
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const documentVersion = useRef(0);

  useEffect(() => {
    if (!enabled || !user || !projectId) return;

    // Get auth token
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    // Connect to collaboration server
    collaborationService.connect(projectId, token);

    // Handle initialization
    const handleInit = (message: any) => {
      documentVersion.current = message.version;
      setActiveUsers(message.clients || []);
      setIsConnected(true);
    };

    // Handle remote edits
    const handleEdit = (message: any) => {
      if (message.version > documentVersion.current) {
        documentVersion.current = message.version;
        if (onRemoteEdit) {
          onRemoteEdit(message.changes);
        }
      }
    };

    // Handle sync required
    const handleSyncRequired = (message: any) => {
      documentVersion.current = message.currentVersion;
      if (onSyncRequired) {
        onSyncRequired();
      }
    };

    // Handle user joined
    const handleUserJoined = (message: any) => {
      setActiveUsers(prev => [...prev, {
        userId: message.userId,
        userName: message.userName,
      }]);
    };

    // Handle user left
    const handleUserLeft = (message: any) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== message.userId));
    };

    // Subscribe to events
    collaborationService.on('init', handleInit);
    collaborationService.on('edit', handleEdit);
    collaborationService.on('sync-required', handleSyncRequired);
    collaborationService.on('user-joined', handleUserJoined);
    collaborationService.on('user-left', handleUserLeft);

    // Cleanup
    return () => {
      collaborationService.off('init', handleInit);
      collaborationService.off('edit', handleEdit);
      collaborationService.off('sync-required', handleSyncRequired);
      collaborationService.off('user-joined', handleUserJoined);
      collaborationService.off('user-left', handleUserLeft);
      collaborationService.disconnect();
      setIsConnected(false);
    };
  }, [enabled, user, projectId, onRemoteEdit, onSyncRequired]);

  // Send local edits
  const sendEdit = (changes: any[]) => {
    if (!isConnected) return;
    
    collaborationService.sendEdit(changes, documentVersion.current);
    documentVersion.current++;
  };

  // Send cursor position
  const sendCursor = (position: { line: number; column: number }) => {
    if (!isConnected) return;
    collaborationService.sendCursor(position);
  };

  // Send selection
  const sendSelection = (selection: { start: any; end: any }) => {
    if (!isConnected) return;
    collaborationService.sendSelection(selection);
  };

  // Send save notification
  const sendSave = (content: string) => {
    if (!isConnected) return;
    collaborationService.sendSave(content);
  };

  return {
    isConnected,
    activeUsers,
    sendEdit,
    sendCursor,
    sendSelection,
    sendSave,
  };
};
