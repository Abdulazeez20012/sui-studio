import React, { useState, useEffect } from 'react';
import { Wand2, AlertCircle, CheckCircle, Info, Settings } from 'lucide-react';
import { formatterService, LintIssue } from '../../services/formatterService';
import { useIDEStore } from '../../store/ideStore';

const FormatPanel: React.FC = () => {
  const { tabs, activeTab, updateTabContent } = useIDEStore();
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formatOnSave, setFormatOnSave] = useState(true);

  const currentTab = tabs.find(t => t.id === activeTab);

  useEffect(() => {
    if (currentTab?.content) {
      lintCode();
    }
  }, [currentTab?.content]);

  const lintCode = async () => {
    if (!currentTab?.content) return;
    
    const lintIssues = await formatterService.lint(currentTab.content);
    const codeSuggestions = await formatterService.getSuggestions(currentTab.content);
    
    setIssues(lintIssues);
    setSuggestions(codeSuggestions);
  };

  const handleFormat = async () => {
    if (!currentTab || !activeTab) return;
    
    setLoading(true);
    try {
      const formatted = await formatterService.format(currentTab.content);
      updateTabContent(activeTab, formatted);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFix = async () => {
    if (!currentTab || !activeTab) return;
    
    setLoading(true);
    try {
      const fixed = await formatterService.autoFix(currentTab.content);
      updateTabContent(activeTab, fixed);
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
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return (
    <div className="h-full flex flex-col bg-walrus-dark-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-tech font-bold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            Code Format & Lint
          </h2>
          <button
            onClick={() => setFormatOnSave(!formatOnSave)}
            className={`p-2 rounded transition-colors ${
              formatOnSave ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'
            }`}
            title="Format on save"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFormat}
            disabled={loading || !currentTab}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            Format
          </button>
          <button
            onClick={handleAutoFix}
            disabled={loading || !currentTab}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Auto-Fix
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-4 text-sm">
          {errorCount > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertCircle className="w-4 h-4" />
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-1 text-blue-400">
              <Info className="w-4 h-4" />
              {infoCount} info
            </div>
          )}
          {issues.length === 0 && (
            <div className="flex items-center gap-1 text-green-400">
              <CheckCircle className="w-4 h-4" />
              No issues
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-tech text-gray-400 mb-2">Suggestions</h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm"
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-blue-300">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div>
            <h3 className="text-sm font-tech text-gray-400 mb-2">Issues</h3>
            <div className="space-y-1">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{issue.message}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>Line {issue.line}:{issue.column}</span>
                        <span>•</span>
                        <span className="font-mono">{issue.rule}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentTab && (
          <div className="text-center text-gray-500 py-8">
            <Wand2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Open a file to format and lint</p>
          </div>
        )}

        {currentTab && issues.length === 0 && suggestions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400 opacity-50" />
            <p>Code looks good!</p>
            <p className="text-sm mt-1">No issues found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormatPanel;
