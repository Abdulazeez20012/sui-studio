import { apiService } from './api';

export interface SyntaxIssue {
  id: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  code?: string;
  source: 'move-compiler' | 'linter' | 'analyzer';
  fix?: {
    title: string;
    edits: Array<{
      range: { start: { line: number; column: number }; end: { line: number; column: number } };
      newText: string;
    }>;
  };
}

export interface SyntaxCheckResult {
  success: boolean;
  issues: SyntaxIssue[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
    hints: number;
  };
  compiled?: boolean;
  compilationTime?: number;
  quick?: boolean;
}

class SyntaxService {
  /**
   * Check syntax of code (full check with compilation)
   */
  async checkSyntax(code: string, filename?: string): Promise<SyntaxCheckResult> {
    try {
      const response = await apiService.post<SyntaxCheckResult>('/syntax/check', {
        code,
        filename,
        quick: false
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        issues: [{
          id: 'error-1',
          severity: 'error',
          message: error.message || 'Syntax check failed',
          line: 1,
          column: 1,
          source: 'analyzer'
        }],
        summary: { errors: 1, warnings: 0, info: 0, hints: 0 }
      };
    }
  }

  /**
   * Quick syntax check (without compilation)
   */
  async quickCheck(code: string): Promise<SyntaxCheckResult> {
    try {
      const response = await apiService.post<SyntaxCheckResult>('/syntax/check', {
        code,
        quick: true
      });
      return response;
    } catch (error: any) {
      return {
        success: false,
        issues: [],
        summary: { errors: 0, warnings: 0, info: 0, hints: 0 },
        quick: true
      };
    }
  }

  /**
   * Get severity icon
   */
  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'hint':
        return '💡';
      default:
        return '•';
    }
  }

  /**
   * Get severity color
   */
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'hint':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  }

  /**
   * Get severity background color
   */
  getSeverityBgColor(severity: string): string {
    switch (severity) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'hint':
        return 'bg-gray-500/10 border-gray-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  }
}

export const syntaxService = new SyntaxService();
