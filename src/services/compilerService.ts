import { apiService } from './apiService';
import { logger } from '@/utils/logger';

export interface CompilationResult {
  success: boolean;
  bytecode?: string;
  modules?: string[];
  dependencies?: string[];
  errors?: CompilationError[];
  warnings?: CompilationWarning[];
  gasEstimate?: number;
  buildInfo?: BuildInfo;
  cached?: boolean;
  simulated?: boolean;
}

export interface CompilationError {
  message: string;
  severity: 'error' | 'warning';
  file?: string;
  line?: number;
  column?: number;
  code?: string;
  suggestion?: string;
}

export interface CompilationWarning {
  message: string;
  file?: string;
  line?: number;
  column?: number;
}

export interface BuildInfo {
  packageName: string;
  version: string;
  dependencies: Record<string, string>;
  modules: string[];
  compilationTime: number;
}

export interface CompilerOptions {
  skipFetch?: boolean;
  testMode?: boolean;
  generateDocs?: boolean;
}

class CompilerService {
  private compiling: boolean = false;
  private lastResult: CompilationResult | null = null;

  /**
   * Compile Move code
   */
  async compile(
    code: string,
    packageName?: string,
    options?: CompilerOptions
  ): Promise<CompilationResult> {
    if (this.compiling) {
      throw new Error('Compilation already in progress');
    }

    this.compiling = true;
    logger.info('Starting compilation', { packageName, options });

    try {
      const result = await apiService.compileCode(code, packageName, options);
      
      this.lastResult = result;
      
      if (result.success) {
        logger.info('Compilation successful', {
          modules: result.modules?.length,
          gasEstimate: result.gasEstimate,
          cached: result.cached,
          simulated: result.simulated,
        });
      } else {
        logger.warn('Compilation failed', {
          errorCount: result.errors?.length,
          warningCount: result.warnings?.length,
        });
      }

      return result;
    } catch (error: any) {
      logger.error('Compilation error', error);
      throw error;
    } finally {
      this.compiling = false;
    }
  }

  /**
   * Check if compilation is in progress
   */
  isCompiling(): boolean {
    return this.compiling;
  }

  /**
   * Get last compilation result
   */
  getLastResult(): CompilationResult | null {
    return this.lastResult;
  }

  /**
   * Estimate gas for code
   */
  async estimateGas(code: string): Promise<{
    estimatedGas: number;
    gasBudget: number;
    breakdown: {
      baseGas: number;
      linesGas: number;
      complexityFactor: number;
    };
  }> {
    try {
      return await apiService.estimateGas(code);
    } catch (error: any) {
      logger.error('Gas estimation error', error);
      throw error;
    }
  }

  /**
   * Check compiler health
   */
  async checkHealth(): Promise<{
    status: string;
    suiCLI: string;
    mode: string;
    testPassed: boolean;
  }> {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/compile/health`);
      return await response.json();
    } catch (error: any) {
      logger.error('Health check error', error);
      return {
        status: 'error',
        suiCLI: 'unknown',
        mode: 'unknown',
        testPassed: false,
      };
    }
  }

  /**
   * Format compilation errors for display
   */
  formatErrors(errors: CompilationError[]): string {
    return errors
      .map(error => {
        let formatted = `${error.severity.toUpperCase()}: ${error.message}`;
        
        if (error.file && error.line) {
          formatted = `${error.file}:${error.line}:${error.column || 0} - ${formatted}`;
        }
        
        if (error.code) {
          formatted = `[${error.code}] ${formatted}`;
        }
        
        if (error.suggestion) {
          formatted += `\n  Suggestion: ${error.suggestion}`;
        }
        
        return formatted;
      })
      .join('\n\n');
  }

  /**
   * Format warnings for display
   */
  formatWarnings(warnings: CompilationWarning[]): string {
    return warnings
      .map(warning => {
        let formatted = `WARNING: ${warning.message}`;
        
        if (warning.file && warning.line) {
          formatted = `${warning.file}:${warning.line}:${warning.column || 0} - ${formatted}`;
        }
        
        return formatted;
      })
      .join('\n');
  }

  /**
   * Get error at specific line
   */
  getErrorAtLine(errors: CompilationError[], line: number): CompilationError | undefined {
    return errors.find(error => error.line === line);
  }

  /**
   * Get all errors for a file
   */
  getErrorsForFile(errors: CompilationError[], filename: string): CompilationError[] {
    return errors.filter(error => error.file === filename);
  }

  /**
   * Check if code has syntax errors (quick check)
   */
  hasBasicSyntaxErrors(code: string): { hasErrors: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for module declaration
    if (!code.includes('module ')) {
      errors.push('Missing module declaration');
    }

    // Check for balanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
    }

    // Check for balanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
    }

    return {
      hasErrors: errors.length > 0,
      errors,
    };
  }

  /**
   * Get compilation statistics
   */
  getStats(result: CompilationResult): {
    errorCount: number;
    warningCount: number;
    moduleCount: number;
    gasEstimate: number;
    cached: boolean;
    simulated: boolean;
  } {
    return {
      errorCount: result.errors?.length || 0,
      warningCount: result.warnings?.length || 0,
      moduleCount: result.modules?.length || 0,
      gasEstimate: result.gasEstimate || 0,
      cached: result.cached || false,
      simulated: result.simulated || false,
    };
  }
}

export const compilerService = new CompilerService();
