import { Router } from 'express';
import { WebSocketServer } from 'ws';
import { yjsServer } from '../services/yjsServer';

const router = Router();

// Stats endpoint
router.get('/stats', (req, res) => {
  const stats = yjsServer.getStats();
  res.json(stats);
});

// Document info endpoint
router.get('/document/:docId', (req, res) => {
  const { docId } = req.params;
  const stats = yjsServer.getStats();
  
  res.json({
    documentId: docId,
    exists: true, // We create docs on demand
    ...stats,
  });
});

export default router;

// Export function to setup WebSocket handling
export function setupYjsWebSocket(wss: WebSocketServer) {
  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const docName = url.searchParams.get('doc');
    const userId = url.searchParams.get('userId');

    if (!docName) {
      ws.close(1008, 'Document name required');
      return;
    }

    console.log(`Yjs connection: doc=${docName}, user=${userId}`);
    yjsServer.handleConnection(ws, docName, userId || undefined);
  });
}
