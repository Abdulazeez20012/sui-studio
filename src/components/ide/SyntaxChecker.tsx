import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, Lightbulb, RefreshCw, Loader, Zap } from 'lucide-react';
import { syntaxService, SyntaxCheckResult, SyntaxIssue } from '../../services/syntaxService';
import { useIDEStore } from '../../store/ideStore';

export const SyntaxChecker: React.FC = () => {
  const { activeTab, tabs, setSyntaxErrors } = useIDEStore();
  const [result, setResult] = useState<SyntaxCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const currentTab = tabs.find(t => t.id === activeTab);

  // Auto-check on code change (debounced)
  useEffect(() => {
    if (!autoCheck || !currentTab?.content) return;

    const timer = setTimeout(() => {
      quickCheck();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [currentTab?.content, autoCheck]);

  // Check immediately when tab changes or clear results
  useEffect(() => {
    if (currentTab?.content && autoCheck) {
      quickCheck();
    } else if (!currentTab) {
      // Clear results when no tab is active
      setResult(null);
      setSyntaxErrors(0, 0);
    }
  }, [activeTab]);

  const quickCheck = async () => {
    if (!currentTab?.content) return;

    try {
      setLoading(true);
      const checkResult = await syntaxService.quickCheck(currentTab.content);
      setResult(checkResult);
      setLastCheck(new Date());
      
      // Update global error count
      setSyntaxErrors(checkResult.summary.errors, checkResult.summary.warnings);
    } catch (error) {
      console.error('Quick check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fullCheck = async () => {
    if (!currentTab?.content) return;

    try {
      setLoading(true);
      const checkResult = await syntaxService.checkSyntax(
        currentTab.content,
        currentTab.name
      );
      setResult(checkResult);
      setLastCheck(new Date());
      
      // Update global error count
      setSyntaxErrors(checkResult.summary.errors, checkResult.summary.warnings);
    } catch (error) {
      console.error('Full check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'hint':
        return <Lightbulb className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const groupedIssues = result?.issues.reduce((acc, issue) => {
    if (!acc[issue.severity]) {
      acc[issue.severity] = [];
    }
    acc[issue.severity].push(issue);
    return acc;
  }, {} as Record<string, SyntaxIssue[]>) || {};

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#3e3e42]">
        <h3 className="font-semibold flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          Syntax Checker
        </h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoCheck}
              onChange={(e) => setAutoCheck(e.target.checked)}
              className="w-3 h-3"
            />
            Auto
          </label>
          <button
            onClick={quickCheck}
            disabled={loading || !currentTab}
            className="p-1.5 hover:bg-white/10 rounded disabled:opacity-50 transition-colors"
            title="Quick Check"
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={fullCheck}
            disabled={loading || !currentTab}
            className="p-1.5 hover:bg-white/10 rounded disabled:opacity-50 transition-colors"
            title="Full Check (with compilation)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!currentTab ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Open a file to check syntax</p>
          </div>
        </div>
      ) : loading && !result ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      ) : !result ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Click check to analyze code</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {/* Summary */}
          <div className="p-3 border-b border-[#3e3e42] bg-[#252526]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="text-sm font-semibold">
                  {result.success ? 'No Errors' : `${result.summary.errors} Error${result.summary.errors !== 1 ? 's' : ''}`}
                </span>
              </div>
              {lastCheck && (
                <span className="text-xs text-gray-500">
                  {lastCheck.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="flex gap-4 text-xs">
              {result.summary.errors > 0 && (
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{result.summary.errors} errors</span>
                </div>
              )}
              {result.summary.warnings > 0 && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{result.summary.warnings} warnings</span>
                </div>
              )}
              {result.summary.info > 0 && (
                <div className="flex items-center gap-1 text-blue-400">
                  <Info className="w-3 h-3" />
                  <span>{result.summary.info} info</span>
                </div>
              )}
              {result.summary.hints > 0 && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Lightbulb className="w-3 h-3" />
                  <span>{result.summary.hints} hints</span>
                </div>
              )}
            </div>

            {result.compiled !== undefined && (
              <div className="mt-2 text-xs text-gray-500">
                {result.compiled ? (
                  <span className="text-green-400">✓ Compiled successfully</span>
                ) : (
                  <span className="text-yellow-400">⚠ Compilation failed</span>
                )}
                {result.compilationTime && (
                  <span className="ml-2">({result.compilationTime}ms)</span>
                )}
              </div>
            )}
          </div>

          {/* Issues List */}
          {result.issues.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400 opacity-50" />
              <p className="text-sm">No issues found</p>
              <p className="text-xs mt-1">Your code looks good!</p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {/* Errors */}
              {groupedIssues.error && groupedIssues.error.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    ERRORS ({groupedIssues.error.length})
                  </h4>
                  <div className="space-y-2">
                    {groupedIssues.error.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {groupedIssues.warning && groupedIssues.warning.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    WARNINGS ({groupedIssues.warning.length})
                  </h4>
                  <div className="space-y-2">
                    {groupedIssues.warning.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Info */}
              {groupedIssues.info && groupedIssues.info.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    INFO ({groupedIssues.info.length})
                  </h4>
                  <div className="space-y-2">
                    {groupedIssues.info.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {groupedIssues.hint && groupedIssues.hint.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <Lightbulb className="w-3 h-3" />
                    HINTS ({groupedIssues.hint.length})
                  </h4>
                  <div className="space-y-2">
                    {groupedIssues.hint.map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Issue Card Component
const IssueCard: React.FC<{ issue: SyntaxIssue }> = ({ issue }) => {
  const getSeverityColor = () => {
    switch (issue.severity) {
      case 'error':
        return 'border-red-500/30 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'hint':
        return 'border-gray-500/30 bg-gray-500/5';
      default:
        return 'border-gray-500/30 bg-gray-500/5';
    }
  };

  const getTextColor = () => {
    switch (issue.severity) {
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'hint':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`p-2 rounded border ${getSeverityColor()}`}>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono ${getTextColor()}`}>
              Line {issue.line}:{issue.column}
            </span>
            {issue.code && (
              <span className="text-xs text-gray-500 font-mono">
                [{issue.code}]
              </span>
            )}
            <span className="text-xs text-gray-600">
              {issue.source}
            </span>
          </div>
          <p className="text-sm text-gray-300">{issue.message}</p>
          {issue.fix && (
            <button className="mt-1 text-xs text-blue-400 hover:text-blue-300">
              💡 {issue.fix.title}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
