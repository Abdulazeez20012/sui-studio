import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { logger } from '../utils/logger';

export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
}

export function useYjsCollaboration(documentId: string) {
  const [doc] = useState(() => new Y.Doc());
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    // Use environment variable or default to localhost
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = backendUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${wsProtocol}://${wsHost}/yjs?doc=${documentId}`;
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      logger.info('Yjs connected', { documentId });
      
      // Request initial sync
      ws.send(JSON.stringify({ type: 'sync-request' }));
    };

    ws.onclose = () => {
      setConnected(false);
      logger.info('Yjs disconnected', { documentId });
    };

    ws.onerror = (error) => {
      logger.error('Yjs error', error);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        logger.error('Failed to parse Yjs message', error);
      }
    };

    const handleMessage = (message: any) => {
      switch (message.type) {
        case 'sync':
          // Apply initial state
          const update = new Uint8Array(message.data);
          Y.applyUpdate(doc, update);
          updateText();
          break;

        case 'update':
          // Apply incremental update
          const deltaUpdate = new Uint8Array(message.data);
          Y.applyUpdate(doc, deltaUpdate);
          updateText();
          break;

        case 'awareness':
          // Update user awareness (cursors, selections)
          if (message.users) {
            setUsers(message.users);
          }
          break;

        case 'user-joined':
          logger.info('User joined', { userId: message.userId });
          break;
      }
    };

    const updateText = () => {
      const yText = doc.getText('content');
      setText(yText.toString());
    };

    // Listen to local changes
    const yText = doc.getText('content');
    const observer = () => {
      updateText();
    };
    yText.observe(observer);

    return () => {
      yText.unobserve(observer);
      ws.close();
      doc.destroy();
    };
  }, [documentId]);

  const updateContent = (newText: string) => {
    const yText = doc.getText('content');
    const currentText = yText.toString();
    
    if (currentText !== newText) {
      // Calculate diff and apply
      doc.transact(() => {
        yText.delete(0, currentText.length);
        yText.insert(0, newText);
      });

      // Send update to server
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const update = Y.encodeStateAsUpdate(doc);
        wsRef.current.send(JSON.stringify({
          type: 'update',
          data: Array.from(update),
        }));
      }
    }
  };

  const updateCursor = (line: number, column: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'awareness',
        cursor: { line, column },
      }));
    }
  };

  return {
    doc,
    connected,
    users,
    text,
    updateContent,
    updateCursor,
  };
}
