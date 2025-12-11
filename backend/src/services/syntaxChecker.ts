import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

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
  compiled: boolean;
  compilationTime?: number;
}

class SyntaxCheckerService {
  private tempDir = path.join(os.tmpdir(), 'sui-syntax-check');

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
   * Check syntax of Move code
   */
  async checkSyntax(code: string, filename: string = 'main.move'): Promise<SyntaxCheckResult> {
    const startTime = Date.now();
    const issues: SyntaxIssue[] = [];

    try {
      // Create temporary project structure
      const projectDir = path.join(this.tempDir, `check-${Date.now()}`);
      await fs.mkdir(projectDir, { recursive: true });
      
      const sourcesDir = path.join(projectDir, 'sources');
      await fs.mkdir(sourcesDir, { recursive: true});

      // Write Move.toml
      const moveToml = `[package]
name = "syntax_check"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
syntax_check = "0x0"
`;
      await fs.writeFile(path.join(projectDir, 'Move.toml'), moveToml);

      // Write source file
      const sourceFile = path.join(sourcesDir, filename);
      await fs.writeFile(sourceFile, code);

      // Try to compile with Sui Move compiler
      let compiled = false;
      try {
        const { stdout, stderr } = await execAsync('sui move build', {
          cwd: projectDir,
          timeout: 30000,
          maxBuffer: 1024 * 1024 * 5
        });

        compiled = true;

        // Parse compiler output for warnings
        if (stderr || stdout) {
          const output = stderr + stdout;
          this.parseCompilerOutput(output, issues, filename);
        }

      } catch (error: any) {
        // Parse compilation errors
        const output = error.stderr || error.stdout || '';
        this.parseCompilerOutput(output, issues, filename);
      }

      // Run additional static analysis
      this.runStaticAnalysis(code, issues);

      // Run linter checks
      this.runLinterChecks(code, issues);

      // Cleanup
      await fs.rm(projectDir, { recursive: true, force: true }).catch(() => {});

      const compilationTime = Date.now() - startTime;

      return {
        success: issues.filter(i => i.severity === 'error').length === 0,
        issues: issues.sort((a, b) => a.line - b.line),
        summary: {
          errors: issues.filter(i => i.severity === 'error').length,
          warnings: issues.filter(i => i.severity === 'warning').length,
          info: issues.filter(i => i.severity === 'info').length,
          hints: issues.filter(i => i.severity === 'hint').length
        },
        compiled,
        compilationTime
      };

    } catch (error: any) {
      console.error('Syntax check error:', error);
      
      return {
        success: false,
        issues: [{
          id: 'check-error',
          severity: 'error',
          message: `Syntax check failed: ${error.message}`,
          line: 1,
          column: 1,
          source: 'analyzer'
        }],
        summary: { errors: 1, warnings: 0, info: 0, hints: 0 },
        compiled: false
      };
    }
  }

