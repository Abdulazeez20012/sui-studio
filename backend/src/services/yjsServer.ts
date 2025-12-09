import * as Y from 'yjs';
import { WebSocket } from 'ws';

export interface YjsDocument {
  doc: Y.Doc;
  connections: Set<WebSocket>;
  lastAccessed: number;
}

export class YjsCollaborationServer {
  private documents: Map<string, YjsDocument> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup inactive documents every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  handleConnection(ws: WebSocket, docName: string, userId?: string) {
    // Get or create document
    let yjsDoc = this.documents.get(docName);
    if (!yjsDoc) {
      yjsDoc = {
        doc: new Y.Doc(),
        connections: new Set(),
        lastAccessed: Date.now(),
      };
      this.documents.set(docName, yjsDoc);
    }

    yjsDoc.connections.add(ws);
    yjsDoc.lastAccessed = Date.now();

    // Send initial state to new client
    const state = Y.encodeStateAsUpdate(yjsDoc.doc);
    this.send(ws, { type: 'sync', data: state });

    // Handle incoming messages
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(ws, docName, message);
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      yjsDoc?.connections.delete(ws);
      if (yjsDoc && yjsDoc.connections.size === 0) {
        // Keep document for 5 minutes after last user disconnects
        setTimeout(() => {
          const doc = this.documents.get(docName);
          if (doc && doc.connections.size === 0) {
            this.documents.delete(docName);
          }
        }, 5 * 60 * 1000);
      }
    });

    // Send user joined notification
    this.broadcast(docName, {
      type: 'user-joined',
      userId,
      timestamp: Date.now(),
    }, ws);
  }

  private handleMessage(ws: WebSocket, docName: string, message: any) {
    const yjsDoc = this.documents.get(docName);
    if (!yjsDoc) return;

    switch (message.type) {
      case 'update':
        // Apply update to document
        const update = new Uint8Array(message.data);
        Y.applyUpdate(yjsDoc.doc, update);
        
        // Broadcast to other clients
        this.broadcast(docName, message, ws);
        break;

      case 'awareness':
        // Broadcast awareness (cursor position, selection, etc.)
        this.broadcast(docName, message, ws);
        break;

      case 'sync-request':
        // Send full document state
        const state = Y.encodeStateAsUpdate(yjsDoc.doc);
        this.send(ws, { type: 'sync', data: Array.from(state) });
        break;
    }
  }

  private broadcast(docName: string, message: any, exclude?: WebSocket) {
    const yjsDoc = this.documents.get(docName);
    if (!yjsDoc) return;

    const data = JSON.stringify(message);
    yjsDoc.connections.forEach((client) => {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private send(ws: WebSocket, message: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  private cleanup() {
    const now = Date.now();
    const timeout = 30 * 60 * 1000; // 30 minutes

    this.documents.forEach((yjsDoc, docName) => {
      if (yjsDoc.connections.size === 0 && now - yjsDoc.lastAccessed > timeout) {
        this.documents.delete(docName);
      }
    });
  }

  getStats() {
    return {
      documents: this.documents.size,
      connections: Array.from(this.documents.values()).reduce(
        (sum, doc) => sum + doc.connections.size,
        0
      ),
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.documents.clear();
  }
}

export const yjsServer = new YjsCollaborationServer();
