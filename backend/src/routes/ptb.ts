import express from 'express';
import { z } from 'zod';
import { ptbBuilderService } from '../services/ptbBuilder';

const router = express.Router();

// Validation schemas
const createSessionSchema = z.object({
  network: z.string().optional().default('testnet'),
});

const addCommandSchema = z.object({
  sessionId: z.string(),
  type: z.enum(['moveCall', 'transferObjects', 'splitCoins', 'mergeCoins', 'makeMoveVec', 'publish']),
  params: z.any(),
});

const removeCommandSchema = z.object({
  sessionId: z.string(),
  commandId: z.string(),
});

const updateCommandSchema = z.object({
  sessionId: z.string(),
  commandId: z.string(),
  updates: z.any(),
});

const simulateSchema = z.object({
  sessionId: z.string(),
  sender: z.string(),
});

/**
 * POST /api/ptb/session
 * Create a new PTB session
 */
router.post('/session', async (req, res) => {
  try {
    const { network } = createSessionSchema.parse(req.body);
    const session = ptbBuilderService.createSession(network);

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error creating PTB session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ptb/session/:id
 * Get PTB session
 */
router.get('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = ptbBuilderService.getSession(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error fetching PTB session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ptb/sessions
 * Get all PTB sessions
 */
router.get('/sessions', async (req, res) => {
  try {
    const sessions = ptbBuilderService.getAllSessions();

    res.json({
      success: true,
      data: sessions,
    });
  } catch (error: any) {
    console.error('Error fetching PTB sessions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/command/add
 * Add command to PTB
 */
router.post('/command/add', async (req, res) => {
  try {
    const { sessionId, type, params } = addCommandSchema.parse(req.body);
    const session = ptbBuilderService.addCommand(sessionId, { type, params });

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error adding command:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/command/remove
 * Remove command from PTB
 */
router.post('/command/remove', async (req, res) => {
  try {
    const { sessionId, commandId } = removeCommandSchema.parse(req.body);
    const session = ptbBuilderService.removeCommand(sessionId, commandId);

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error removing command:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/command/update
 * Update command in PTB
 */
router.post('/command/update', async (req, res) => {
  try {
    const { sessionId, commandId, updates } = updateCommandSchema.parse(req.body);
    const session = ptbBuilderService.updateCommand(sessionId, commandId, updates);

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error updating command:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/build
 * Build transaction from PTB
 */
router.post('/build', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const { transaction, bytes } = await ptbBuilderService.buildTransaction(sessionId);

    res.json({
      success: true,
      data: {
        bytes: Array.from(bytes),
        commands: transaction.getData().commands,
      },
    });
  } catch (error: any) {
    console.error('Error building transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/simulate
 * Simulate PTB execution
 */
router.post('/simulate', async (req, res) => {
  try {
    const { sessionId, sender } = simulateSchema.parse(req.body);
    const result = await ptbBuilderService.simulateTransaction(sessionId, sender);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error simulating transaction:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/estimate-gas
 * Estimate gas for PTB
 */
router.post('/estimate-gas', async (req, res) => {
  try {
    const { sessionId, sender } = simulateSchema.parse(req.body);
    const gasEstimate = await ptbBuilderService.estimateGas(sessionId, sender);

    res.json({
      success: true,
      data: { gasEstimate },
    });
  } catch (error: any) {
    console.error('Error estimating gas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/ptb/export/:id
 * Export PTB as JSON
 */
router.get('/export/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const json = ptbBuilderService.exportSession(id);

    res.json({
      success: true,
      data: { json },
    });
  } catch (error: any) {
    console.error('Error exporting PTB:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/ptb/import
 * Import PTB from JSON
 */
router.post('/import', async (req, res) => {
  try {
    const { json } = req.body;
    const session = ptbBuilderService.importSession(json);

    res.json({
      success: true,
      data: session,
    });
  } catch (error: any) {
    console.error('Error importing PTB:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/ptb/session/:id
 * Delete PTB session
 */
router.delete('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = ptbBuilderService.deleteSession(id);

    res.json({
      success: deleted,
    });
  } catch (error: any) {
    console.error('Error deleting PTB session:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
