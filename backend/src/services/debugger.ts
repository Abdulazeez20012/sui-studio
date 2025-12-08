import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface Breakpoint {
  id: string;
  file: string;
  line: number;
  enabled: boolean;
  condition?: string;
}

export interface StackFrame {
  id: string;
  function: string;
  module: string;
  file: string;
  line: number;
  column?: number;
}

export interface Variable {
  name: string;
  value: string;
  type: string;
  scope: 'local' | 'global' | 'parameter';
  mutable: boolean;
}

export interface DebugSession {
  id: string;
  projectPath: string;
  status: 'idle' | 'running' | 'paused' | 'stopped';
  currentLine?: number;
  currentFile?: string;
  breakpoints: Breakpoint[];
  stackFrames: StackFrame[];
  variables: Variable[];
  output: string[];
  createdAt: Date;
}

export interface DebugCommand {
  type: 'start' | 'stop' | 'pause' | 'continue' | 'step-over' | 'step-into' | 'step-out';
  sessionId: string;
  data?: any;
}

export interface DebugResult {
  success: boolean;
  session?: DebugSession;
  error?: string;
}

class DebuggerService {
  private sessions: Map<string, DebugSession> = new Map();
  private tempDir = path.join(process.cwd(), 'temp', 'debug');

  constructor() {
    this.ensureTempDir();
  }

  private async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * Create a new debug session
   */
  async createSession(projectPath: string, code: string): Promise<DebugResult> {
    try {
      const sessionId = `debug-${Date.now()}`;
      
      const session: DebugSession = {
        id: sessionId,
        projectPath,
        status: 'idle',
        breakpoints: [],
        stackFrames: [],
        variables: [],
        output: [],
        createdAt: new Date()
      };

      this.sessions.set(sessionId, session);

      // Parse code to extract functions and variables
      await this.analyzeCode(session, code);

      return {
        success: true,
        session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get debug session
   */
  getSession(sessionId: string): DebugSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Start debugging
   */
  async startDebugging(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    try {
      session.status = 'running';
      session.output.push('Debug session started');

      // Simulate execution start
      await this.simulateExecution(session);

      return {
        success: true,
        session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Stop debugging
   */
  async stopDebugging(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    session.status = 'stopped';
    session.output.push('Debug session stopped');
    session.stackFrames = [];
    session.variables = [];

    return {
      success: true,
      session
    };
  }

  /**
   * Pause execution
   */
  async pauseExecution(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    session.status = 'paused';
    session.output.push('Execution paused');

    return {
      success: true,
      session
    };
  }

  /**
   * Continue execution
   */
  async continueExecution(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    session.status = 'running';
    session.output.push('Execution continued');

    // Continue until next breakpoint
    await this.runToNextBreakpoint(session);

    return {
      success: true,
      session
    };
  }

  /**
   * Step over (execute current line, don't enter functions)
   */
  async stepOver(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.currentLine !== undefined) {
      session.currentLine++;
      session.output.push(`Stepped to line ${session.currentLine}`);
      
      // Update variables for new line
      await this.updateVariables(session);
    }

    return {
      success: true,
      session
    };
  }

  /**
   * Step into (enter function calls)
   */
  async stepInto(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    // Add new stack frame
    const newFrame: StackFrame = {
      id: `frame-${Date.now()}`,
      function: 'inner_function',
      module: 'example',
      file: session.currentFile || 'main.move',
      line: session.currentLine || 0
    };

    session.stackFrames.unshift(newFrame);
    session.output.push(`Stepped into ${newFrame.function}`);

    return {
      success: true,
      session
    };
  }

  /**
   * Step out (exit current function)
   */
  async stepOut(sessionId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.stackFrames.length > 1) {
      const exitedFrame = session.stackFrames.shift();
      session.output.push(`Stepped out of ${exitedFrame?.function}`);
    }

    return {
      success: true,
      session
    };
  }

  /**
   * Add breakpoint
   */
  async addBreakpoint(
    sessionId: string,
    file: string,
    line: number,
    condition?: string
  ): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const breakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      file,
      line,
      enabled: true,
      condition
    };

    session.breakpoints.push(breakpoint);
    session.output.push(`Breakpoint added at ${file}:${line}`);

    return {
      success: true,
      session
    };
  }

  /**
   * Remove breakpoint
   */
  async removeBreakpoint(sessionId: string, breakpointId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    session.breakpoints = session.breakpoints.filter(bp => bp.id !== breakpointId);
    session.output.push(`Breakpoint removed`);

    return {
      success: true,
      session
    };
  }

  /**
   * Toggle breakpoint
   */
  async toggleBreakpoint(sessionId: string, breakpointId: string): Promise<DebugResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const breakpoint = session.breakpoints.find(bp => bp.id === breakpointId);
    if (breakpoint) {
      breakpoint.enabled = !breakpoint.enabled;
      session.output.push(`Breakpoint ${breakpoint.enabled ? 'enabled' : 'disabled'}`);
    }

    return {
      success: true,
      session
    };
  }

  /**
   * Get variables in current scope
   */
  async getVariables(sessionId: string): Promise<Variable[]> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    return session.variables;
  }

