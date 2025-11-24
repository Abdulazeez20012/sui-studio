import express, { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';

const router: Router = express.Router();
const execAsync = promisify(exec);

router.use(authenticateToken);

const executeSchema = z.object({
  command: z.string(),
  workingDir: z.string().optional(),
});

// Execute terminal command
router.post('/execute', async (req: AuthRequest, res) => {
  try {
    const { command, workingDir } = executeSchema.parse(req.body);

    // Security: Only allow specific Sui commands
    const allowedCommands = [
      'sui move build',
      'sui move test',
      'sui client',
      'sui move',
      'help',
      'clear',
    ];

    const isAllowed = allowedCommands.some(cmd => 
      command.startsWith(cmd) || command === cmd
    );

    if (!isAllowed) {
      return res.json({
        success: false,
        error: `Command not allowed. Allowed commands: ${allowedCommands.join(', ')}`,
        output: '',
      });
    }

    // Create a temporary working directory if not provided
    const tempDir = workingDir || path.join('/tmp', `sui-workspace-${req.userId}`);
    
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
      
      // Create a basic Move.toml if it doesn't exist
      const moveTomlPath = path.join(tempDir, 'Move.toml');
      try {
        await fs.access(moveTomlPath);
      } catch {
        const moveToml = `[package]
name = "my_project"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
my_project = "0x0"
`;
        await fs.writeFile(moveTomlPath, moveToml);
        
        // Create sources directory
        const sourcesDir = path.join(tempDir, 'sources');
        await fs.mkdir(sourcesDir, { recursive: true });
      }
    }

    // Execute command with timeout
    const { stdout, stderr } = await execAsync(command, {
      cwd: tempDir,
      timeout: 60000, // 60 seconds timeout
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    const output = stdout + (stderr ? '\n' + stderr : '');

    res.json({
      success: true,
      output: output.trim(),
      workingDir: tempDir,
    });
  } catch (error: any) {
    console.error('Command execution error:', error);
    
    // Handle execution errors
    const errorOutput = error.stderr || error.stdout || error.message;
    
    res.json({
      success: false,
      error: 'Command execution failed',
      output: errorOutput,
    });
  }
});

// Get working directory info
router.get('/workspace', async (req: AuthRequest, res) => {
  try {
    const workspaceDir = path.join('/tmp', `sui-workspace-${req.userId}`);
    
    try {
      await fs.access(workspaceDir);
      const files = await fs.readdir(workspaceDir);
      
      res.json({
        workspaceDir,
        exists: true,
        files,
      });
    } catch {
      res.json({
        workspaceDir,
        exists: false,
        files: [],
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save file to workspace
router.post('/save-file', async (req: AuthRequest, res) => {
  try {
    const { filename, content } = z.object({
      filename: z.string(),
      content: z.string(),
    }).parse(req.body);

    const workspaceDir = path.join('/tmp', `sui-workspace-${req.userId}`);
    const sourcesDir = path.join(workspaceDir, 'sources');
    
    // Ensure directories exist
    await fs.mkdir(sourcesDir, { recursive: true });
    
    // Save file
    const filePath = path.join(sourcesDir, filename);
    await fs.writeFile(filePath, content);

    res.json({
      success: true,
      filePath,
      message: 'File saved successfully',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
