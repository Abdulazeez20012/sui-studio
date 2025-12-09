import { apiService } from './apiService';

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

class TestService {
  private projectId: string | null = null;

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  /**
   * Run all tests
   */
  async runTests(options?: {
    filter?: string;
    coverage?: boolean;
  }): Promise<TestReport> {
    try {
      const response = await apiService.post('/test/run', {
        projectId: this.projectId,
        ...options,
      });
      return response.report;
    } catch (error) {
      console.error('Run tests error:', error);
      throw error;
    }
  }

  /**
   * Run single test
   */
  async runSingleTest(testName: string): Promise<TestResult> {
    try {
      const response = await apiService.post('/test/run-single', {
        projectId: this.projectId,
        testName,
      });
      return response.result;
    } catch (error) {
      console.error('Run single test error:', error);
      throw error;
    }
  }

  /**
   * Get coverage report
   */
  async getCoverage(): Promise<CoverageReport> {
    try {
      const response = await apiService.get(`/test/coverage?projectId=${this.projectId}`);
      return response.coverage;
    } catch (error) {
      console.error('Get coverage error:', error);
      throw error;
    }
  }

  /**
   * List all tests
   */
  async listTests(): Promise<string[]> {
    try {
      const response = await apiService.get(`/test/list?projectId=${this.projectId}`);
      return response.tests || [];
    } catch (error) {
      console.error('List tests error:', error);
      return [];
    }
  }
}

export const testService = new TestService();
