import express, { Router } from 'express';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

const router: Router = express.Router();
const execAsync = promisify(exec);

router.use(optionalAuth);

const executeCommandSchema = z.object({
  terminalId: z.string(),
  command: z.string(),
  cwd: z.string().optional(),
  env: z.record(z.string()).optional(),
});

// Execute terminal command
router.post('/session/execute', async (req: AuthRequest, res) => {
  try {
    const { terminalId, command, cwd, env } = executeCommandSchema.parse(req.body);

    // Handle built-in commands
    if (command === 'clear') {
      return res.json({ success: true, output: '', builtin: true });
    }

    if (command === 'help') {
      const helpText = `Available commands:
  Sui Development:
    sui move build    - Build Move package
    sui move test     - Run Move tests
    sui client        - Sui client commands
    
  Node.js:
    npm install       - Install dependencies
    npm run dev       - Run development server
    yarn/pnpm         - Alternative package managers
    
  Git:
    git status        - Check repository status
    git add/commit    - Stage and commit changes
    git push/pull     - Sync with remote
    
  File Operations:
    ls, cat, grep, find, mkdir, rm, cp, mv
    
  System:
    pwd, whoami, date, ps, which
    
  Built-in:
    clear             - Clear terminal
    help              - Show this help`;
      
      return res.json({ success: true, output: helpText, builtin: true });
    }

    // Get working directory
    const workingDir = cwd || os.homedir();
    
    // Ensure directory exists
    try {
      await fs.access(workingDir);
    } catch {
      return res.json({
        success: false,
        error: `Directory not found: ${workingDir}`
      });
    }

    // Command validation - allow most development commands
    const allowedPatterns = [
      /^sui\s+/,                    // Sui commands
      /^(npm|yarn|pnpm|node|npx)\s+/, // Node.js
      /^git\s+/,                    // Git
      /^(ls|cat|grep|find|mkdir|rm|cp|mv|touch|chmod|head|tail|wc|sort|uniq|echo|pwd|whoami|date|which|whereis)\s*/,
      /^(pip|cargo|go|rustc|python|python3)\s+/, // Other languages
    ];

    const isAllowed = allowedPatterns.some(pattern => pattern.test(command));
    
    if (!isAllowed) {
      return res.json({
        success: false,
        error: `Command not allowed: ${command}`,
        output: `Command restricted. Use 'help' for available commands.`,
      });
    }

    // Execute command
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: workingDir,
        env: { ...process.env, ...env },
        timeout: 60000, // 60 seconds
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });

      const output = stdout + (stderr ? '\n' + stderr : '');
      
      res.json({
        success: true,
        output: output.trim(),
        cwd: workingDir,
      });
    } catch (error: any) {
      // Command execution error
      const errorOutput = error.stderr || error.stdout || error.message;
      
      res.json({
        success: false,
        error: 'Command execution failed',
        output: errorOutput.trim(),
      });
    }
  } catch (error: any) {
    console.error('Terminal error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Legacy execute endpoint (backward compatibility)
router.post('/execute', async (req: AuthRequest, res) => {
  try {
    const { command, workingDir } = z.object({
      command: z.string(),
      workingDir: z.string().optional(),
    }).parse(req.body);

    // Handle built-in commands
    if (command === 'help') {
      return res.json({
        success: true,
        output: `Available commands:
  sui move build    - Build Move package
  sui move test     - Run Move tests
  sui client        - Sui client commands
  npm/yarn          - Node.js commands
  git               - Git commands
  clear             - Clear terminal
  help              - Show this help`,
      });
    }

    if (command === 'clear') {
      return res.json({
        success: true,
        output: '',
      });
    }

    // Security: Only allow specific commands
    const allowedCommands = [
      'sui move build',
      'sui move test',
      'sui client',
      'sui move',
      'npm',
      'yarn',
      'git',
      'ls',
      'pwd',
      'cat',
    ];

    const isAllowed = allowedCommands.some(cmd => 
      command.startsWith(cmd) || command === cmd
    );

    if (!isAllowed) {
      return res.json({
        success: false,
        error: `Command not allowed: ${command}`,
        output: `Command restricted. Use 'help' for available commands.`,
      });
    }

    // Check if Sui CLI is installed
    try {
      await execAsync('sui --version', { timeout: 5000 });
    } catch (error) {
      // Sui CLI not installed, return simulated output
      return res.json({
        success: true,
        output: simulateCommand(command),
        simulated: true,
      });
    }

    // Create temporary working directory
    const tempDir = workingDir || path.join(os.tmpdir(), `sui-workspace-${req.userId || 'anonymous'}`);
    
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
      
      // Create basic Move.toml
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

    // Execute command
    const { stdout, stderr } = await execAsync(command, {
      cwd: tempDir,
      timeout: 60000,
      maxBuffer: 1024 * 1024 * 10,
    });

    const output = stdout + (stderr ? '\n' + stderr : '');

    res.json({
      success: true,
      output: output.trim(),
      workingDir: tempDir,
    });
  } catch (error: any) {
    console.error('Command execution error:', error);
    
    const errorOutput = error.stderr || error.stdout || error.message;
    
    res.json({
      success: false,
      error: 'Command execution failed',
      output: errorOutput,
    });
  }
});

// Simulate command output when Sui CLI is not available
function simulateCommand(command: string): string {
  if (command.includes('sui move build')) {
    return `BUILDING MovePackage
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING my_project
Build Successful

Note: This is simulated output. Install Sui CLI for real compilation.`;
  }

  if (command.includes('sui move test')) {
    return `Running Move unit tests
[ PASS    ] 0x0::my_module::test_create
[ PASS    ] 0x0::my_module::test_transfer
Test result: OK. Total tests: 2; passed: 2; failed: 0

Note: This is simulated output. Install Sui CLI for real testing.`;
  }

  return `Command executed: ${command}\n\nNote: Sui CLI not installed. This is simulated output.`;
}

export default router;
