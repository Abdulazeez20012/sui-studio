import { config } from '../config';

const API_URL = config.api.baseUrl;

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

export type DebugCommand = 'start' | 'stop' | 'pause' | 'continue' | 'step-over' | 'step-into' | 'step-out';

class DebuggerService {
  private async request(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Create a new debug session
   */
  async createSession(code: string, projectPath?: string): Promise<DebugSession> {
    try {
      const response = await this.request('/api/debugger/session', {
        method: 'POST',
        body: JSON.stringify({ code, projectPath }),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating debug session:', error);
      throw error;
    }
  }

  /**
   * Get debug session
   */
  async getSession(sessionId: string): Promise<DebugSession> {
    try {
      const response = await this.request(`/api/debugger/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  /**
   * Execute debug command
   */
  async executeCommand(sessionId: string, command: DebugCommand): Promise<DebugSession> {
    try {
      const response = await this.request('/api/debugger/command', {
        method: 'POST',
        body: JSON.stringify({ sessionId, type: command }),
      });
      return response.data;
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  /**
   * Add breakpoint
   */
  async addBreakpoint(
    sessionId: string,
    file: string,
    line: number,
    condition?: string
  ): Promise<DebugSession> {
    try {
      const response = await this.request('/api/debugger/breakpoint', {
        method: 'POST',
        body: JSON.stringify({ sessionId, file, line, condition }),
      });
      return response.data;
    } catch (error) {
      console.error('Error adding breakpoint:', error);
      throw error;
    }
  }

  /**
   * Remove breakpoint
   */
  async removeBreakpoint(sessionId: string, breakpointId: string): Promise<DebugSession> {
    try {
      const response = await this.request(
        `/api/debugger/breakpoint/${sessionId}/${breakpointId}`,
        { method: 'DELETE' }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing breakpoint:', error);
      throw error;
    }
  }

  /**
   * Toggle breakpoint
   */
  async toggleBreakpoint(sessionId: string, breakpointId: string): Promise<DebugSession> {
    try {
      const response = await this.request(
        `/api/debugger/breakpoint/${sessionId}/${breakpointId}/toggle`,
        { method: 'PUT' }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling breakpoint:', error);
      throw error;
    }
  }

  /**
   * Get variables
   */
  async getVariables(sessionId: string): Promise<Variable[]> {
    try {
      const response = await this.request(`/api/debugger/variables/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching variables:', error);
      return [];
    }
  }

  /**
   * Evaluate expression
   */
  async evaluateExpression(sessionId: string, expression: string): Promise<any> {
    try {
      const response = await this.request('/api/debugger/evaluate', {
        method: 'POST',
        body: JSON.stringify({ sessionId, expression }),
      });
      return response.data;
    } catch (error) {
      console.error('Error evaluating expression:', error);
      throw error;
    }
  }
}

export const debuggerService = new DebuggerService();