  /**
   * Parse Sui Move compiler output
   */
  private parseCompilerOutput(output: string, issues: SyntaxIssue[], filename: string): void {
    // Parse error messages from compiler
    const errorPattern = /error\[E\d+\]:\s*(.+?)(?:\n\s*┌─\s*(.+?):(\d+):(\d+))?/gs;
    const warningPattern = /warning\[W\d+\]:\s*(.+?)(?:\n\s*┌─\s*(.+?):(\d+):(\d+))?/gs;

    // Parse errors
    let match;
    while ((match = errorPattern.exec(output)) !== null) {
      const [, message, file, line, column] = match;
      if (!file || file.includes(filename)) {
        issues.push({
          id: `error-${issues.length}`,
          severity: 'error',
          message: message.trim(),
          line: line ? parseInt(line) : 1,
          column: column ? parseInt(column) : 1,
          source: 'move-compiler'
        });
      }
    }

    // Parse warnings
    while ((match = warningPattern.exec(output)) !== null) {
      const [, message, file, line, column] = match;
      if (!file || file.includes(filename)) {
        issues.push({
          id: `warning-${issues.length}`,
          severity: 'warning',
          message: message.trim(),
          line: line ? parseInt(line) : 1,
          column: column ? parseInt(column) : 1,
          source: 'move-compiler'
        });
      }
    }

    // Parse simple error messages
    if (output.includes('error:')) {
      const lines = output.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('error:')) {
          const message = line.replace(/^.*error:\s*/, '').trim();
          if (message && !issues.some(i => i.message === message)) {
            issues.push({
              id: `error-${issues.length}`,
              severity: 'error',
              message,
              line: 1,
              column: 1,
              source: 'move-compiler'
            });
          }
        }
      });
    }
  }

  /**
   * Run static analysis on code
   */
  private runStaticAnalysis(code: string, issues: SyntaxIssue[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      const trimmed = line.trim();

      // Check for common issues
      
      // Unused variables
      if (trimmed.match(/let\s+(\w+)\s*[:=]/)) {
        const varName = trimmed.match(/let\s+(\w+)\s*[:=]/)?.[1];
        if (varName && !code.includes(varName + '.') && !code.includes(varName + ')') && 
            code.split('\n').filter(l => l.includes(varName)).length === 1) {
          issues.push({
            id: `unused-${lineNum}`,
            severity: 'warning',
            message: `Variable '${varName}' is declared but never used`,
            line: lineNum,
            column: line.indexOf('let') + 1,
            code: 'unused-variable',
            source: 'analyzer'
          });
        }
      }

      // Missing semicolon
      if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && 
          !trimmed.endsWith('}') && !trimmed.startsWith('//') && 
          !trimmed.startsWith('module') && !trimmed.startsWith('public') &&
          !trimmed.startsWith('fun') && !trimmed.startsWith('struct')) {
        issues.push({
          id: `semicolon-${lineNum}`,
          severity: 'error',
          message: 'Missing semicolon',
          line: lineNum,
          column: line.length,
          code: 'missing-semicolon',
          source: 'linter',
          fix: {
            title: 'Add semicolon',
            edits: [{
              range: {
                start: { line: lineNum, column: line.length },
                end: { line: lineNum, column: line.length }
              },
              newText: ';'
            }]
          }
        });
      }

      // Unsafe transfer without checks
      if (trimmed.includes('transfer::public_transfer') && !code.includes('assert!')) {
        issues.push({
          id: `unsafe-transfer-${lineNum}`,
          severity: 'warning',
          message: 'Consider adding assertions before transferring objects',
          line: lineNum,
          column: line.indexOf('transfer') + 1,
          code: 'unsafe-transfer',
          source: 'analyzer'
        });
      }

      // Missing abort code
      if (trimmed.includes('abort') && !trimmed.match(/abort\s+\d+/)) {
        issues.push({
          id: `missing-abort-code-${lineNum}`,
          severity: 'warning',
          message: 'Abort should include an error code',
          line: lineNum,
          column: line.indexOf('abort') + 1,
          code: 'missing-abort-code',
          source: 'linter'
        });
      }

      // TODO comments
      if (trimmed.includes('TODO') || trimmed.includes('FIXME')) {
        issues.push({
          id: `todo-${lineNum}`,
          severity: 'info',
          message: 'TODO comment found',
          line: lineNum,
          column: line.indexOf('TODO') !== -1 ? line.indexOf('TODO') + 1 : line.indexOf('FIXME') + 1,
          code: 'todo-comment',
          source: 'linter'
        });
      }
    });
  }

  /**
   * Run linter checks
   */
  private runLinterChecks(code: string, issues: SyntaxIssue[]): void {
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check naming conventions
      if (line.match(/fun\s+[A-Z]/)) {
        issues.push({
          id: `naming-function-${lineNum}`,
          severity: 'hint',
          message: 'Function names should use snake_case',
          line: lineNum,
          column: line.indexOf('fun') + 1,
          code: 'naming-convention',
          source: 'linter'
        });
      }

      if (line.match(/struct\s+[a-z]/)) {
        issues.push({
          id: `naming-struct-${lineNum}`,
          severity: 'hint',
          message: 'Struct names should use PascalCase',
          line: lineNum,
          column: line.indexOf('struct') + 1,
          code: 'naming-convention',
          source: 'linter'
        });
      }

      // Check for magic numbers
      if (line.match(/\d{4,}/) && !line.includes('//')) {
        issues.push({
          id: `magic-number-${lineNum}`,
          severity: 'hint',
          message: 'Consider using a named constant instead of magic number',
          line: lineNum,
          column: line.search(/\d{4,}/) + 1,
          code: 'magic-number',
          source: 'linter'
        });
      }

      // Check line length
      if (line.length > 120) {
        issues.push({
          id: `line-length-${lineNum}`,
          severity: 'hint',
          message: 'Line exceeds 120 characters',
          line: lineNum,
          column: 121,
          code: 'line-too-long',
          source: 'linter'
        });
      }
    });

    // Check for missing documentation
    if (!code.includes('///') && code.includes('public')) {
      const publicLine = code.split('\n').findIndex(l => l.includes('public'));
      if (publicLine !== -1) {
        issues.push({
          id: 'missing-docs',
          severity: 'info',
          message: 'Public functions should have documentation comments',
          line: publicLine + 1,
          column: 1,
          code: 'missing-documentation',
          source: 'linter'
        });
      }
    }
  }

  /**
   * Quick syntax check (without compilation)
   */
  async quickCheck(code: string): Promise<SyntaxIssue[]> {
    const issues: SyntaxIssue[] = [];
    
    this.runStaticAnalysis(code, issues);
    this.runLinterChecks(code, issues);
    
    return issues.sort((a, b) => a.line - b.line);
  }
}

export const syntaxCheckerService = new SyntaxCheckerService();
