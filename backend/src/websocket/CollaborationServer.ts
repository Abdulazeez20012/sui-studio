import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';
import { editorMonitoringService } from '../services/EditorMonitoringService';

interface Client {
  ws: WebSocket;
  userId: string;
  userName: string;
  projectId: string;
  cursorPosition?: { line: number; column: number };
  selection?: { start: any; end: any };
}

interface Room {
  projectId: string;
  clients: Map<string, Client>;
  documentState: string;
  version: number;
}

export class CollaborationServer {
  private wss: WebSocketServer;
  private rooms: Map<string, Room> = new Map();
  private clientToRoom: Map<WebSocket, string> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('New WebSocket connection');

      // Authenticate connection
      const token = this.extractToken(req.url || '');
      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        this.handleConnection(ws, decoded);
      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });
  }

  private extractToken(url: string): string | null {
    const params = new URLSearchParams(url.split('?')[1]);
    return params.get('token');
  }

  private handleConnection(ws: WebSocket, user: any) {
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, message, user);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    ws.on('close', () => {
      this.handleDisconnect(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  private handleMessage(ws: WebSocket, message: any, user: any) {
    switch (message.type) {
      case 'join':
        this.handleJoin(ws, message, user);
        break;
      case 'leave':
        this.handleLeave(ws);
        break;
      case 'edit':
        this.handleEdit(ws, message);
        break;
      case 'cursor':
        this.handleCursor(ws, message);
        break;
      case 'selection':
        this.handleSelection(ws, message);
        break;
      case 'save':
        this.handleSave(ws, message);
        break;
      case 'webrtc-signal':
        this.handleWebRTCSignal(ws, message);
        break;
      case 'webrtc-join-room':
        this.handleWebRTCJoinRoom(ws, message);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private handleWebRTCSignal(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    const { targetPeerId, signal } = message;
    const sender = this.getClientByWs(ws, room);

    // Forward signal to target peer
    for (const client of room.clients.values()) {
      if (client.userId === targetPeerId) {
        this.sendToClient(client.ws, {
          type: 'webrtc-signal',
          fromPeerId: sender?.userId,
          fromName: sender?.userName,
          signal,
        });
        break;
      }
    }
  }

  private handleWebRTCJoinRoom(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    const sender = this.getClientByWs(ws, room);
    const { peerId } = message;

    // Notify all other clients about new peer
    this.broadcastToRoom(projectId, {
      type: 'webrtc-peer-joined',
      peerId,
      userId: sender?.userId,
      userName: sender?.userName,
    }, sender?.userId);

    // Send list of existing peers to new joiner
    const existingPeers = Array.from(room.clients.values())
      .filter(c => c.userId !== sender?.userId)
      .map(c => ({
        peerId: c.userId,
        userId: c.userId,
        userName: c.userName,
      }));

    this.sendToClient(ws, {
      type: 'webrtc-existing-peers',
      peers: existingPeers,
    });
  }

  private handleJoin(ws: WebSocket, message: any, user: any) {
    const { projectId } = message;

    if (!this.rooms.has(projectId)) {
      this.rooms.set(projectId, {
        projectId,
        clients: new Map(),
        documentState: '',
        version: 0,
      });
    }

    const room = this.rooms.get(projectId)!;
    const client: Client = {
      ws,
      userId: user.userId,
      userName: user.user.name,
      projectId,
    };

    room.clients.set(user.userId, client);
    this.clientToRoom.set(ws, projectId);

    // Send current state to new client
    this.sendToClient(ws, {
      type: 'init',
      documentState: room.documentState,
      version: room.version,
      clients: Array.from(room.clients.values()).map(c => ({
        userId: c.userId,
        userName: c.userName,
        cursorPosition: c.cursorPosition,
        selection: c.selection,
      })),
    });

    // Notify others about new client
    this.broadcastToRoom(projectId, {
      type: 'user-joined',
      userId: user.userId,
      userName: user.user.name,
    }, user.userId);

    console.log(`User ${user.user.name} joined project ${projectId}`);
  }

  private handleLeave(ws: WebSocket) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    // Find and remove client
    let removedUserId: string | null = null;
    for (const [userId, client] of room.clients.entries()) {
      if (client.ws === ws) {
        room.clients.delete(userId);
        removedUserId = userId;
        break;
      }
    }

    this.clientToRoom.delete(ws);

    // Notify others
    if (removedUserId) {
      this.broadcastToRoom(projectId, {
        type: 'user-left',
        userId: removedUserId,
      });
    }

    // Clean up empty rooms
    if (room.clients.size === 0) {
      this.rooms.delete(projectId);
    }
  }

  private handleEdit(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    const { changes, version, fileName } = message;

    // Validate version (simple OT)
    if (version !== room.version) {
      this.sendToClient(ws, {
        type: 'sync-required',
        currentVersion: room.version,
      });
      return;
    }

    // Apply changes
    const oldContent = room.documentState;
    room.documentState = this.applyChanges(room.documentState, changes);
    room.version++;

    // Get client info
    const client = this.getClientByWs(ws, room);
    
    // 🔍 LOG EVERY EDIT - This monitors all code changes
    if (client) {
      editorMonitoringService.logEditorEvent({
        type: 'edit',
        userId: client.userId,
        userName: client.userName,
        projectId,
        fileName: fileName || 'untitled.move',
        content: room.documentState
      });
    }

    // Broadcast to all clients except sender
    this.broadcastToRoom(projectId, {
      type: 'edit',
      changes,
      version: room.version,
      userId: client?.userId,
    }, client?.userId);
  }

  private handleCursor(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    const client = this.getClientByWs(ws, room);
    if (!client) return;

    client.cursorPosition = message.position;

    // 🔍 LOG CURSOR MOVEMENT - Track where users are looking
    editorMonitoringService.logEditorEvent({
      type: 'cursor',
      userId: client.userId,
      userName: client.userName,
      projectId,
      fileName: message.fileName || 'untitled.move',
      position: message.position
    });

    // Broadcast cursor position
    this.broadcastToRoom(projectId, {
      type: 'cursor',
      userId: client.userId,
      position: message.position,
    }, client.userId);
  }

  private handleSelection(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    const client = this.getClientByWs(ws, room);
    if (!client) return;

    client.selection = message.selection;

    // Broadcast selection
    this.broadcastToRoom(projectId, {
      type: 'selection',
      userId: client.userId,
      selection: message.selection,
    }, client.userId);
  }

  private handleSave(ws: WebSocket, message: any) {
    const projectId = this.clientToRoom.get(ws);
    if (!projectId) return;

    const room = this.rooms.get(projectId);
    if (!room) return;

    room.documentState = message.content;

    const client = this.getClientByWs(ws, room);

    // 🔍 LOG EVERY SAVE - Capture complete file content
    if (client) {
      editorMonitoringService.logEditorEvent({
        type: 'save',
        userId: client.userId,
        userName: client.userName,
        projectId,
        fileName: message.fileName || 'untitled.move',
        content: message.content
      });
    }

    // Notify all clients
    this.broadcastToRoom(projectId, {
      type: 'saved',
      version: room.version,
    });
  }

  private handleDisconnect(ws: WebSocket) {
    this.handleLeave(ws);
  }

  private applyChanges(content: string, changes: any[]): string {
    let result = content;
    
    // Sort changes by position (reverse order to maintain positions)
    const sortedChanges = [...changes].sort((a, b) => b.offset - a.offset);

    for (const change of sortedChanges) {
      if (change.type === 'insert') {
        result = result.slice(0, change.offset) + change.text + result.slice(change.offset);
      } else if (change.type === 'delete') {
        result = result.slice(0, change.offset) + result.slice(change.offset + change.length);
      }
    }

    return result;
  }

  private getClientByWs(ws: WebSocket, room: Room): Client | undefined {
    for (const client of room.clients.values()) {
      if (client.ws === ws) {
        return client;
      }
    }
    return undefined;
  }

  private sendToClient(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private broadcastToRoom(projectId: string, message: any, excludeUserId?: string) {
    const room = this.rooms.get(projectId);
    if (!room) return;

    for (const client of room.clients.values()) {
      if (client.userId !== excludeUserId) {
        this.sendToClient(client.ws, message);
      }
    }
  }

  public getRoomInfo(projectId: string) {
    const room = this.rooms.get(projectId);
    if (!room) return null;

    return {
      projectId,
      clientCount: room.clients.size,
      version: room.version,
      clients: Array.from(room.clients.values()).map(c => ({
        userId: c.userId,
        userName: c.userName,
      })),
    };
  }
}
