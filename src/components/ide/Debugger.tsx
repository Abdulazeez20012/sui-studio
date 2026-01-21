import React, { useState, useEffect } from 'react';
import { Bug, Play, Pause, ArrowRight, ArrowDown, StopCircle, Loader, Plus, Trash2, Circle } from 'lucide-react';
import { debuggerService, DebugSession } from '../../services/debuggerService';
import { useIDEStore } from '../../store/ideStore';

export const Debugger: React.FC = () => {
  const { activeTab, tabs } = useIDEStore();
  const [session, setSession] = useState<DebugSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab && !session) {
      initializeSession();
    }
  }, [activeTab]);

  const initializeSession = async () => {
    const currentTab = tabs.find(t => t.id === activeTab);
    if (!currentTab?.content) return;

    try {
      setLoading(true);
      setError(null);
      const newSession = await debuggerService.createSession(currentTab.content);
      setSession(newSession);
    } catch (error: any) {
      console.error('Failed to create debug session:', error);
      setError(error.message || 'Failed to initialize debugger');
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async (command: string) => {
    if (!session) return;

    try {
      setExecuting(true);
      setError(null);
      const updatedSession = await debuggerService.executeCommand(session.id, command as any);
      setSession(updatedSession);
    } catch (error: any) {
      console.error('Failed to execute command:', error);
      setError(error.message || 'Command execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const toggleBreakpoint = async (breakpointId: string) => {
    if (!session) return;

    try {
      const updatedSession = await debuggerService.toggleBreakpoint(session.id, breakpointId);
      setSession(updatedSession);
    } catch (error: any) {
      console.error('Failed to toggle breakpoint:', error);
      setError(error.message || 'Failed to toggle breakpoint');
    }
  };

  const addBreakpoint = async () => {
    if (!session || !activeTab) return;

    const currentTab = tabs.find(t => t.id === activeTab);
    if (!currentTab) return;

    try {
      const line = session.currentLine || 1;
      const updatedSession = await debuggerService.addBreakpoint(
        session.id,
        currentTab.path,
        line
      );
      setSession(updatedSession);
    } catch (error: any) {
      console.error('Failed to add breakpoint:', error);
      setError(error.message || 'Failed to add breakpoint');
    }
  };

  const removeBreakpoint = async (breakpointId: string) => {
    if (!session) return;

    try {
      await debuggerService.removeBreakpoint(breakpointId);
      // Refresh session
      const updatedSession = await debuggerService.getSession(session.id);
      setSession(updatedSession);
    } catch (error: any) {
      console.error('Failed to remove breakpoint:', error);
      setError(error.message || 'Failed to remove breakpoint');
    }
  };

  const isRunning = session?.status === 'running';
  const isPaused = session?.status === 'paused';

  return (
    <div className="h-full flex flex-col bg-walrus-dark-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <h3 className="font-semibold flex items-center gap-2 uppercase tracking-wider text-sm">
          <Bug className="w-4 h-4 text-walrus-cyan" />
          Debugger
        </h3>
        <div className="flex gap-2">
          {loading || executing ? (
            <Loader className="w-4 h-4 animate-spin text-walrus-cyan" />
          ) : (
            <>
              <button
                onClick={() => executeCommand(isRunning || isPaused ? 'stop' : 'start')}
                disabled={!session}
                className="p-2 hover:bg-white/10 rounded disabled:opacity-50 transition-colors"
                title={isRunning || isPaused ? 'Stop' : 'Start'}
              >
                {isRunning || isPaused ? (
                  <StopCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <Play className="w-4 h-4 text-green-400" />
                )}
              </button>
              {isPaused && (
                <>
                  <button
                    onClick={() => executeCommand('continue')}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Continue (F5)"
                  >
                    <Play className="w-4 h-4 text-walrus-cyan" />
                  </button>
                  <button
                    onClick={() => executeCommand('step-over')}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Step Over (F10)"
                  >
                    <ArrowRight className="w-4 h-4 text-walrus-cyan" />
                  </button>
                  <button
                    onClick={() => executeCommand('step-into')}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                    title="Step Into (F11)"
                  >
                    <ArrowDown className="w-4 h-4 text-walrus-cyan" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border-b border-red-500/20">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-walrus-cyan mx-auto mb-2" />
            <p className="text-sm text-gray-400">Initializing debugger...</p>
          </div>
        </div>
      ) : !session ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Bug className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Open a Move file to start debugging</p>
            <p className="text-xs text-gray-600 mt-1">Backend service required</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Status */}
          <div className="p-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Status:</span>
              <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isRunning ? 'text-green-400' :
                  isPaused ? 'text-yellow-400' :
                    'text-gray-500'
                }`}>
                <Circle className={`w-2 h-2 ${isRunning ? 'fill-green-400' : isPaused ? 'fill-yellow-400' : 'fill-gray-500'}`} />
                {session.status}
              </span>
            </div>
            {session.currentFile && (
              <div className="text-xs text-gray-400 mt-2 font-mono">
                📄 {session.currentFile}:{session.currentLine || 0}
              </div>
            )}
          </div>

          {/* Breakpoints */}
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Breakpoints</h4>
              <button
                onClick={addBreakpoint}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Add Breakpoint at Current Line"
              >
                <Plus className="w-4 h-4 text-walrus-cyan" />
              </button>
            </div>
            {session.breakpoints.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">
                No breakpoints set
                <p className="text-[10px] mt-1">Click + to add at current line</p>
              </div>
            ) : (
              <div className="space-y-1">
                {session.breakpoints.map((bp) => (
                  <div
                    key={bp.id}
                    className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={bp.enabled}
                        onChange={() => toggleBreakpoint(bp.id)}
                        className="w-3 h-3 rounded accent-walrus-cyan"
                      />
                      <span className="text-xs font-mono text-gray-300">
                        {bp.file}:<span className="text-walrus-cyan">{bp.line}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => removeBreakpoint(bp.id)}
                      className="p-1 hover:bg-red-500/20 rounded transition-colors"
                      title="Remove Breakpoint"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call Stack */}
          <div className="p-3 border-b border-white/10">
            <h4 className="text-sm font-bold mb-2 uppercase tracking-wider">Call Stack</h4>
            {session.stackFrames.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">No stack frames</div>
            ) : (
              <div className="space-y-1">
                {session.stackFrames.map((frame) => (
                  <div key={frame.id} className="p-2 bg-white/5 rounded text-sm">
                    <div className="font-mono text-walrus-cyan">{frame.function}()</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {frame.module} • {frame.file}:{frame.line}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variables */}
          <div className="p-3 border-b border-white/10">
            <h4 className="text-sm font-bold mb-2 uppercase tracking-wider">Variables</h4>
            {session.variables.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">No variables in scope</div>
            ) : (
              <div className="space-y-1">
                {session.variables.map((v, i) => (
                  <div key={i} className="flex justify-between p-2 bg-white/5 rounded text-sm">
                    <div>
                      <span className="font-mono text-gray-300">{v.name}</span>
                      <span className="text-xs text-gray-500 ml-2">: {v.type}</span>
                    </div>
                    <span className="text-walrus-cyan font-mono">{v.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Output */}
          {session.output.length > 0 && (
            <div className="p-3">
              <h4 className="text-sm font-bold mb-2 uppercase tracking-wider">Output</h4>
              <div className="bg-black/40 rounded p-2 text-xs font-mono max-h-32 overflow-auto scrollbar-thin scrollbar-thumb-white/10">
                {session.output.map((line, i) => (
                  <div key={i} className="text-gray-300">{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
