import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Terminal as TerminalIcon,
  AlertCircle,
} from 'lucide-react';
import { useElectronTerminal } from '../../hooks/useElectronTerminal';
import { useElectronFileSystem } from '../../hooks/useElectronFileSystem';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration?: number;
  error?: string;
}

const TestPanel: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [summary, setSummary] = useState<{ passed: number; failed: number; total: number } | null>(null);
  
  const { executeCommand, isElectron } = useElectronTerminal();
  const { currentFolder } = useElectronFileSystem();

  const runTests = async () => {
    if (!isElectron) {
      alert('Test execution is only available in the desktop app');
      return;
    }

    if (!currentFolder) {
      alert('Please open a project folder first');
      return;
    }

    setIsRunning(true);
    setOutput('');
    setTestResults([]);
    setSummary(null);

    try {
      // Execute sui move test
      const result = await executeCommand('sui move test', currentFolder);
      
      setOutput(result.output);

      // Parse test results
      const parsed = parseTestOutput(result.output);
      setTestResults(parsed.tests);
      setSummary(parsed.summary);

    } catch (error: any) {
      setOutput(`Error running tests: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const parseTestOutput = (output: string): { tests: TestResult[]; summary: { passed: number; failed: number; total: number } } => {
    const tests: TestResult[] = [];
    let passed = 0;
    let failed = 0;

    // Parse test results from output
    const lines = output.split('\n');
    
    for (const line of lines) {
      // Look for test result lines like:
      // [ PASS    ] 0x0::module::test_name
      // [ FAIL    ] 0x0::module::test_name
      const passMatch = line.match(/\[\s*PASS\s*\]\s+(.+)/);
      const failMatch = line.match(/\[\s*FAIL\s*\]\s+(.+)/);
      
      if (passMatch) {
        tests.push({
          name: passMatch[1].trim(),
          status: 'passed',
        });
        passed++;
      } else if (failMatch) {
        tests.push({
          name: failMatch[1].trim(),
          status: 'failed',
        });
        failed++;
      }
    }

    // Look for summary line like:
    // Test result: OK. Total tests: 5; passed: 5; failed: 0
    const summaryMatch = output.match(/Total tests:\s*(\d+);\s*passed:\s*(\d+);\s*failed:\s*(\d+)/);
    if (summaryMatch) {
      return {
        tests,
        summary: {
          total: parseInt(summaryMatch[1]),
          passed: parseInt(summaryMatch[2]),
          failed: parseInt(summaryMatch[3]),
        }
      };
    }

    return {
      tests,
      summary: {
        total: tests.length,
        passed,
        failed,
      }
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'running':
        return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
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
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Tests
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              {summary.passed} passed
            </div>
            {summary.failed > 0 && (
              <div className="flex items-center gap-1 text-red-400">
                <XCircle className="w-4 h-4" />
                {summary.failed} failed
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              {summary.total} total
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isElectron ? (
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Test execution is only available in the desktop app</p>
          </div>
        ) : !currentFolder ? (
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Please open a project folder first</p>
          </div>
        ) : testResults.length === 0 && !output ? (
          <div className="text-center text-gray-500 py-8">
            <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Click "Run Tests" to start</p>
            <p className="text-xs text-gray-600 mt-2">Executes: sui move test</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-tech text-gray-400 mb-2">Test Results</h3>
                {testResults.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-colors ${
                      test.status === 'passed'
                        ? 'bg-green-500/10 border-green-500/20'
                        : test.status === 'failed'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        {getStatusIcon(test.status)}
                        <span className="font-mono text-sm truncate">{test.name}</span>
                      </div>
                      {test.duration && (
                        <span className="text-xs text-gray-500">
                          {test.duration}ms
                        </span>
                      )}
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

            {/* Raw Output */}
            {output && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <TerminalIcon className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-tech text-gray-400">Output</h3>
                </div>
                <div className="p-3 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-gray-400 whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                  {output}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPanel;
