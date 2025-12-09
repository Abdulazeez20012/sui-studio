import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

const execAsync = promisify(exec);

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

export class SuiCompiler {
  private tempDir: string = '/tmp/sui-compile';
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

  /**
   * Check if Sui CLI is available
   */
  async checkSuiCLI(): Promise<boolean> {
    if (this.suiCliAvailable !== null) {
      return this.suiCliAvailable;
    }

    try {
      const { stdout } = await execAsync('sui --version', { timeout: 5000 });
      this.suiCliAvailable = true;
      console.log('Sui CLI detected:', stdout.trim());
      return true;
    } catch (error) {
      this.suiCliAvailable = false;
      console.warn('Sui CLI not available');
      return false;
    }
  }

  /**
   * Compile Move code
   */
  async compile(
    code: string,
    packageName: string = 'temp_package',
    options: {
      skipFetch?: boolean;
      testMode?: boolean;
      generateDocs?: boolean;
    } = {}
  ): Promise<CompilationResult> {
    const startTime = Date.now();

    // Check if Sui CLI is available
    const cliAvailable = await this.checkSuiCLI();
    if (!cliAvailable) {
      return this.simulateCompilation(code, packageName);
    }

    // Create project directory
    const projectDir = await this.createProject(code, packageName);

    try {
      // Build command
      let buildCmd = `sui move build --path ${projectDir}`;
      if (options.skipFetch) {
        buildCmd += ' --skip-fetch-latest-git-deps';
      }
      if (options.testMode) {
        buildCmd += ' --test';
      }
      if (options.generateDocs) {
        buildCmd += ' --doc';
      }

      // Execute compilation
      const { stdout, stderr } = await execAsync(buildCmd, {
        timeout: 60000, // 60 seconds
        maxBuffer: 1024 * 1024 * 10, // 10MB
      });

      // Parse results
      const result = await this.parseSuccessfulBuild(
        projectDir,
        packageName,
        stdout,
        stderr,
        Date.now() - startTime
      );

      return result;
    } catch (error: any) {
      // Parse compilation errors
      return this.parseFailedBuild(error, Date.now() - startTime);
    } finally {
      // Cleanup
      await this.cleanup(projectDir);
    }
  }

  /**
   * Create a temporary Move project
   */
  private async createProject(code: string, packageName: string): Promise<string> {
    const projectDir = path.join(this.tempDir, `${packageName}-${Date.now()}`);
    await fs.mkdir(projectDir, { recursive: true });

    // Create Move.toml
    const moveToml = this.generateMoveToml(packageName);
    await fs.writeFile(path.join(projectDir, 'Move.toml'), moveToml);

    // Create sources directory
    const sourcesDir = path.join(projectDir, 'sources');
    await fs.mkdir(sourcesDir);

    // Write Move code
    await fs.writeFile(path.join(sourcesDir, `${packageName}.move`), code);

    return projectDir;
  }

  /**
   * Generate Move.toml configuration
   */
  private generateMoveToml(packageName: string): string {
    return `[package]
name = "${packageName}"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
${packageName} = "0x0"
`;
  }

  /**
   * Parse successful build output
   */
  private async parseSuccessfulBuild(
    projectDir: string,
    packageName: string,
    stdout: string,
    stderr: string,
    compilationTime: number
  ): Promise<CompilationResult> {
    const buildDir = path.join(projectDir, 'build', packageName);
    const bytecodeDir = path.join(buildDir, 'bytecode_modules');

    // Read compiled modules
    const modules: string[] = [];
    try {
      const files = await fs.readdir(bytecodeDir);
      for (const file of files) {
        const content = await fs.readFile(path.join(bytecodeDir, file));
        modules.push(content.toString('base64'));
      }
    } catch (error) {
      console.error('Failed to read bytecode modules:', error);
    }

    // Parse warnings from output
    const warnings = this.parseWarnings(stdout + '\n' + stderr);

    // Read build info
    const buildInfo = await this.readBuildInfo(buildDir, packageName, compilationTime);

    return {
      success: true,
      bytecode: modules[0] || '',
      modules,
      dependencies: buildInfo?.dependencies ? Object.keys(buildInfo.dependencies) : [],
      warnings,
      gasEstimate: this.estimateGas(modules),
      buildInfo,
      cached: false,
    };
  }

  /**
   * Parse failed build output
   */
  private parseFailedBuild(error: any, compilationTime: number): CompilationResult {
    const output = [error.stdout || '', error.stderr || '', error.message || '']
      .filter(Boolean)
      .join('\n');

    const errors = this.parseErrors(output);
    const warnings = this.parseWarnings(output);

    return {
      success: false,
      errors,
      warnings,
      cached: false,
    };
  }

  /**
   * Parse compilation errors with enhanced detection
   */
  private parseErrors(output: string): CompilationError[] {
    const errors: CompilationError[] = [];
    const lines = output.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Match error patterns
      if (this.isErrorLine(line)) {
        const error = this.parseErrorLine(line, lines, i);
        if (error) {
          errors.push(error);
        }
      }
    }

