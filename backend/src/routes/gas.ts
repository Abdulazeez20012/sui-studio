import express from 'express';
import { z } from 'zod';
import { gasAnalyzer } from '../services/gasAnalyzer';

const router = express.Router();

// Validation schemas
const analyzeGasSchema = z.object({
  code: z.string()
});

const compareAnalysesSchema = z.object({
  beforeId: z.string(),
  afterId: z.string()
});

const transactionEstimateSchema = z.object({
  transactionType: z.enum(['simple_transfer', 'nft_mint', 'defi_swap', 'package_publish'])
});

/**
 * POST /api/gas/analyze
 * Analyze gas usage for Move code
 */
router.post('/analyze', async (req, res) => {
  try {
    const { code } = analyzeGasSchema.parse(req.body);
    const analysis = await gasAnalyzer.analyzeGas(code);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    console.error('Error analyzing gas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/gas/analysis/:id
 * Get gas analysis by ID
 */
router.get('/analysis/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = gasAnalyzer.getAnalysis(id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });
  } catch (error: any) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/gas/compare
 * Compare two gas analyses
 */
router.post('/compare', async (req, res) => {
  try {
    const { beforeId, afterId } = compareAnalysesSchema.parse(req.body);
    const comparison = gasAnalyzer.compareAnalyses(beforeId, afterId);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        error: 'One or both analyses not found'
      });
    }

    res.json({
      success: true,
      data: comparison
    });
  } catch (error: any) {
    console.error('Error comparing analyses:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/gas/transaction-estimate
 * Get gas estimate for transaction type
 */
router.post('/transaction-estimate', async (req, res) => {
  try {
    const { transactionType } = transactionEstimateSchema.parse(req.body);
    const estimate = gasAnalyzer.getTransactionGasEstimate(transactionType);

    const totalGas = Object.values(estimate).reduce((sum, value) => sum + value, 0);

    res.json({
      success: true,
      data: {
        transactionType,
        totalGas,
        breakdown: estimate
      }
    });
  } catch (error: any) {
    console.error('Error getting transaction estimate:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/gas/analysis/:id/report
 * Generate optimization report
 */
router.get('/analysis/:id/report', async (req, res) => {
  try {
    const { id } = req.params;
    const report = gasAnalyzer.generateOptimizationReport(id);

    res.json({
      success: true,
      data: {
        report,
        format: 'markdown'
      }
    });
  } catch (error: any) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;