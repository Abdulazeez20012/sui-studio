import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Download, Loader, FileText } from 'lucide-react';
import { auditService, AuditReport, SecurityIssue } from '../../services/auditService';
import { useIDEStore } from '../../store/ideStore';

export const SecurityAudit: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);

  const runAudit = async () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (!currentTab?.content) {
      alert('No code to audit');
      return;
    }

    try {
      setLoading(true);
      const auditReport = await auditService.auditCode(currentTab.content);
      setReport(auditReport);
    } catch (error) {
      console.error('Audit failed:', error);
      alert('Audit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (!report) return;

    try {
      const json = await auditService.exportAudit(report.id);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-audit-${report.id}.json`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-900/20 border-red-500';
      case 'high': return 'text-orange-500 bg-orange-900/20 border-orange-500';
      case 'medium': return 'text-yellow-500 bg-yellow-900/20 border-yellow-500';
      case 'low': return 'text-blue-500 bg-blue-900/20 border-blue-500';
      default: return 'text-gray-500 bg-gray-900/20 border-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-green-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Security Audit
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runAudit}
            disabled={loading}
            className="px-4 py-1 bg-sui-blue hover:bg-blue-600 rounded text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Auditing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Run Audit
              </>
            )}
          </button>
          {report && (
            <button
              onClick={exportReport}
              className="p-2 hover:bg-gray-700 rounded"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-sui-blue mx-auto mb-2" />
              <p className="text-gray-400">Analyzing code security...</p>
            </div>
          </div>
        ) : !report ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Click "Run Audit" to analyze your code</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Score Card */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">Security Score</h4>
                  <p className="text-sm text-gray-400">Overall code security rating</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{report.overallScore}</div>
                  <div className={`text-sm font-semibold ${getRiskColor(report.riskLevel)}`}>
                    {report.riskLevel.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(report.summary).map(([severity, count]) => (
                  <div key={severity} className="text-center">
                    <div className={`text-2xl font-bold ${getSeverityColor(severity).split(' ')[0]}`}>
                      {count}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{severity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            {report.aiAnalysis && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  AI Analysis
                </h4>
                <div className="text-sm text-gray-300 whitespace-pre-wrap">
                  {report.aiAnalysis}
                </div>
              </div>
            )}

            {/* Issues */}
            {report.issues.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Security Issues ({report.issues.length})</h4>
                <div className="space-y-2">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-3 rounded border ${getSeverityColor(issue.severity)} cursor-pointer hover:bg-gray-700/50`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-semibold text-sm">{issue.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-700">
                              {issue.category}
                            </span>
                          </div>
                          <p className="text-xs text-gray-300">{issue.description}</p>
                        </div>
                        <span className="text-xs uppercase font-bold">{issue.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gas Optimizations */}
            {report.gasOptimizations.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Gas Optimizations</h4>
                <ul className="space-y-2">
                  {report.gasOptimizations.map((opt, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500">⚡</span>
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Best Practices */}
            {report.bestPractices.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Best Practices</h4>
                <ul className="space-y-2">
                  {report.bestPractices.map((practice, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-300">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedIssue.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(selectedIssue.severity)}`}>
                  {selectedIssue.severity.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-gray-300">{selectedIssue.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Recommendation</h4>
                <p className="text-sm text-gray-300">{selectedIssue.recommendation}</p>
              </div>

              {selectedIssue.references && selectedIssue.references.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">References</h4>
                  <ul className="space-y-1">
                    {selectedIssue.references.map((ref, i) => (
                      <li key={i}>
                        <a
                          href={ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-sui-blue hover:underline"
                        >
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
