import express, { Router } from 'express';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { syntaxCheckerService } from '../services/syntaxChecker';

const router: Router = express.Router();

router.use(optionalAuth);

const checkSyntaxSchema = z.object({
  code: z.string(),
  filename: z.string().optional(),
  quick: z.boolean().optional()
});

// Check syntax
router.post('/check', async (req: AuthRequest, res) => {
  try {
    const { code, filename, quick } = checkSyntaxSchema.parse(req.body);

    if (quick) {
      // Quick check without compilation
      const issues = await syntaxCheckerService.quickCheck(code);
      
      return res.json({
        success: true,
        issues,
        summary: {
          errors: issues.filter(i => i.severity === 'error').length,
          warnings: issues.filter(i => i.severity === 'warning').length,
          info: issues.filter(i => i.severity === 'info').length,
          hints: issues.filter(i => i.severity === 'hint').length
        },
        quick: true
      });
    }

    // Full syntax check with compilation
    const result = await syntaxCheckerService.checkSyntax(code, filename || 'main.move');
    
    res.json(result);
  } catch (error: any) {
    console.error('Syntax check error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      issues: [],
      summary: { errors: 0, warnings: 0, info: 0, hints: 0 }
    });
  }
});

export default router;
