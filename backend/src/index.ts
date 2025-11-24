import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { CollaborationServer } from './websocket/CollaborationServer';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import compileRoutes from './routes/compile';
import deployRoutes from './routes/deploy';
import suiRoutes from './routes/sui';
import analyticsRoutes from './routes/analytics';
import aiRoutes from './routes/ai';
import extensionsRoutes from './routes/extensions';

const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server for WebSocket
const server = createServer(app);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
app.use('/api/compile', compileRoutes);
app.use('/api/deploy', deployRoutes);
app.use('/api/sui', suiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/extensions', extensionsRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
});

export default app;
