import express from 'express';
import { z } from 'zod';
import { profilerService } from '../services/profiler';

const router = express.Router();

// Validation schemas
const createSessionSchema = z.object({
  code: z.string()
});

const startProfilingSchema = z.object({
  sampleRate: z.number().optional(),
  includeMemory: z.boolean().optional(),
  includeGas: z.boolean().optional(),
  duration: z.number().optional()
});

/**
 * POST /api/profiler/session
 * Create a new profiling session
 */
router.post('/session', async (req, res) => {
  try {
    const { code } = createSessionSchema.parse(req.body);
    const session = profilerService.createSession(code);

    res.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error creating profiling session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/session/:id
 * Get profiling session
 */
router.get('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = profilerService.getSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/profiler/session/:id/start
 * Start profiling
 */
router.post('/session/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const options = startProfilingSchema.parse(req.body);
    const session = await profilerService.startProfiling(id, options);

    res.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error starting profiling:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/profiler/session/:id/stop
 * Stop profiling
 */
router.post('/session/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const session = await profilerService.stopProfiling(id);

    res.json({
      success: true,
      data: session
    });
  } catch (error: any) {
    console.error('Error stopping profiling:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/session/:id/gas-analysis
 * Get gas analysis
 */
router.get('/session/:id/gas-analysis', async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = profilerService.getGasAnalysis(id);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    console.error('Error fetching gas analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/session/:id/hotspots
 * Get performance hotspots
 */
router.get('/session/:id/hotspots', async (req, res) => {
  try {
    const { id } = req.params;
    const hotspots = profilerService.getHotspots(id);

    res.json({
      success: true,
      data: hotspots
    });
  } catch (error: any) {
    console.error('Error fetching hotspots:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/session/:id/recommendations
 * Get optimization recommendations
 */
router.get('/session/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const recommendations = profilerService.getRecommendations(id);

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error: any) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/session/:id/export
 * Export profile data
 */
router.get('/session/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const json = profilerService.exportProfile(id);

    res.json({
      success: true,
      data: { json }
    });
  } catch (error: any) {
    console.error('Error exporting profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
