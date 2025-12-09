/**
 * Move Code Formatter Service
 * Formats Sui Move code according to style guidelines
 */

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

export class MoveFormatter {
  private defaultOptions: FormatOptions = {
    indentSize: 4,
    useTabs: false,
    maxLineLength: 100,
    insertFinalNewline: true,
  };

  /**
   * Format Move code
   */
  format(code: string, options?: FormatOptions): string {
    const opts = { ...this.defaultOptions, ...options };
    const indent = opts.useTabs ? '\t' : ' '.repeat(opts.indentSize!);

    let formatted = code;

    // Normalize line endings
    formatted = formatted.replace(/\r\n/g, '\n');

    // Format module structure
    formatted = this.formatModuleStructure(formatted, indent);

    // Format functions
    formatted = this.formatFunctions(formatted, indent);

    // Format structs
    formatted = this.formatStructs(formatted, indent);

    // Format expressions
    formatted = this.formatExpressions(formatted, indent);

    // Remove trailing whitespace
    formatted = formatted.replace(/[ \t]+$/gm, '');

    // Ensure single blank line between top-level items
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // Add final newline if needed
    if (opts.insertFinalNewline && !formatted.endsWith('\n')) {
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Lint Move code
   */
  lint(code: string): LintIssue[] {
    const issues: LintIssue[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Check line length
      if (line.length > this.defaultOptions.maxLineLength!) {
        issues.push({
          line: lineNum,
          column: this.defaultOptions.maxLineLength!,
          severity: 'warning',
          message: `Line exceeds ${this.defaultOptions.maxLineLength} characters`,
          rule: 'max-line-length',
        });
      }

      // Check trailing whitespace
      if (line.match(/\s+$/)) {
        issues.push({
          line: lineNum,
          column: line.length,
          severity: 'info',
          message: 'Trailing whitespace',
          rule: 'no-trailing-whitespace',
        });
      }

      // Check for tabs
      if (line.includes('\t')) {
        issues.push({
          line: lineNum,
          column: line.indexOf('\t'),
          severity: 'warning',
          message: 'Use spaces instead of tabs',
          rule: 'no-tabs',
        });
      }

      // Check naming conventions
      this.checkNamingConventions(line, lineNum, issues);

      // Check for common mistakes
      this.checkCommonMistakes(line, lineNum, issues);
    });

    return issues;
  }

  private formatModuleStructure(code: string, indent: string): string {
    // Format module declaration
    code = code.replace(/module\s+(\w+::[\w]+)\s*{/g, 'module $1 {');

    // Format use statements
    code = code.replace(/use\s+(\w+::[\w:]+);/g, 'use $1;');

    return code;
  }

  private formatFunctions(code: string, indent: string): string {
    // Format function declarations
    code = code.replace(
      /(public\s+)?(entry\s+)?fun\s+(\w+)\s*\(/g,
      (match, pub, entry, name) => {
        let result = '';
        if (pub) result += 'public ';
        if (entry) result += 'entry ';
        result += `fun ${name}(`;
        return result;
      }
    );

    // Format function parameters
    code = code.replace(/\(\s+/g, '(');
    code = code.replace(/\s+\)/g, ')');
    code = code.replace(/,(\S)/g, ', $1');

    return code;
  }

  private formatStructs(code: string, indent: string): string {
    // Format struct declarations
    code = code.replace(/struct\s+(\w+)\s*{/g, 'struct $1 {');

    // Format struct fields
    code = code.replace(/(\w+)\s*:\s*(\w+),/g, '$1: $2,');

    return code;
  }

  private formatExpressions(code: string, indent: string): string {
    // Format binary operators
    code = code.replace(/(\w+)([+\-*/%=<>!&|]+)(\w+)/g, '$1 $2 $3');

    // Format assignment
    code = code.replace(/(\w+)=(\w+)/g, '$1 = $2');

    // Format semicolons
    code = code.replace(/\s+;/g, ';');

    // Format commas
    code = code.replace(/,(\S)/g, ', $1');

    return code;
  }

  private checkNamingConventions(line: string, lineNum: number, issues: LintIssue[]): void {
    // Check function names (snake_case)
    const funMatch = line.match(/fun\s+([A-Z]\w+)/);
    if (funMatch) {
      issues.push({
        line: lineNum,
        column: line.indexOf(funMatch[1]),
        severity: 'warning',
        message: 'Function names should use snake_case',
        rule: 'function-naming',
      });
    }

    // Check struct names (PascalCase)
    const structMatch = line.match(/struct\s+([a-z]\w+)/);
    if (structMatch) {
      issues.push({
        line: lineNum,
        column: line.indexOf(structMatch[1]),
        severity: 'warning',
        message: 'Struct names should use PascalCase',
        rule: 'struct-naming',
      });
    }

    // Check constant names (UPPER_CASE)
    const constMatch = line.match(/const\s+([a-z]\w+)/);
    if (constMatch) {
      issues.push({
        line: lineNum,
        column: line.indexOf(constMatch[1]),
        severity: 'warning',
        message: 'Constant names should use UPPER_CASE',
        rule: 'constant-naming',
      });
    }
  }

  private checkCommonMistakes(line: string, lineNum: number, issues: LintIssue[]): void {
    // Check for missing semicolons
    if (line.match(/^\s*(let|return|abort)\s+.+[^;{]$/)) {
      issues.push({
        line: lineNum,
        column: line.length,
        severity: 'error',
        message: 'Missing semicolon',
        rule: 'missing-semicolon',
      });
    }

    // Check for unused variables
    if (line.match(/let\s+_\w+\s*=/)) {
      issues.push({
        line: lineNum,
        column: line.indexOf('_'),
        severity: 'info',
        message: 'Variable name starts with underscore (unused)',
        rule: 'unused-variable',
      });
    }

    // Check for TODO comments
    if (line.includes('TODO') || line.includes('FIXME')) {
      issues.push({
        line: lineNum,
        column: line.indexOf('TODO') >= 0 ? line.indexOf('TODO') : line.indexOf('FIXME'),
        severity: 'info',
        message: 'TODO/FIXME comment found',
        rule: 'todo-comment',
      });
    }
  }

  /**
   * Get formatting suggestions
   */
  getSuggestions(code: string): string[] {
    const suggestions: string[] = [];
    const issues = this.lint(code);

    // Count issues by type
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    if (errorCount > 0) {
      suggestions.push(`Fix ${errorCount} error(s)`);
    }

    if (warningCount > 0) {
      suggestions.push(`Address ${warningCount} warning(s)`);
    }

    // Check for common improvements
    if (!code.includes('/// ')) {
      suggestions.push('Add documentation comments');
    }

    if (!code.includes('abort')) {
      suggestions.push('Consider adding error handling');
    }

    if (code.split('\n').length > 200) {
      suggestions.push('Consider splitting into multiple modules');
    }

    return suggestions;
  }

  /**
   * Auto-fix common issues
   */
  autoFix(code: string): string {
    let fixed = code;

    // Remove trailing whitespace
    fixed = fixed.replace(/[ \t]+$/gm, '');

    // Fix spacing around operators
    fixed = fixed.replace(/(\w+)([+\-*/%=<>!&|]+)(\w+)/g, '$1 $2 $3');

    // Fix spacing after commas
    fixed = fixed.replace(/,(\S)/g, ', $1');

    // Fix spacing in function calls
    fixed = fixed.replace(/\(\s+/g, '(');
    fixed = fixed.replace(/\s+\)/g, ')');

    // Ensure final newline
    if (!fixed.endsWith('\n')) {
      fixed += '\n';
    }

    return fixed;
  }
}

export const moveFormatter = new MoveFormatter();
