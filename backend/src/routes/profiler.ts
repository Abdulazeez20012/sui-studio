import express from 'express';
import { z } from 'zod';
import { profiler } from '../services/profiler';

const router = express.Router();

// Validation schemas
const profileCodeSchema = z.object({
  code: z.string(),
  packageName: z.string().optional()
});

const profileTransactionSchema = z.object({
  txDigest: z.string(),
  network: z.enum(['mainnet', 'testnet', 'devnet']).optional()
});

/**
 * POST /api/profiler/code
 * Profile Move code
 */
router.post('/code', async (req, res) => {
  try {
    const { code, packageName } = profileCodeSchema.parse(req.body);
    const profile = await profiler.profileCode(code, packageName || 'profile_package');

    res.json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    console.error('Error profiling code:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/profiler/transaction
 * Profile a blockchain transaction
 */
router.post('/transaction', async (req, res) => {
  try {
    const { txDigest, network } = profileTransactionSchema.parse(req.body);
    const profile = await profiler.profileTransaction(txDigest, network || 'testnet');

    res.json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    console.error('Error profiling transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/:id
 * Get profile by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/:id/gas
 * Get gas analysis for profile
 */
router.get('/:id/gas', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile.gasAnalysis
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
 * GET /api/profiler/:id/hotspots
 * Get performance hotspots
 */
router.get('/:id/hotspots', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Collect all hotspots from all functions
    const allHotspots = profile.functions.flatMap(f =>
      f.hotspots.map(h => ({ ...h, function: f.name, module: f.module }))
    );

    res.json({
      success: true,
      data: allHotspots
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
 * GET /api/profiler/:id/recommendations
 * Get optimization recommendations
 */
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    // Generate recommendations based on profile data
    const recommendations = [];

    // High gas functions
    const highGasFunctions = profile.functions.filter(f => f.complexity === 'high');
    if (highGasFunctions.length > 0) {
      recommendations.push({
        type: 'gas',
        severity: 'high',
        message: `${highGasFunctions.length} function(s) have high gas usage`,
        functions: highGasFunctions.map(f => f.name),
        suggestion: 'Review these functions for optimization opportunities'
      });
    }

    // Memory usage
    if (profile.memoryAnalysis.objectsCreated > 10) {
      recommendations.push({
        type: 'memory',
        severity: 'medium',
        message: `High object creation count: ${profile.memoryAnalysis.objectsCreated}`,
        suggestion: 'Consider object pooling or reducing allocations'
      });
    }

    // Hotspots with suggestions
    profile.functions.forEach(f => {
      f.hotspots.forEach(h => {
        if (h.suggestion) {
          recommendations.push({
            type: 'hotspot',
            severity: h.gasCost > 1000 ? 'high' : 'medium',
            message: `${h.operation} at line ${h.line} in ${f.name}`,
            suggestion: h.suggestion,
            function: f.name
          });
        }
      });
    });

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
 * GET /api/profiler/:id/functions
 * Get function profiles
 */
router.get('/:id/functions', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile.functions
    });
  } catch (error: any) {
    console.error('Error fetching functions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/profiler/:id/memory
 * Get memory analysis
 */
router.get('/:id/memory', async (req, res) => {
  try {
    const { id } = req.params;
    const profile = profiler.getProfile(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile.memoryAnalysis
    });
  } catch (error: any) {
    console.error('Error fetching memory analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/profiler/compare
 * Compare two profiles
 */
router.post('/compare', async (req, res) => {
  try {
    const { id1, id2 } = req.body;
    const comparison = profiler.compareProfiles(id1, id2);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        error: 'One or both profiles not found'
      });
    }

    res.json({
      success: true,
      data: comparison
    });
  } catch (error: any) {
    console.error('Error comparing profiles:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
