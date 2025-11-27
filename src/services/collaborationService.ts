type MessageHandler = (message: any) => void;

interface CollaborationUser {
  userId: string;
  userName: string;
  cursorPosition?: { line: number; column: number };
  selection?: { start: any; end: any };
}

export class CollaborationService {
  private ws: WebSocket | null = null;
  private projectId: string | null = null;
  private messageHandlers: Map<string, MessageHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(projectId: string, token: string) {
    this.projectId = projectId;
    const wsUrl = this.getWebSocketUrl();
    
    this.ws = new WebSocket(`${wsUrl}?token=${token}`);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Join project room
      this.send({
        type: 'join',
        projectId,
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(projectId, token);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.ws) {
      this.send({ type: 'leave' });
      this.ws.close();
      this.ws = null;
    }
    this.projectId = null;
    this.messageHandlers.clear();
  }

  // Send edit changes
  sendEdit(changes: any[], version: number) {
    this.send({
      type: 'edit',
      changes,
      version,
    });
  }

  // Send cursor position
  sendCursor(position: { line: number; column: number }) {
    this.send({
      type: 'cursor',
      position,
    });
  }

  // Send selection
  sendSelection(selection: { start: any; end: any }) {
    this.send({
      type: 'selection',
      selection,
    });
  }

  // Send save notification
  sendSave(content: string) {
    this.send({
      type: 'save',
      content,
    });
  }

  // WebRTC signaling
  sendWebRTCSignal(targetPeerId: string, signal: any) {
    this.send({
      type: 'webrtc-signal',
      targetPeerId,
      signal,
    });
  }

  // Join WebRTC room
  joinWebRTCRoom(peerId: string) {
    this.send({
      type: 'webrtc-join-room',
      peerId,
    });
  }

  // Subscribe to message types
  on(messageType: string, handler: MessageHandler) {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, []);
    }
    this.messageHandlers.get(messageType)!.push(handler);
  }

  // Unsubscribe from message types
  off(messageType: string, handler: MessageHandler) {
    const handlers = this.messageHandlers.get(messageType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private handleMessage(message: any) {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }

    // Also trigger 'all' handlers
    const allHandlers = this.messageHandlers.get('*');
    if (allHandlers) {
      allHandlers.forEach(handler => handler(message));
    }
  }

  private attemptReconnect(projectId: string, token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(projectId, token);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private getWebSocketUrl(): string {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return apiUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws';
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const collaborationService = new CollaborationService();
