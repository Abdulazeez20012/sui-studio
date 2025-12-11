/**
 * Real Move Test Runner Service
 * Executes actual Move tests using Sui CLI
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface TestResult {
  name: string;
  module: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  gasUsed?: number;
}

export interface TestSuiteResult {
  id: string;
  projectName: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  tests: TestResult[];
  coverage?: CoverageReport;
  timestamp: Date;
  cliAvailable: boolean;
}

export interface CoverageReport {
  totalLines: number;
  coveredLines: number;
  percentage: number;
  modules: ModuleCoverage[];
}

export interface ModuleCoverage {
  name: string;
  totalLines: number;
  coveredLines: number;
  percentage: number;
  uncoveredLines: number[];
}

class TestRunnerService {
  private tempDir: string = '/tmp/sui-test';
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
      await execAsync('sui --version', { timeout: 5000 });
      this.suiCliAvailable = true;
      return true;
    } catch {
      this.suiCliAvailable = false;
      return false;
    }
  }

  /**
   * Run Move tests using Sui CLI
   */
  async runTests(
    code: string,
    packageName: string = 'test_package',
    options: {
      filter?: string;
      coverage?: boolean;
      gasReport?: boolean;
    } = {}
  ): Promise<TestSuiteResult> {
    const startTime = Date.now();
    const testId = `test-${Date.now()}`;

    const cliAvailable = await this.checkSuiCLI();
    
    if (!cliAvailable) {
      return {
        id: testId,
        projectName: packageName,
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        duration: Date.now() - startTime,
        tests: [],
        timestamp: new Date(),
        cliAvailable: false,
      };
    }

    const projectDir = await this.createTestProject(code, packageName);

    try {
      // Build test command
      let testCmd = `sui move test --path ${projectDir}`;
      if (options.filter) {
        testCmd += ` --filter ${options.filter}`;
      }
      if (options.coverage) {
        testCmd += ' --coverage';
      }
      if (options.gasReport) {
        testCmd += ' --gas-report';
      }

      // Execute tests
      const { stdout, stderr } = await execAsync(testCmd, {
        timeout: 120000, // 2 minutes
        maxBuffer: 1024 * 1024 * 10,
      });

      // Parse test results
      const tests = this.parseTestOutput(stdout + '\n' + stderr);
      const coverage = options.coverage ? this.parseCoverageOutput(stdout) : undefined;

      const passed = tests.filter((t) => t.status === 'passed').length;
      const failed = tests.filter((t) => t.status === 'failed').length;
      const skipped = tests.filter((t) => t.status === 'skipped').length;

      return {
        id: testId,
        projectName: packageName,
        totalTests: tests.length,
        passed,
        failed,
        skipped,
        duration: Date.now() - startTime,
        tests,
        coverage,
        timestamp: new Date(),
        cliAvailable: true,
      };
    } catch (error: any) {
      // Parse failed test output
      const output = [error.stdout || '', error.stderr || ''].join('\n');
      const tests = this.parseTestOutput(output);

      const passed = tests.filter((t) => t.status === 'passed').length;
      const failed = tests.filter((t) => t.status === 'failed').length;
      const skipped = tests.filter((t) => t.status === 'skipped').length;

      return {
        id: testId,
        projectName: packageName,
        totalTests: tests.length || 1,
        passed,
        failed: failed || 1,
        skipped,
        duration: Date.now() - startTime,
        tests: tests.length > 0 ? tests : [{
          name: 'compilation',
          module: packageName,
          status: 'failed',
          duration: Date.now() - startTime,
          error: this.extractError(output),
        }],
        timestamp: new Date(),
        cliAvailable: true,
      };
    } finally {
      await this.cleanup(projectDir);
    }
  }

  /**
   * Create temporary test project
   */
  private async createTestProject(code: string, packageName: string): Promise<string> {
    const projectDir = path.join(this.tempDir, `${packageName}-${Date.now()}`);
    await fs.mkdir(projectDir, { recursive: true });

    // Create Move.toml
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

    // Create sources directory
    const sourcesDir = path.join(projectDir, 'sources');
    await fs.mkdir(sourcesDir);
    await fs.writeFile(path.join(sourcesDir, `${packageName}.move`), code);

    return projectDir;
  }

  /**
   * Parse test output from Sui CLI
   */
  private parseTestOutput(output: string): TestResult[] {
    const tests: TestResult[] = [];
    const lines = output.split('\n');

    // Pattern: [ PASS ] module::test_name
    // Pattern: [ FAIL ] module::test_name
    const testPattern = /\[\s*(PASS|FAIL|SKIP)\s*\]\s+(\S+)::(\S+)/;
    const gasPattern = /gas used:\s*(\d+)/i;
    const timePattern = /(\d+(?:\.\d+)?)\s*(?:ms|s)/;

    let currentTest: Partial<TestResult> | null = null;

    for (const line of lines) {
      const testMatch = line.match(testPattern);
      if (testMatch) {
        if (currentTest) {
          tests.push(currentTest as TestResult);
        }

        const statusRaw = testMatch[1].toLowerCase();
        const status: 'passed' | 'failed' | 'skipped' = 
          statusRaw === 'pass' ? 'passed' : 
          statusRaw === 'fail' ? 'failed' : 
          'skipped';
        currentTest = {
          name: testMatch[3],
          module: testMatch[2],
          status,
          duration: 0,
        };

        // Check for gas usage
        const gasMatch = line.match(gasPattern);
        if (gasMatch) {
          currentTest.gasUsed = parseInt(gasMatch[1]);
        }

        // Check for duration
        const timeMatch = line.match(timePattern);
        if (timeMatch) {
          currentTest.duration = parseFloat(timeMatch[1]);
          if (line.includes('s') && !line.includes('ms')) {
            currentTest.duration *= 1000;
          }
        }
      }

      // Capture error messages for failed tests
      if (currentTest && currentTest.status === 'failed') {
        if (line.includes('Error:') || line.includes('error:') || line.includes('assertion failed')) {
          currentTest.error = (currentTest.error || '') + line.trim() + '\n';
        }
      }
    }

    if (currentTest) {
      tests.push(currentTest as TestResult);
    }

    // Also check for "Running X tests" pattern
    const runningMatch = output.match(/Running\s+(\d+)\s+test/i);
    const passedMatch = output.match(/(\d+)\s+passing/i);
    const failedMatch = output.match(/(\d+)\s+failing/i);

    // If we found summary but no individual tests, create summary entries
    if (tests.length === 0 && runningMatch) {
      const total = parseInt(runningMatch[1]);
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;

      for (let i = 0; i < passed; i++) {
        tests.push({
          name: `test_${i + 1}`,
          module: 'unknown',
          status: 'passed',
          duration: 0,
        });
      }
      for (let i = 0; i < failed; i++) {
        tests.push({
          name: `test_${passed + i + 1}`,
          module: 'unknown',
          status: 'failed',
          duration: 0,
          error: 'Test failed - see output for details',
        });
      }
    }

    return tests;
  }

  /**
   * Parse coverage output
   */
  private parseCoverageOutput(output: string): CoverageReport | undefined {
    const coverageMatch = output.match(/Coverage:\s*(\d+(?:\.\d+)?)\s*%/i);
    if (!coverageMatch) return undefined;

    const percentage = parseFloat(coverageMatch[1]);
    const modules: ModuleCoverage[] = [];

    // Parse per-module coverage
    const modulePattern = /(\w+)::\w+\s+(\d+)\/(\d+)\s+\((\d+(?:\.\d+)?)\s*%\)/g;
    let match;
    while ((match = modulePattern.exec(output)) !== null) {
      modules.push({
        name: match[1],
        coveredLines: parseInt(match[2]),
        totalLines: parseInt(match[3]),
        percentage: parseFloat(match[4]),
        uncoveredLines: [],
      });
    }

    const totalLines = modules.reduce((sum, m) => sum + m.totalLines, 0) || 100;
    const coveredLines = Math.round((percentage / 100) * totalLines);

    return {
      totalLines,
      coveredLines,
      percentage,
      modules,
    };
  }

  /**
   * Extract main error from output
   */
  private extractError(output: string): string {
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('error') || line.includes('Error') || line.includes('failed')) {
        return line.trim();
      }
    }
    return 'Test execution failed';
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
   * Run a single test by name
   */
  async runSingleTest(
    code: string,
    testName: string,
    packageName: string = 'test_package'
  ): Promise<TestResult> {
    const result = await this.runTests(code, packageName, { filter: testName });
    return result.tests[0] || {
      name: testName,
      module: packageName,
      status: 'failed',
      duration: 0,
      error: 'Test not found',
    };
  }
}

export const testRunner = new TestRunnerService();
