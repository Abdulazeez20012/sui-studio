import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { moveFormatter } from '../services/moveFormatter';
import { z } from 'zod';

const router = express.Router();

// Apply authentication
router.use(authenticateToken);

const formatSchema = z.object({
  code: z.string(),
  options: z.object({
    indentSize: z.number().optional(),
    useTabs: z.boolean().optional(),
    maxLineLength: z.number().optional(),
    insertFinalNewline: z.boolean().optional(),
  }).optional(),
});

// Format code
router.post('/format', async (req: AuthRequest, res) => {
  try {
    const { code, options } = formatSchema.parse(req.body);
    
    const formatted = moveFormatter.format(code, options);
    
    res.json({
      success: true,
      formatted,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Lint code
router.post('/lint', async (req: AuthRequest, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    
    const issues = moveFormatter.lint(code);
    
    res.json({
      success: true,
      issues,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get suggestions
router.post('/suggestions', async (req: AuthRequest, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    
    const suggestions = moveFormatter.getSuggestions(code);
    
    res.json({
      success: true,
      suggestions,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Auto-fix code
router.post('/autofix', async (req: AuthRequest, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);
    
    const fixed = moveFormatter.autoFix(code);
    
    res.json({
      success: true,
      fixed,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
