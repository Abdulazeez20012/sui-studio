import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Send error to monitoring service (e.g., Sentry)
    // this.reportError(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
          <div className="max-w-2xl w-full bg-dark-surface border border-sui-cyan/30 rounded-xl p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={40} />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-3 font-tech uppercase">
                Something Went Wrong
              </h1>
              <p className="text-slate-400 font-tech">
                We encountered an unexpected error. Don't worry, your work is safe.
              </p>
            </div>

            {/* Error Details (Dev Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-dark-panel border border-red-500/30 rounded-lg">
                <h3 className="text-sm font-bold text-red-400 mb-2 font-tech">Error Details:</h3>
                <pre className="text-xs text-slate-300 overflow-auto max-h-40 font-mono">
                  {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-sui-cyan text-black rounded-lg font-tech font-bold hover:shadow-neon transition-all"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-sui-cyan text-sui-cyan rounded-lg font-tech font-bold hover:bg-sui-cyan hover:text-black transition-all"
              >
                <RefreshCw size={20} />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-600 text-slate-400 rounded-lg font-tech font-bold hover:border-slate-400 hover:text-white transition-all"
              >
                <Home size={20} />
                Go Home
              </button>
            </div>

            {/* Support Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 font-tech">
                If this problem persists, please{' '}
                <a
                  href="https://github.com/yourusername/sui-studio/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sui-cyan hover:underline"
                >
                  report an issue
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
