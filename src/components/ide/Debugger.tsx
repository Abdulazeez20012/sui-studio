import React, { useState, useEffect } from 'react';
import { Bug, Play, Pause, ArrowRight, ArrowDown, StopCircle, Loader, Plus } from 'lucide-react';
import { debuggerService, DebugSession } from '../../services/debuggerService';
import { useIDEStore } from '../../store/ideStore';

export const Debugger: React.FC = () => {
  const { activeTab, tabs } = useIDEStore();
  const [session, setSession] = useState<DebugSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

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
      const newSession = await debuggerService.createSession(currentTab.content);
      setSession(newSession);
    } catch (error) {
      console.error('Failed to create debug session:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async (command: string) => {
    if (!session) return;

    try {
      setExecuting(true);
      const updatedSession = await debuggerService.executeCommand(session.id, command as any);
      setSession(updatedSession);
    } catch (error) {
      console.error('Failed to execute command:', error);
    } finally {
      setExecuting(false);
    }
  };

  const toggleBreakpoint = async (breakpointId: string) => {
    if (!session) return;

    try {
      const updatedSession = await debuggerService.toggleBreakpoint(session.id, breakpointId);
      setSession(updatedSession);
    } catch (error) {
      console.error('Failed to toggle breakpoint:', error);
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
    } catch (error) {
      console.error('Failed to add breakpoint:', error);
    }
  };

  const isRunning = session?.status === 'running';
  const isPaused = session?.status === 'paused';

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Bug className="w-4 h-4" />
          Debugger
        </h3>
        <div className="flex gap-2">
          {loading || executing ? (
            <Loader className="w-4 h-4 animate-spin text-sui-blue" />
          ) : (
            <>
              <button
                onClick={() => executeCommand(isRunning || isPaused ? 'stop' : 'start')}
                disabled={!session}
                className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                title={isRunning || isPaused ? 'Stop' : 'Start'}
              >
                {isRunning || isPaused ? (
                  <StopCircle className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              {isPaused && (
                <>
                  <button
                    onClick={() => executeCommand('continue')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Continue"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => executeCommand('step-over')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Step Over"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => executeCommand('step-into')}
                    className="p-2 hover:bg-gray-700 rounded"
                    title="Step Into"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader className="w-6 h-6 animate-spin text-sui-blue" />
        </div>
      ) : !session ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Bug className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Open a file to start debugging</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {/* Status */}
          <div className="p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status:</span>
              <span className={`text-sm font-semibold ${
                isRunning ? 'text-green-500' :
                isPaused ? 'text-yellow-500' :
                'text-gray-500'
              }`}>
                {session.status.toUpperCase()}
              </span>
            </div>
            {session.currentFile && (
              <div className="text-xs text-gray-400 mt-1">
                {session.currentFile}:{session.currentLine || 0}
              </div>
            )}
          </div>

          {/* Call Stack */}
          <div className="p-3 border-b border-gray-700">
            <h4 className="text-sm font-semibold mb-2">Call Stack</h4>
            {session.stackFrames.length === 0 ? (
              <div className="text-xs text-gray-400">No stack frames</div>
            ) : (
              session.stackFrames.map((frame) => (
                <div key={frame.id} className="p-2 bg-gray-800 rounded mb-1 text-sm">
                  <div className="font-mono">{frame.function}</div>
                  <div className="text-xs text-gray-400">
                    {frame.module} • {frame.file}:{frame.line}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Variables */}
          <div className="p-3 border-b border-gray-700">
            <h4 className="text-sm font-semibold mb-2">Variables</h4>
            {session.variables.length === 0 ? (
              <div className="text-xs text-gray-400">No variables</div>
            ) : (
              session.variables.map((v, i) => (
                <div key={i} className="flex justify-between p-2 bg-gray-800 rounded mb-1 text-sm">
                  <div>
                    <span className="font-mono">{v.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{v.type}</span>
                  </div>
                  <span className="text-gray-400">{v.value}</span>
                </div>
              ))
            )}
          </div>

          {/* Breakpoints */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Breakpoints</h4>
              <button
                onClick={addBreakpoint}
                className="p-1 hover:bg-gray-700 rounded"
                title="Add Breakpoint"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {session.breakpoints.length === 0 ? (
              <div className="text-xs text-gray-400">No breakpoints</div>
            ) : (
              session.breakpoints.map((bp) => (
                <div
                  key={bp.id}
                  className="flex items-center justify-between p-2 bg-gray-800 rounded mb-1 text-sm"
                >
                  <span className="font-mono">{bp.file}:{bp.line}</span>
                  <input
                    type="checkbox"
                    checked={bp.enabled}
                    onChange={() => toggleBreakpoint(bp.id)}
                    className="w-4 h-4"
                  />
                </div>
              ))
            )}
          </div>

          {/* Output */}
          {session.output.length > 0 && (
            <div className="p-3 border-t border-gray-700">
              <h4 className="text-sm font-semibold mb-2">Output</h4>
              <div className="bg-gray-800 rounded p-2 text-xs font-mono max-h-32 overflow-auto">
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
