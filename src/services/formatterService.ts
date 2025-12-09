import { apiService } from './apiService';

export interface FormatOptions {
  indentSize?: number;
  useTabs?: boolean;
  maxLineLength?: number;
  insertFinalNewline?: boolean;
}

export interface LintIssue {
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
}

class FormatterService {
  /**
   * Format Move code
   */
  async format(code: string, options?: FormatOptions): Promise<string> {
    try {
      const response = await apiService.post('/format/format', {
        code,
        options,
      });
      
      return response.formatted || code;
    } catch (error) {
      console.error('Format error:', error);
      return code;
    }
  }

  /**
   * Lint Move code
   */
  async lint(code: string): Promise<LintIssue[]> {
    try {
      const response = await apiService.post('/format/lint', { code });
      return response.issues || [];
    } catch (error) {
      console.error('Lint error:', error);
      return [];
    }
  }

  /**
   * Get code suggestions
   */
  async getSuggestions(code: string): Promise<string[]> {
    try {
      const response = await apiService.post('/format/suggestions', { code });
      return response.suggestions || [];
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  }

  /**
   * Auto-fix common issues
   */
  async autoFix(code: string): Promise<string> {
    try {
      const response = await apiService.post('/format/autofix', { code });
      return response.fixed || code;
    } catch (error) {
      console.error('Auto-fix error:', error);
      return code;
    }
  }

  /**
   * Format on save (convenience method)
   */
  async formatOnSave(code: string): Promise<string> {
    return this.format(code, {
      indentSize: 4,
      useTabs: false,
      maxLineLength: 100,
      insertFinalNewline: true,
    });
  }
}

export const formatterService = new FormatterService();
