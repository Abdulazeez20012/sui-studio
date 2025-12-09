import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { suiCompiler } from '../services/suiCompiler';
import * as crypto from 'crypto';
import { z } from 'zod';

const router: Router = express.Router();
const prisma = new PrismaClient();

router.use(optionalAuth);

const compileSchema = z.object({
  code: z.string(),
  packageName: z.string().optional(),
  options: z.object({
    skipFetch: z.boolean().optional(),
    testMode: z.boolean().optional(),
    generateDocs: z.boolean().optional(),
  }).optional(),
});

// Compile Move code
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { code, packageName = 'temp_package', options = {} } = compileSchema.parse(req.body);

    // Generate hash for caching
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    // Check cache (optional - skip if database not configured)
    try {
      const cached = await prisma.compilationCache.findUnique({
        where: { codeHash },
      });

      if (cached && cached.expiresAt > new Date()) {
        return res.json({
          success: cached.success,
          bytecode: cached.bytecode,
          errors: cached.errors,
          warnings: cached.warnings || [],
          cached: true,
        });
      }
    } catch (cacheError) {
      // Database not configured - skip caching
      console.log('Cache unavailable, compiling without cache');
    }

    // Compile using enhanced compiler service
    const result = await suiCompiler.compile(code, packageName, options);

    // Cache result (optional - skip if database not configured)
    try {
      await prisma.compilationCache.create({
        data: {
          codeHash,
          bytecode: result.bytecode || '',
          success: result.success,
          errors: JSON.parse(JSON.stringify(result.errors || [])),
          warnings: JSON.parse(JSON.stringify(result.warnings || [])),
          expiresAt: new Date(
            Date.now() + (result.success ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000)
          ),
        },
      });
    } catch (cacheError) {
      // Cache error shouldn't fail the request
      console.log('Cache write failed, continuing without cache');
    }

    res.json(result);
  } catch (error: any) {
    console.error('Compilation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      errors: [{
        message: error.message,
        severity: 'error',
      }],
    });
  }
});

// Estimate gas for code
router.post('/estimate-gas', async (req: AuthRequest, res) => {
  try {
    const { code } = z.object({ code: z.string() }).parse(req.body);

    // Simple heuristic-based gas estimation
    const lines = code.split('\n').length;
    const complexity = calculateComplexity(code);
    
    const baseGas = 1000;
    const gasPerLine = 50;
    const complexityMultiplier = 1 + (complexity / 100);

    const estimatedGas = Math.floor(
      (baseGas + (lines * gasPerLine)) * complexityMultiplier
    );

    res.json({
      estimatedGas,
      gasBudget: Math.ceil(estimatedGas * 1.2),
      breakdown: {
        baseGas,
        linesGas: lines * gasPerLine,
        complexityFactor: complexity,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Check compiler health
router.get('/health', async (req, res) => {
  try {
    const cliAvailable = await suiCompiler.checkSuiCLI();
    const testPassed = await suiCompiler.test();

    res.json({
      status: 'ok',
      suiCLI: cliAvailable ? 'available' : 'unavailable',
      mode: cliAvailable ? 'real' : 'simulated',
      testPassed,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// Helper function for complexity calculation
function calculateComplexity(code: string): number {
  let complexity = 0;

  // Count control structures
  complexity += (code.match(/\bif\b/g) || []).length * 2;
  complexity += (code.match(/\bwhile\b/g) || []).length * 3;
  complexity += (code.match(/\bfor\b/g) || []).length * 3;
  complexity += (code.match(/\bloop\b/g) || []).length * 4;

  // Count function calls
  complexity += (code.match(/\w+\s*\(/g) || []).length;

  // Count storage operations
  complexity += (code.match(/\btransfer\b/g) || []).length * 5;
  complexity += (code.match(/\bobject::new\b/g) || []).length * 3;

  return complexity;
}

export default router;
