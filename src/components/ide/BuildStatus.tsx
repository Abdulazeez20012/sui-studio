import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface BuildError {
  message: string;
  file?: string;
  line?: number;
  column?: number;
  severity?: string;
  context?: string[];
}

interface BuildStatusProps {
  status: 'idle' | 'building' | 'success' | 'error';
  message?: string;
  errors?: BuildError[];
  fullOutput?: string;
  onClose?: () => void;
}

const BuildStatus: React.FC<BuildStatusProps> = ({ status, message, errors, fullOutput, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  const [showFullOutput, setShowFullOutput] = useState(false);

  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'building':
        return {
          icon: <Loader size={16} className="animate-spin" />,
          color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
          title: 'Building...',
        };
      case 'success':
        return {
          icon: <CheckCircle size={16} />,
          color: 'bg-green-500/10 border-green-500/20 text-green-400',
          title: 'Build Successful',
        };
      case 'error':
        return {
          icon: <XCircle size={16} />,
          color: 'bg-red-500/10 border-red-500/20 text-red-400',
          title: 'Build Failed',
        };
      default:
        return {
          icon: <AlertCircle size={16} />,
          color: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
          title: 'Unknown Status',
        };
    }
  };

  const config = getStatusConfig();
  const hasErrors = errors && errors.length > 0;
  const hasFullOutput = fullOutput && fullOutput.trim().length > 0;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-2xl rounded-lg border ${config.color} backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom-5`}>
      <div className="flex items-center gap-3 px-4 py-3">
        {config.icon}
        <div className="flex-1">
          <p className="text-sm font-medium">{config.title}</p>
          {message && <p className="text-xs opacity-80 mt-0.5">{message}</p>}
        </div>
        <div className="flex items-center gap-2">
          {(hasErrors || hasFullOutput) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              title={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          {onClose && status !== 'building' && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>
      </div>

      {expanded && (hasErrors || hasFullOutput) && (
        <div className="border-t border-current/20 px-4 py-3 max-h-96 overflow-y-auto">
          {hasErrors && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold opacity-90 mb-2">Errors:</h4>
              {errors.map((error, index) => (
                <div key={index} className="bg-black/20 rounded p-2 text-xs">
                  <div className="font-mono whitespace-pre-wrap opacity-90">
                    {error.message}
                  </div>
                  {error.file && (
                    <div className="opacity-70 mt-1">
                      {error.file}:{error.line}:{error.column}
                    </div>
                  )}
                  {error.context && error.context.length > 0 && (
                    <details className="mt-2">
                      <summary className="opacity-70 cursor-pointer hover:opacity-100">
                        Show context
                      </summary>
                      <div className="mt-1 opacity-60 font-mono whitespace-pre-wrap bg-black/20 p-2 rounded">
                        {error.context.join('\n')}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {hasFullOutput && (
            <div className="mt-3">
              <button
                onClick={() => setShowFullOutput(!showFullOutput)}
                className="text-xs font-semibold opacity-90 hover:opacity-100 cursor-pointer mb-2"
              >
                {showFullOutput ? '▼' : '▶'} Full Output
              </button>
              {showFullOutput && (
                <div className="bg-black/20 rounded p-2">
                  <pre className="text-xs opacity-80 whitespace-pre-wrap font-mono">
                    {fullOutput}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BuildStatus;
