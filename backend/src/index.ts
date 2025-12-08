import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { CollaborationServer } from './websocket/CollaborationServer';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import projectInitRoutes from './routes/project-init';
import compileRoutes from './routes/compile';
import deployRoutes from './routes/deploy';
import suiRoutes from './routes/sui';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import extensionsRoutes from './routes/extensions';
import terminalRoutes from './routes/terminal';
import yjsRoutes, { setupYjsWebSocket } from './routes/yjs';
import gitRoutes from './routes/git';
import formatRoutes from './routes/format';
import testRoutes from './routes/test';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for WebSocket
const server = createServer(app);

// Middleware - Allow multiple origins for Vercel preview deployments
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://suistudio.live',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow Vercel preview deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-init', projectInitRoutes);
app.use('/api/compile', compileRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/sui', suiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/extensions', extensionsRoutes);
app.use('/api/terminal', terminalRoutes);
app.use('/api/yjs', yjsRoutes);
app.use('/api/git', gitRoutes);
app.use('/api/format', formatRoutes);
app.use('/api/test', testRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize WebSocket server
const collaborationServer = new CollaborationServer(server);

// Initialize Yjs WebSocket server on /yjs path
const yjsWss = new WebSocketServer({ 
  server, 
  path: '/yjs',
  verifyClient: (info) => {
    // Allow all origins for now, add auth later if needed
    return true;
  }
});
setupYjsWebSocket(yjsWss);

// WebSocket status endpoint
app.get('/api/collaboration/room/:projectId', (req, res) => {
  const roomInfo = collaborationServer.getRoomInfo(req.params.projectId);
  if (roomInfo) {
    res.json(roomInfo);
  } else {
    res.status(404).json({ error: 'Room not found' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Sui Studio Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`⛓️  Sui Network: ${process.env.SUI_NETWORK}`);
  console.log(`🔌 WebSocket server ready at ws://localhost:${PORT}/ws`);
  console.log(`📝 Yjs collaboration server ready at ws://localhost:${PORT}/yjs`);
});

export default app;
