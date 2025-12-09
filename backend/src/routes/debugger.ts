import express from 'express';
import { z } from 'zod';
import { debuggerService } from '../services/debugger';

const router = express.Router();

// Validation schemas
const createSessionSchema = z.object({
  projectPath: z.string().optional().default('/tmp/sui-project'),
  code: z.string()
});

const commandSchema = z.object({
  sessionId: z.string(),
  type: z.enum(['start', 'stop', 'pause', 'continue', 'step-over', 'step-into', 'step-out'])
});

const breakpointSchema = z.object({
  sessionId: z.string(),
  file: z.string(),
  line: z.number(),
  condition: z.string().optional()
});

const evaluateSchema = z.object({
  sessionId: z.string(),
  expression: z.string()
});

/**
 * POST /api/debugger/session
 * Create a new debug session
 */
router.post('/session', async (req, res) => {
  try {
    const { projectPath, code } = createSessionSchema.parse(req.body);
    const result = await debuggerService.createSession(projectPath, code);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.session
    });
  } catch (error: any) {
    console.error('Error creating debug session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/debugger/session/:id
 * Get debug session details
 */
router.get('/session/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const session = debuggerService.getSession(id);

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
 * POST /api/debugger/command
 * Execute debug command
 */
router.post('/command', async (req, res) => {
  try {
    const { sessionId, type } = commandSchema.parse(req.body);

    let result;
    switch (type) {
      case 'start':
        result = await debuggerService.startDebugging(sessionId);
        break;
      case 'stop':
        result = await debuggerService.stopDebugging(sessionId);
        break;
      case 'pause':
        result = await debuggerService.pauseExecution(sessionId);
        break;
      case 'continue':
        result = await debuggerService.continueExecution(sessionId);
        break;
      case 'step-over':
        result = await debuggerService.stepOver(sessionId);
        break;
      case 'step-into':
        result = await debuggerService.stepInto(sessionId);
        break;
      case 'step-out':
        result = await debuggerService.stepOut(sessionId);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid command type'
        });
    }

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.session
    });
  } catch (error: any) {
    console.error('Error executing command:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/debugger/breakpoint
 * Add breakpoint
 */
router.post('/breakpoint', async (req, res) => {
  try {
    const { sessionId, file, line, condition } = breakpointSchema.parse(req.body);
    const result = await debuggerService.addBreakpoint(sessionId, file, line, condition);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.session
    });
  } catch (error: any) {
    console.error('Error adding breakpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/debugger/breakpoint/:sessionId/:breakpointId
 * Remove breakpoint
 */
router.delete('/breakpoint/:sessionId/:breakpointId', async (req, res) => {
  try {
    const { sessionId, breakpointId } = req.params;
    const result = await debuggerService.removeBreakpoint(sessionId, breakpointId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.session
    });
  } catch (error: any) {
    console.error('Error removing breakpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/debugger/breakpoint/:sessionId/:breakpointId/toggle
 * Toggle breakpoint
 */
router.put('/breakpoint/:sessionId/:breakpointId/toggle', async (req, res) => {
  try {
    const { sessionId, breakpointId } = req.params;
    const result = await debuggerService.toggleBreakpoint(sessionId, breakpointId);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.session
    });
  } catch (error: any) {
    console.error('Error toggling breakpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/debugger/variables/:sessionId
 * Get variables in current scope
 */
router.get('/variables/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const variables = await debuggerService.getVariables(sessionId);

    res.json({
      success: true,
      data: variables
    });
  } catch (error: any) {
    console.error('Error fetching variables:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/debugger/evaluate
 * Evaluate expression
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { sessionId, expression } = evaluateSchema.parse(req.body);
    const result = await debuggerService.evaluateExpression(sessionId, expression);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Error evaluating expression:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
