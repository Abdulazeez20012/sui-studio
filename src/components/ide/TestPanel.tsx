import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { testService, TestReport, TestSuite, TestResult } from '../../services/testService';

const TestPanel: React.FC = () => {
  const [report, setReport] = useState<TestReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCoverage, setShowCoverage] = useState(false);
  const [filter, setFilter] = useState('');

  const runAllTests = async () => {
    setLoading(true);
    try {
      const testReport = await testService.runTests({
        filter: filter || undefined,
        coverage: showCoverage,
      });
      setReport(testReport);
    } catch (error) {
      console.error('Test run failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const runSingleTest = async (testName: string) => {
    setLoading(true);
    try {
      await testService.runSingleTest(testName);
      await runAllTests(); // Refresh all results
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="h-full flex flex-col bg-walrus-dark-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-tech font-bold flex items-center gap-2">
            <Play className="w-5 h-5 text-cyan-400" />
            Tests
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCoverage(!showCoverage)}
              className={`p-2 rounded transition-colors ${
                showCoverage ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'
              }`}
              title="Show coverage"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="p-2 hover:bg-white/5 rounded transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tests..."
              className="w-full pl-10 pr-3 py-2 bg-walrus-dark-800 border border-white/10 rounded text-sm font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            onClick={runAllTests}
            disabled={loading}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run Tests
          </button>
        </div>

        {/* Stats */}
        {report && (
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              {report.totalPassed} passed
            </div>
            {report.totalFailed > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <XCircle className="w-4 h-4" />
                {report.totalFailed} failed
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              {formatDuration(report.totalDuration)}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {report ? (
          <div className="space-y-4">
            {/* Test Suites */}
            {report.suites.map((suite, index) => (
              <TestSuiteView
                key={index}
                suite={suite}
                onRunTest={runSingleTest}
                formatDuration={formatDuration}
                getStatusIcon={getStatusIcon}
              />
            ))}

            {/* Coverage */}
            {showCoverage && report.coverage && (
              <CoverageView coverage={report.coverage} />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Click "Run Tests" to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPanel;


// Test Suite Component
const TestSuiteView: React.FC<{
  suite: TestSuite;
  onRunTest: (name: string) => void;
  formatDuration: (ms: number) => string;
  getStatusIcon: (status: string) => JSX.Element;
}> = ({ suite, onRunTest, formatDuration, getStatusIcon }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-tech font-bold">{suite.name}</span>
          <span className="text-sm text-gray-400">
            ({suite.passed}/{suite.tests.length})
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-3 h-3" />
          {formatDuration(suite.duration)}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10">
          {suite.tests.map((test, index) => (
            <div
              key={index}
              className="p-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {getStatusIcon(test.status)}
                  <span className="font-mono text-sm">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {formatDuration(test.duration)}
                  </span>
                  <button
                    onClick={() => onRunTest(test.name)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {test.error && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs font-mono text-red-300">
                  {test.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Coverage Component
const CoverageView: React.FC<{
  coverage: import('../../services/testService').CoverageReport;
}> = ({ coverage }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h3 className="font-tech font-bold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        Coverage Report
      </h3>

      {/* Overall Coverage */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400 mb-1">Lines</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${coverage.lines.percentage}%` }}
              />
            </div>
            <span className="text-sm font-bold">{coverage.lines.percentage}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {coverage.lines.covered}/{coverage.lines.total}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-400 mb-1">Functions</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${coverage.functions.percentage}%` }}
              />
            </div>
            <span className="text-sm font-bold">{coverage.functions.percentage}%</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {coverage.functions.covered}/{coverage.functions.total}
          </div>
        </div>
      </div>

      {/* File Coverage */}
      <div className="space-y-2">
        <div className="text-sm text-gray-400 mb-2">Files</div>
        {coverage.files.map((file, index) => (
          <div key={index} className="p-2 bg-white/5 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-mono">{file.path}</span>
              <span className="text-sm font-bold">{file.lines.percentage}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${file.lines.percentage}%` }}
              />
            </div>
            {file.uncoveredLines.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                Uncovered lines: {file.uncoveredLines.join(', ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
