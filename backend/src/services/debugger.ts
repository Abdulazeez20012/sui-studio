/**
 * Real Move Debugger Service
 * Provides debugging capabilities for Move code using Sui CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { SuiClient } from '@mysten/sui/client';

const execAsync = promisify(exec);

export interface DebugSession {
  id: string;
  code: string;
  packageName: string;
  breakpoints: Breakpoint[];
  variables: Variable[];
  callStack: StackFrame[];
  status: 'idle' | 'running' | 'paused' | 'stopped' | 'error';
  currentLine?: number;
  output: string[];
  errors: DebugError[];
  timestamp: Date;
}

export interface Breakpoint {
  id: string;
  line: number;
  enabled: boolean;
  condition?: string;
  hitCount: number;
}

export interface Variable {
  name: string;
  type: string;
  value: string;
  scope: 'local' | 'global' | 'parameter';
  mutable: boolean;
}

export interface StackFrame {
  id: number;
  function: string;
  module: string;
  line: number;
  locals: Variable[];
}

export interface DebugError {
  message: string;
  line?: number;
  column?: number;
  severity: 'error' | 'warning';
}

export interface StepResult {
  line: number;
  variables: Variable[];
  output?: string;
  finished: boolean;
}

const RPC_URLS: Record<string, string> = {
  mainnet: 'https://fullnode.mainnet.sui.io:443',
  testnet: 'https://fullnode.testnet.sui.io:443',
  devnet: 'https://fullnode.devnet.sui.io:443',
};

class DebuggerService {
  private sessions: Map<string, DebugSession> = new Map();
  private tempDir: string = '/tmp/sui-debug';
  private suiCliAvailable: boolean | null = null;

  constructor() {
    this.initTempDir();
  }

  private async initTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  private getClient(network: string = 'testnet'): SuiClient {
    return new SuiClient({ url: RPC_URLS[network] || RPC_URLS.testnet });
  }

  /**
   * Check if Sui CLI is available
   */
  async checkSuiCLI(): Promise<boolean> {
    if (this.suiCliAvailable !== null) {
      return this.suiCliAvailable;
    }

    try {
      await execAsync('sui --version', { timeout: 5000 });
      this.suiCliAvailable = true;
      return true;
    } catch {
      this.suiCliAvailable = false;
      return false;
    }
  }

  /**
   * Create a new debug session
   */
  async createSession(code: string, packageName: string = 'debug_package'): Promise<DebugSession> {
    const sessionId = `debug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Parse code to extract variables and structure
    const variables = this.extractVariables(code);
    const callStack = this.buildInitialCallStack(code);

    const session: DebugSession = {
      id: sessionId,
      code,
      packageName,
      breakpoints: [],
      variables,
      callStack,
      status: 'idle',
      output: [],
      errors: [],
      timestamp: new Date(),
    };

    // Validate code by attempting compilation
    const cliAvailable = await this.checkSuiCLI();
    if (cliAvailable) {
      const validationResult = await this.validateCode(code, packageName);
      if (!validationResult.success) {
        session.errors = validationResult.errors;
        session.status = 'error';
      }
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Validate Move code by compiling
   */
  private async validateCode(
    code: string,
    packageName: string
  ): Promise<{ success: boolean; errors: DebugError[] }> {
    const projectDir = path.join(this.tempDir, `${packageName}-${Date.now()}`);

    try {
      await fs.mkdir(projectDir, { recursive: true });

      const moveToml = `[package]
name = "${packageName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"
`;
      await fs.writeFile(path.join(projectDir, 'Move.toml'), moveToml);

      const sourcesDir = path.join(projectDir, 'sources');
      await fs.mkdir(sourcesDir);
      await fs.writeFile(path.join(sourcesDir, `${packageName}.move`), code);

      await execAsync(`sui move build --path ${projectDir}`, { timeout: 60000 });

      return { success: true, errors: [] };
    } catch (error: any) {
      const errors = this.parseCompilationErrors(error.stderr || error.message);
      return { success: false, errors };
    } finally {
      try {
        await fs.rm(projectDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Parse compilation errors
   */
  private parseCompilationErrors(output: string): DebugError[] {
    const errors: DebugError[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      const errorMatch = line.match(/error\[E\d+\]:\s*(.+)/i);
      const locationMatch = line.match(/:(\d+):(\d+)/);

      if (errorMatch) {
        errors.push({
          message: errorMatch[1],
          line: locationMatch ? parseInt(locationMatch[1]) : undefined,
          column: locationMatch ? parseInt(locationMatch[2]) : undefined,
          severity: 'error',
        });
      }

      const warningMatch = line.match(/warning:\s*(.+)/i);
      if (warningMatch) {
        errors.push({
          message: warningMatch[1],
          line: locationMatch ? parseInt(locationMatch[1]) : undefined,
          column: locationMatch ? parseInt(locationMatch[2]) : undefined,
          severity: 'warning',
        });
      }
    }

    if (errors.length === 0 && output.trim()) {
      errors.push({ message: output.trim(), severity: 'error' });
    }

    return errors;
  }

  /**
   * Set a breakpoint
   */
  setBreakpoint(sessionId: string, line: number, condition?: string): Breakpoint | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const breakpoint: Breakpoint = {
      id: `bp-${Date.now()}`,
      line,
      enabled: true,
      condition,
      hitCount: 0,
    };

    session.breakpoints.push(breakpoint);
    return breakpoint;
  }

  /**
   * Remove a breakpoint
   */
  removeBreakpoint(sessionId: string, breakpointId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const index = session.breakpoints.findIndex((bp) => bp.id === breakpointId);
    if (index === -1) return false;

    session.breakpoints.splice(index, 1);
    return true;
  }

  /**
   * Toggle breakpoint enabled state
   */
  toggleBreakpoint(sessionId: string, breakpointId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    const breakpoint = session.breakpoints.find((bp) => bp.id === breakpointId);
    if (!breakpoint) return false;

    breakpoint.enabled = !breakpoint.enabled;
    return true;
  }

  /**
   * Start debugging (run to first breakpoint or end)
   */
  async start(sessionId: string): Promise<StepResult> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'running';
    session.output.push('Debug session started');

    // Find first executable line
    const firstLine = this.findFirstExecutableLine(session.code);
    session.currentLine = firstLine;

    // Check for breakpoint
    const bp = session.breakpoints.find((b) => b.line === firstLine && b.enabled);
    if (bp) {
      session.status = 'paused';
      bp.hitCount++;
      session.output.push(`Breakpoint hit at line ${firstLine}`);
    }

    // Update variables for current scope
    session.variables = this.getVariablesAtLine(session.code, firstLine);

    return {
      line: firstLine,
      variables: session.variables,
      output: session.output.join('\n'),
      finished: false,
    };
  }

  /**
   * Step to next line
   */
  async stepOver(sessionId: string): Promise<StepResult> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentLine = session.currentLine || 1;
    const nextLine = this.findNextExecutableLine(session.code, currentLine);

    if (nextLine === -1) {
      session.status = 'stopped';
      session.output.push('Execution completed');
      return {
        line: currentLine,
        variables: session.variables,
        output: 'Execution completed',
        finished: true,
      };
    }

    session.currentLine = nextLine;
    session.variables = this.getVariablesAtLine(session.code, nextLine);

    // Check for breakpoint
    const bp = session.breakpoints.find((b) => b.line === nextLine && b.enabled);
    if (bp) {
      session.status = 'paused';
      bp.hitCount++;
      session.output.push(`Breakpoint hit at line ${nextLine}`);
    }

    return {
      line: nextLine,
      variables: session.variables,
      finished: false,
    };
  }

  /**
   * Step into function call
   */
  async stepInto(sessionId: string): Promise<StepResult> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const currentLine = session.currentLine || 1;
    const lineContent = this.getLineContent(session.code, currentLine);

    // Check if current line has a function call
    const funcCallMatch = lineContent.match(/(\w+)\s*\(/);
    if (funcCallMatch) {
      const funcName = funcCallMatch[1];
      const funcDef = this.findFunctionDefinition(session.code, funcName);

      if (funcDef) {
        // Add to call stack
        session.callStack.push({
          id: session.callStack.length,
          function: funcName,
          module: session.packageName,
          line: funcDef.startLine,
          locals: [],
        });

        session.currentLine = funcDef.startLine;
        session.variables = this.getVariablesAtLine(session.code, funcDef.startLine);
        session.output.push(`Stepped into ${funcName}`);

        return {
          line: funcDef.startLine,
          variables: session.variables,
          output: `Stepped into ${funcName}`,
          finished: false,
        };
      }
    }

    // No function call, just step over
    return this.stepOver(sessionId);
  }

  /**
   * Step out of current function
   */
  async stepOut(sessionId: string): Promise<StepResult> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    if (session.callStack.length <= 1) {
      // At top level, run to end
      session.status = 'stopped';
      return {
        line: session.currentLine || 1,
        variables: session.variables,
        output: 'Execution completed',
        finished: true,
      };
    }

    // Pop call stack and return to caller
    session.callStack.pop();
    const caller = session.callStack[session.callStack.length - 1];
    session.currentLine = caller.line + 1;
    session.variables = this.getVariablesAtLine(session.code, session.currentLine);
    session.output.push(`Returned from function`);

    return {
      line: session.currentLine,
      variables: session.variables,
      output: 'Returned from function',
      finished: false,
    };
  }

  /**
   * Continue execution until next breakpoint or end
   */
  async continue(sessionId: string): Promise<StepResult> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    session.status = 'running';
    let currentLine = session.currentLine || 1;

    // Run until breakpoint or end
    while (true) {
      const nextLine = this.findNextExecutableLine(session.code, currentLine);
      if (nextLine === -1) {
        session.status = 'stopped';
        return {
          line: currentLine,
          variables: session.variables,
          output: 'Execution completed',
          finished: true,
        };
      }

      currentLine = nextLine;
      const bp = session.breakpoints.find((b) => b.line === currentLine && b.enabled);
      if (bp) {
        session.status = 'paused';
        session.currentLine = currentLine;
        session.variables = this.getVariablesAtLine(session.code, currentLine);
        bp.hitCount++;
        return {
          line: currentLine,
          variables: session.variables,
          output: `Breakpoint hit at line ${currentLine}`,
          finished: false,
        };
      }
    }
  }

  /**
   * Stop debugging session
   */
  stop(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.status = 'stopped';
    session.output.push('Debug session stopped');
    return true;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): DebugSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Evaluate expression in current context
   */
  evaluate(sessionId: string, expression: string): { value: string; type: string } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check if expression is a variable name
    const variable = session.variables.find((v) => v.name === expression);
    if (variable) {
      return { value: variable.value, type: variable.type };
    }

    // Simple expression evaluation
    if (expression.match(/^\d+$/)) {
      return { value: expression, type: 'u64' };
    }
    if (expression === 'true' || expression === 'false') {
      return { value: expression, type: 'bool' };
    }

    return { value: 'undefined', type: 'unknown' };
  }

  /**
   * Debug a real transaction
   */
  async debugTransaction(txDigest: string, network: string = 'testnet'): Promise<DebugSession> {
    const client = this.getClient(network);
    const sessionId = `tx-debug-${Date.now()}`;

    try {
      const tx = await client.getTransactionBlock({
        digest: txDigest,
        options: {
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
        },
      });

      const session: DebugSession = {
        id: sessionId,
        code: '',
        packageName: 'transaction',
        breakpoints: [],
        variables: [],
        callStack: [],
        status: tx.effects?.status.status === 'success' ? 'stopped' : 'error',
        output: [`Transaction: ${txDigest}`, `Status: ${tx.effects?.status.status}`],
        errors: tx.effects?.status.status === 'failure' 
          ? [{ message: JSON.stringify(tx.effects.status.error), severity: 'error' }]
          : [],
        timestamp: new Date(),
      };

      // Extract variables from object changes
      const objectChanges = tx.objectChanges || [];
      session.variables = objectChanges.map((change: any) => ({
        name: change.objectId?.substring(0, 10) || 'unknown',
        type: change.objectType || 'object',
        value: change.type,
        scope: 'global' as const,
        mutable: change.type === 'mutated',
      }));

      // Build call stack from transaction
      const moveCall = (tx.transaction?.data as any)?.transaction?.transactions?.[0]?.MoveCall;
      if (moveCall) {
        session.callStack.push({
          id: 0,
          function: moveCall.function,
          module: `${moveCall.package}::${moveCall.module}`,
          line: 0,
          locals: [],
        });
      }

      this.sessions.set(sessionId, session);
      return session;
    } catch (error: any) {
      const session: DebugSession = {
        id: sessionId,
        code: '',
        packageName: 'transaction',
        breakpoints: [],
        variables: [],
        callStack: [],
        status: 'error',
        output: [],
        errors: [{ message: error.message, severity: 'error' }],
        timestamp: new Date(),
      };
      this.sessions.set(sessionId, session);
      return session;
    }
  }

  // Helper methods

  private extractVariables(code: string): Variable[] {
    const variables: Variable[] = [];
    const letPattern = /let\s+(mut\s+)?(\w+)\s*(?::\s*([^=]+))?\s*=/g;
    let match;

    while ((match = letPattern.exec(code)) !== null) {
      variables.push({
        name: match[2],
        type: match[3]?.trim() || 'unknown',
        value: 'uninitialized',
        scope: 'local',
        mutable: !!match[1],
      });
    }

    return variables;
  }

  private buildInitialCallStack(code: string): StackFrame[] {
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    const moduleName = moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown';

    return [{
      id: 0,
      function: 'main',
      module: moduleName,
      line: 1,
      locals: [],
    }];
  }

  private findFirstExecutableLine(code: string): number {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('//') && !line.startsWith('module') && 
          !line.startsWith('use') && !line.startsWith('const') && line !== '{' && line !== '}') {
        return i + 1;
      }
    }
    return 1;
  }

  private findNextExecutableLine(code: string, currentLine: number): number {
    const lines = code.split('\n');
    for (let i = currentLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('//') && line !== '{' && line !== '}') {
        return i + 1;
      }
    }
    return -1;
  }

  private getLineContent(code: string, line: number): string {
    const lines = code.split('\n');
    return lines[line - 1] || '';
  }

  private findFunctionDefinition(code: string, funcName: string): { startLine: number; endLine: number } | null {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`fun ${funcName}`)) {
        let endLine = i;
        let braceCount = 0;
        for (let j = i; j < lines.length; j++) {
          braceCount += (lines[j].match(/{/g) || []).length;
          braceCount -= (lines[j].match(/}/g) || []).length;
          if (braceCount === 0 && j > i) {
            endLine = j;
            break;
          }
        }
        return { startLine: i + 1, endLine: endLine + 1 };
      }
    }
    return null;
  }

  private getVariablesAtLine(code: string, line: number): Variable[] {
    const variables: Variable[] = [];
    const lines = code.split('\n').slice(0, line);
    const codeUpToLine = lines.join('\n');

    const letPattern = /let\s+(mut\s+)?(\w+)\s*(?::\s*([^=]+))?\s*=\s*([^;]+)/g;
    let match;

    while ((match = letPattern.exec(codeUpToLine)) !== null) {
      variables.push({
        name: match[2],
        type: match[3]?.trim() || 'inferred',
        value: match[4]?.trim() || 'unknown',
        scope: 'local',
        mutable: !!match[1],
      });
    }

    return variables;
  }

  /**
   * Cleanup old sessions
   */
  cleanupSessions(maxAge: number = 3600000): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.timestamp.getTime() > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}

export const debuggerService = new DebuggerService();

// Cleanup every hour
setInterval(() => debuggerService.cleanupSessions(), 3600000);