  /**
   * Evaluate expression
   */
  async evaluateExpression(sessionId: string, expression: string): Promise<any> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Simple expression evaluation
    // In production, this would use the Move VM
    session.output.push(`Evaluating: ${expression}`);

    return {
      result: 'evaluation result',
      type: 'u64'
    };
  }

  /**
   * Analyze code to extract structure
   */
  private async analyzeCode(session: DebugSession, code: string): Promise<void> {
    // Extract module name
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    if (moduleMatch) {
      session.currentFile = `${moduleMatch[2]}.move`;
    }

    // Extract functions
    const functionMatches = code.matchAll(/public\s+(?:entry\s+)?fun\s+(\w+)/g);
    const functions = Array.from(functionMatches).map(match => match[1]);

    // Create initial stack frame
    if (functions.length > 0) {
      session.stackFrames = [{
        id: 'frame-0',
        function: functions[0],
        module: moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown',
        file: session.currentFile || 'main.move',
        line: 1
      }];
    }

    // Extract variables (simplified)
    const varMatches = code.matchAll(/let\s+(?:mut\s+)?(\w+):\s*(\w+)/g);
    session.variables = Array.from(varMatches).map(match => ({
      name: match[1],
      value: '0',
      type: match[2],
      scope: 'local' as const,
      mutable: code.includes(`let mut ${match[1]}`)
    }));
  }

  /**
   * Simulate execution
   */
  private async simulateExecution(session: DebugSession): Promise<void> {
    session.currentLine = 1;
    session.currentFile = session.stackFrames[0]?.file || 'main.move';

    // Check if we hit a breakpoint
    const hitBreakpoint = session.breakpoints.find(
      bp => bp.enabled && bp.line === session.currentLine && bp.file === session.currentFile
    );

    if (hitBreakpoint) {
      session.status = 'paused';
      session.output.push(`Hit breakpoint at line ${session.currentLine}`);
    }
  }

  /**
   * Run to next breakpoint
   */
  private async runToNextBreakpoint(session: DebugSession): Promise<void> {
    if (!session.currentLine) return;

    // Find next breakpoint
    const nextBreakpoint = session.breakpoints
      .filter(bp => bp.enabled && bp.line > session.currentLine!)
      .sort((a, b) => a.line - b.line)[0];

    if (nextBreakpoint) {
      session.currentLine = nextBreakpoint.line;
      session.status = 'paused';
      session.output.push(`Hit breakpoint at line ${nextBreakpoint.line}`);
    } else {
      session.status = 'stopped';
      session.output.push('Execution completed');
    }
  }

  /**
   * Update variables for current execution point
   */
  private async updateVariables(session: DebugSession): Promise<void> {
    // Simulate variable value changes
    session.variables.forEach(v => {
      if (v.type === 'u64') {
        v.value = String(Math.floor(Math.random() * 1000));
      } else if (v.type === 'address') {
        v.value = `0x${Math.random().toString(16).substring(2, 10)}`;
      }
    });
  }

  /**
   * Clean up old sessions
   */
  cleanupSessions(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.createdAt.getTime() > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}

export const debuggerService = new DebuggerService();

// Cleanup old sessions every hour
setInterval(() => {
  debuggerService.cleanupSessions();
}, 3600000);