    // If no structured errors, return generic error
    if (errors.length === 0 && output.trim()) {
      errors.push({
        message: this.extractMainError(output),
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Check if line contains an error
   */
  private isErrorLine(line: string): boolean {
    const errorPatterns = [
      /error\[E\d+\]/i,
      /error:/i,
      /compilation failed/i,
      /cannot find/i,
      /undefined/i,
      /type mismatch/i,
    ];

    return errorPatterns.some(pattern => pattern.test(line));
  }

  /**
   * Parse a single error line with context
   */
  private parseErrorLine(
    line: string,
    allLines: string[],
    index: number
  ): CompilationError | null {
    const error: CompilationError = {
      message: line.trim(),
      severity: 'error',
    };

    // Extract file location: file.move:10:5
    const locationMatch = line.match(/([^:]+\.move):(\d+):(\d+)/);
    if (locationMatch) {
      error.file = path.basename(locationMatch[1]);
      error.line = parseInt(locationMatch[2]);
      error.column = parseInt(locationMatch[3]);
    }

    // Extract error code: error[E01234]
    const codeMatch = line.match(/error\[([^\]]+)\]/i);
    if (codeMatch) {
      error.code = codeMatch[1];
    }

    // Look for suggestion in following lines
    for (let i = index + 1; i < Math.min(index + 5, allLines.length); i++) {
      if (allLines[i].includes('help:') || allLines[i].includes('suggestion:')) {
        error.suggestion = allLines[i].replace(/.*(?:help|suggestion):\s*/i, '').trim();
        break;
      }
    }

    return error;
  }

  /**
   * Extract main error message from output
   */
  private extractMainError(output: string): string {
    const lines = output.split('\n').filter(l => l.trim());
    
    // Find first error line
    for (const line of lines) {
      if (this.isErrorLine(line)) {
        return line.trim();
      }
    }

    // Return first non-empty line
    return lines[0] || 'Compilation failed';
  }

  /**
   * Parse warnings from output
   */
  private parseWarnings(output: string): CompilationWarning[] {
    const warnings: CompilationWarning[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      if (line.includes('warning:') || line.includes('Warning:')) {
        const warning: CompilationWarning = {
          message: line.replace(/.*warning:\s*/i, '').trim(),
        };

        // Extract location if present
        const locationMatch = line.match(/([^:]+\.move):(\d+):(\d+)/);
        if (locationMatch) {
          warning.file = path.basename(locationMatch[1]);
          warning.line = parseInt(locationMatch[2]);
          warning.column = parseInt(locationMatch[3]);
        }

        warnings.push(warning);
      }
    }

    return warnings;
  }

  /**
   * Read build information
   */
  private async readBuildInfo(
    buildDir: string,
    packageName: string,
    compilationTime: number
  ): Promise<BuildInfo | undefined> {
    try {
      // Try to read package manifest
      const manifestPath = path.join(buildDir, 'package-digest');
      const sourcesPath = path.join(buildDir, 'sources');

      const modules: string[] = [];
      try {
        const files = await fs.readdir(sourcesPath);
        modules.push(...files.filter(f => f.endsWith('.move')));
      } catch (error) {
        // Sources directory might not exist
      }

      return {
        packageName,
        version: '0.0.1',
        dependencies: {
          Sui: 'framework/mainnet',
        },
        modules,
        compilationTime,
      };
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Estimate gas usage from compiled modules
   */
  private estimateGas(modules: string[]): number {
    let totalGas = 1000; // Base gas

    for (const module of modules) {
      // Estimate based on bytecode size
      const size = Buffer.from(module, 'base64').length;
      totalGas += size * 10; // 10 gas per byte (rough estimate)
    }

    return totalGas;
  }

  /**
   * Simulate compilation when Sui CLI is not available
   */
  private simulateCompilation(code: string, packageName: string): CompilationResult {
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const simulatedBytecode = Buffer.from(`simulated-${hash.substring(0, 16)}`).toString('base64');

    // Basic syntax check
    const errors = this.basicSyntaxCheck(code);

    if (errors.length > 0) {
      return {
        success: false,
        errors,
        simulated: true,
      };
    }

    return {
      success: true,
      bytecode: simulatedBytecode,
      modules: [simulatedBytecode],
      dependencies: ['0x1', '0x2'],
      gasEstimate: 5000,
      simulated: true,
      cached: false,
    };
  }

  /**
   * Basic syntax checking for simulation mode
   */
  private basicSyntaxCheck(code: string): CompilationError[] {
    const errors: CompilationError[] = [];

    // Check for module declaration
    if (!code.includes('module ')) {
      errors.push({
        message: 'Missing module declaration',
        severity: 'error',
        suggestion: 'Add a module declaration: module package_name::module_name { ... }',
      });
    }

    // Check for balanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push({
        message: 'Unbalanced braces',
        severity: 'error',
        suggestion: `Found ${openBraces} opening braces and ${closeBraces} closing braces`,
      });
    }

    return errors;
  }

  /**
   * Cleanup temporary files
   */
  private async cleanup(projectDir: string): Promise<void> {
    try {
      await fs.rm(projectDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  /**
   * Test compilation with a sample Move module
   */
  async test(): Promise<boolean> {
    const testCode = `
module test::hello {
    use std::string;
    
    public fun hello_world(): string::String {
        string::utf8(b"Hello, World!")
    }
}
`;

    try {
      const result = await this.compile(testCode, 'test');
      return result.success;
    } catch (error) {
      console.error('Compiler test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const suiCompiler = new SuiCompiler();
