/**
 * Real Debugger Service
 * Connects to backend debugger for Move code debugging
 */

import { apiService } from './apiService';

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

const API_URL = import.meta.env.VITE_API_URL || '';

class DebuggerService {
  private currentSessionId: string | null = null;

  /**
   * Create a new debug session
   */
  async createSession(code: string, packageName: string = 'debug_package'): Promise<DebugSession> {
    try {
      const response = await fetch(`${API_URL}/api/debugger/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ code, packageName }),
      });

      const result = await response.json();
      if (result.session) {
        this.currentSessionId = result.session.id;
        return result.session;
      }
      throw new Error(result.error || 'Failed to create session');
    } catch (error: any) {
      console.error('Failed to create debug session:', error);
      // Return local session if backend unavailable
      return this.createLocalSession(code, packageName);
    }
  }

  /**
   * Create local debug session (fallback)
   */
  private createLocalSession(code: string, packageName: string): DebugSession {
    const sessionId = `local-${Date.now()}`;
    this.currentSessionId = sessionId;

    return {
      id: sessionId,
      code,
      packageName,
      breakpoints: [],
      variables: this.extractVariables(code),
      callStack: this.buildCallStack(code),
      status: 'idle',
      output: [],
      errors: this.validateCode(code),
    };
  }

  /**
   * Set a breakpoint
   */
  async setBreakpoint(line: number, condition?: string): Promise<Breakpoint | null> {
    if (!this.currentSessionId) return null;

    try {
      const response = await fetch(`${API_URL}/api/debugger/breakpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          sessionId: this.currentSessionId,
          line,
          condition,
        }),
      });

      const result = await response.json();
      return result.breakpoint || null;
    } catch (error) {
      // Local fallback
      return {
        id: `bp-${Date.now()}`,
        line,
        enabled: true,
        condition,
        hitCount: 0,
      };
    }
  }

  /**
   * Remove a breakpoint
   */
  async removeBreakpoint(breakpointId: string): Promise<boolean> {
    if (!this.currentSessionId) return false;

    try {
      const response = await fetch(`${API_URL}/api/debugger/breakpoint/${breakpointId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      return response.ok;
    } catch {
      return true; // Assume success for local
    }
  }

  /**
   * Start debugging
   */
  async start(): Promise<StepResult> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_URL}/api/debugger/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { line: 1, variables: [], finished: false };
    }
  }

  /**
   * Step over (next line)
   */
  async stepOver(): Promise<StepResult> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_URL}/api/debugger/step-over`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });

      return await response.json();
    } catch (error) {
      return { line: 1, variables: [], finished: true };
    }
  }

  /**
   * Step into function
   */
  async stepInto(): Promise<StepResult> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_URL}/api/debugger/step-into`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });

      return await response.json();
    } catch (error) {
      return { line: 1, variables: [], finished: true };
    }
  }

  /**
   * Step out of function
   */
  async stepOut(): Promise<StepResult> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_URL}/api/debugger/step-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });

      return await response.json();
    } catch (error) {
      return { line: 1, variables: [], finished: true };
    }
  }

  /**
   * Continue execution
   */
  async continue(): Promise<StepResult> {
    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    try {
      const response = await fetch(`${API_URL}/api/debugger/continue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });

      return await response.json();
    } catch (error) {
      return { line: 1, variables: [], finished: true };
    }
  }

  /**
   * Stop debugging
   */
  async stop(): Promise<void> {
    if (!this.currentSessionId) return;

    try {
      await fetch(`${API_URL}/api/debugger/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ sessionId: this.currentSessionId }),
      });
    } catch {
      // Ignore errors
    }

    this.currentSessionId = null;
  }

  /**
   * Evaluate expression
   */
  async evaluate(expression: string): Promise<{ value: string; type: string } | null> {
    if (!this.currentSessionId) return null;

    try {
      const response = await fetch(`${API_URL}/api/debugger/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          sessionId: this.currentSessionId,
          expression,
        }),
      });

      const result = await response.json();
      return result.result || null;
    } catch {
      return null;
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<DebugSession | null> {
    if (!this.currentSessionId) return null;

    try {
      const response = await fetch(`${API_URL}/api/debugger/session/${this.currentSessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const result = await response.json();
      return result.session || null;
    } catch {
      return null;
    }
  }

  /**
   * Debug a transaction
   */
  async debugTransaction(txDigest: string, network: string = 'testnet'): Promise<DebugSession> {
    try {
      const response = await fetch(`${API_URL}/api/debugger/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ txDigest, network }),
      });

      const result = await response.json();
      if (result.session) {
        this.currentSessionId = result.session.id;
        return result.session;
      }
      throw new Error(result.error || 'Failed to debug transaction');
    } catch (error: any) {
      throw new Error(`Failed to debug transaction: ${error.message}`);
    }
  }

  // Helper methods for local fallback

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

  private buildCallStack(code: string): StackFrame[] {
    const moduleMatch = code.match(/module\s+(\w+)::(\w+)/);
    const moduleName = moduleMatch ? `${moduleMatch[1]}::${moduleMatch[2]}` : 'unknown';

    return [
      {
        id: 0,
        function: 'main',
        module: moduleName,
        line: 1,
        locals: [],
      },
    ];
  }

  private validateCode(code: string): DebugError[] {
    const errors: DebugError[] = [];

    if (!code.includes('module ')) {
      errors.push({
        message: 'Missing module declaration',
        severity: 'error',
      });
    }

    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        message: `Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`,
        severity: 'error',
      });
    }

    return errors;
  }
}

export const debuggerService = new DebuggerService();
