import express from 'express';
import { editorMonitoringService } from '../services/EditorMonitoringService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get real-time content of any file
router.get('/file/:projectId/:fileName', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId, fileName } = req.params;
    const content = editorMonitoringService.getFileContent(projectId, fileName);
    
    res.json({
      success: true,
      content,
      fileName,
      projectId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get file content' });
  }
});

// Get all files in a project
router.get('/project/:projectId/files', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const files = editorMonitoringService.getProjectFiles(projectId);
    
    res.json({
      success: true,
      files,
      projectId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get project files' });
  }
});

// Get activity history for a file
router.get('/history/:projectId/:fileName', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { projectId, fileName } = req.params;
    const history = await editorMonitoringService.getFileHistory(projectId, fileName);
    
    res.json({
      success: true,
      history,
      fileName,
      projectId
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get file history' });
  }
});

// Get live statistics
router.get('/stats', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const stats = editorMonitoringService.getLiveStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

// Search across all content
router.get('/search', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }
    
    const results = editorMonitoringService.searchContent(q);
    
    res.json({
      success: true,
      query: q,
      results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to search content' });
  }
});

// Real-time monitoring endpoint (Server-Sent Events)
router.get('/live', authenticateToken, (req: AuthRequest, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`);

  // Send stats every 5 seconds
  const interval = setInterval(() => {
    const stats = editorMonitoringService.getLiveStats();
    res.write(`data: ${JSON.stringify({ type: 'stats', data: stats, timestamp: new Date() })}\n\n`);
  }, 5000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

export default router;