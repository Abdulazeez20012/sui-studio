import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();
const execAsync = promisify(exec);

router.use(authenticateToken);

const compileSchema = z.object({
  code: z.string(),
  packageName: z.string().optional(),
});

// Compile Move code
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { code, packageName = 'temp_package' } = compileSchema.parse(req.body);

    // Generate hash for caching
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    // Check cache
    const cached = await prisma.compilationCache.findUnique({
      where: { codeHash },
    });

    if (cached && cached.expiresAt > new Date()) {
      return res.json({
        success: cached.success,
        bytecode: cached.bytecode,
        errors: cached.errors,
        cached: true,
      });
    }

    // Create temporary directory
    const tempDir = path.join('/tmp', `sui-compile-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Create Move.toml
      const moveToml = `[package]
name = "${packageName}"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"
`;

      await fs.writeFile(path.join(tempDir, 'Move.toml'), moveToml);

      // Create sources directory
      const sourcesDir = path.join(tempDir, 'sources');
      await fs.mkdir(sourcesDir);

      // Write Move code
      await fs.writeFile(path.join(sourcesDir, 'main.move'), code);

      // Compile using Sui CLI
      const { stdout, stderr } = await execAsync(
        `sui move build --path ${tempDir}`,
        { timeout: 30000 }
      );

      // Read compiled bytecode
      const buildDir = path.join(tempDir, 'build', packageName);
      const bytecodeFiles = await fs.readdir(path.join(buildDir, 'bytecode_modules'));
      
      let bytecode = '';
      if (bytecodeFiles.length > 0) {
        const bytecodeContent = await fs.readFile(
          path.join(buildDir, 'bytecode_modules', bytecodeFiles[0])
        );
        bytecode = bytecodeContent.toString('base64');
      }

      // Cache successful compilation
      await prisma.compilationCache.create({
        data: {
          codeHash,
          bytecode,
          success: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      res.json({
        success: true,
        bytecode,
        message: 'Compilation successful',
        cached: false,
      });
    } catch (error: any) {
      // Parse compilation errors
      const errors = parseCompilationErrors(error.stderr || error.message);

      // Cache failed compilation
      await prisma.compilationCache.create({
        data: {
          codeHash,
          bytecode: '',
          success: false,
          errors: errors,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      res.json({
        success: false,
        errors,
        message: 'Compilation failed',
        cached: false,
      });
    } finally {
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  } catch (error: any) {
    console.error('Compilation error:', error);
    res.status(500).json({ error: error.message });
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

// Helper functions
function parseCompilationErrors(stderr: string): any[] {
  const errors: any[] = [];
  const lines = stderr.split('\n');

  for (const line of lines) {
    if (line.includes('error') || line.includes('Error')) {
      errors.push({
        message: line.trim(),
        severity: 'error',
      });
    }
  }

  return errors;
}

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
