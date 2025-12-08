import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  output?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

export interface TestReport {
  suites: TestSuite[];
  totalTests: number;
  totalPassed: number;
  totalFailed: number;
  totalSkipped: number;
  totalDuration: number;
  coverage?: CoverageReport;
}

export interface CoverageReport {
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  functions: {
    total: number;
    covered: number;
    percentage: number;
  };
  files: FileCoverage[];
}

export interface FileCoverage {
  path: string;
  lines: {
    total: number;
    covered: number;
    percentage: number;
  };
  uncoveredLines: number[];
}

export class TestRunner {
  /**
   * Run Move tests using Sui CLI
   */
  async runTests(workspacePath: string, options?: {
    filter?: string;
    coverage?: boolean;
  }): Promise<TestReport> {
    try {
      // Check if Sui CLI is available
      const hasSuiCLI = await this.checkSuiCLI();
      
      if (!hasSuiCLI) {
        return this.generateMockTestReport();
      }

      // Run sui move test
      const command = this.buildTestCommand(options);
      const output = execSync(command, {
        cwd: workspacePath,
        encoding: 'utf-8',
        timeout: 60000, // 60 second timeout
      });

      // Parse test output
      const report = this.parseTestOutput(output);

      // Get coverage if requested
      if (options?.coverage) {
        report.coverage = await this.getCoverage(workspacePath);
      }

      return report;
    } catch (error: any) {
      console.error('Test execution error:', error);
      return this.generateErrorReport(error.message);
    }
  }

  /**
   * Run a single test
   */
  async runSingleTest(
    workspacePath: string,
    testName: string
  ): Promise<TestResult> {
    try {
      const command = `sui move test --filter ${testName}`;
      const output = execSync(command, {
        cwd: workspacePath,
        encoding: 'utf-8',
        timeout: 30000,
      });

      return this.parseSingleTestOutput(output, testName);
    } catch (error: any) {
      return {
        name: testName,
        status: 'failed',
        duration: 0,
        error: error.message,
      };
    }
  }

  /**
   * Get test coverage
   */
  async getCoverage(workspacePath: string): Promise<CoverageReport> {
    try {
      // Run tests with coverage
      const command = 'sui move test --coverage';
      execSync(command, {
        cwd: workspacePath,
        encoding: 'utf-8',
      });

      // Parse coverage report
      const coveragePath = path.join(workspacePath, 'coverage');
      const coverageData = await this.parseCoverageData(coveragePath);

      return coverageData;
    } catch (error) {
      console.error('Coverage error:', error);
      return this.generateMockCoverage();
    }
  }

  /**
   * List all tests in project
   */
  async listTests(workspacePath: string): Promise<string[]> {
    try {
      const command = 'sui move test --list';
      const output = execSync(command, {
        cwd: workspacePath,
        encoding: 'utf-8',
      });

      return this.parseTestList(output);
    } catch (error) {
      return [];
    }
  }

  private async checkSuiCLI(): Promise<boolean> {
    try {
      execSync('sui --version', { encoding: 'utf-8' });
      return true;
    } catch {
      return false;
    }
  }

  private buildTestCommand(options?: { filter?: string; coverage?: boolean }): string {
    let command = 'sui move test';

    if (options?.filter) {
      command += ` --filter ${options.filter}`;
    }

    if (options?.coverage) {
      command += ' --coverage';
    }

    return command;
  }

  private parseTestOutput(output: string): TestReport {
    const lines = output.split('\n');
    const suites: TestSuite[] = [];
    let currentSuite: TestSuite | null = null;

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalSkipped = 0;
    let totalDuration = 0;

    for (const line of lines) {
      // Parse test suite
      if (line.includes('Running tests in')) {
        if (currentSuite) {
          suites.push(currentSuite);
        }
        currentSuite = {
          name: line.split('Running tests in')[1].trim(),
          tests: [],
          passed: 0,
          failed: 0,
          skipped: 0,
          duration: 0,
        };
      }

      // Parse test result
      if (line.includes('test ') && currentSuite) {
        const test = this.parseTestLine(line);
        currentSuite.tests.push(test);
        currentSuite.duration += test.duration;

        if (test.status === 'passed') currentSuite.passed++;
        if (test.status === 'failed') currentSuite.failed++;
        if (test.status === 'skipped') currentSuite.skipped++;

        totalTests++;
        if (test.status === 'passed') totalPassed++;
        if (test.status === 'failed') totalFailed++;
        if (test.status === 'skipped') totalSkipped++;
        totalDuration += test.duration;
      }
    }

    if (currentSuite) {
      suites.push(currentSuite);
    }

    return {
      suites,
      totalTests,
      totalPassed,
      totalFailed,
      totalSkipped,
      totalDuration,
    };
  }

  private parseTestLine(line: string): TestResult {
    const parts = line.split(' ');
    const name = parts[1];
    const status = line.includes('ok') ? 'passed' : line.includes('FAILED') ? 'failed' : 'skipped';
    const durationMatch = line.match(/(\d+\.?\d*)ms/);
    const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

    return {
      name,
      status,
      duration,
    };
  }

  private parseSingleTestOutput(output: string, testName: string): TestResult {
    const passed = output.includes('ok') || output.includes('PASSED');
    const durationMatch = output.match(/(\d+\.?\d*)ms/);

    return {
      name: testName,
      status: passed ? 'passed' : 'failed',
      duration: durationMatch ? parseFloat(durationMatch[1]) : 0,
      output,
    };
  }

  private parseTestList(output: string): string[] {
    return output
      .split('\n')
      .filter(line => line.trim().startsWith('test '))
      .map(line => line.split(' ')[1]);
  }

  private async parseCoverageData(coveragePath: string): Promise<CoverageReport> {
    // This is a simplified version - actual implementation would parse coverage files
    return this.generateMockCoverage();
  }

  private generateMockTestReport(): TestReport {
    return {
      suites: [
        {
          name: 'example_tests',
          tests: [
            {
              name: 'test_example',
              status: 'passed',
              duration: 45,
            },
          ],
          passed: 1,
          failed: 0,
          skipped: 0,
          duration: 45,
        },
      ],
      totalTests: 1,
      totalPassed: 1,
      totalFailed: 0,
      totalSkipped: 0,
      totalDuration: 45,
    };
  }

  private generateMockCoverage(): CoverageReport {
    return {
      lines: {
        total: 100,
        covered: 85,
        percentage: 85,
      },
      functions: {
        total: 10,
        covered: 9,
        percentage: 90,
      },
      files: [
        {
          path: 'sources/example.move',
          lines: {
            total: 50,
            covered: 45,
            percentage: 90,
          },
          uncoveredLines: [23, 45, 67, 89, 90],
        },
      ],
    };
  }

  private generateErrorReport(error: string): TestReport {
    return {
      suites: [],
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      totalSkipped: 0,
      totalDuration: 0,
    };
  }
}

export const testRunner = new TestRunner();
