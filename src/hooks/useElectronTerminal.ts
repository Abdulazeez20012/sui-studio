import { useState, useCallback, useEffect } from 'react';

interface TerminalCommand {
  command: string;
  cwd?: string;
}

interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode?: number;
}

interface ElectronTerminalAPI {
  executeCommand: (command: string, cwd?: string) => Promise<CommandResult>;
  onTerminalOutput: (callback: (data: string) => void) => void;
  isElectron: boolean;
}

declare global {
  interface Window {
    electron?: ElectronTerminalAPI & any;
  }
}

export const useElectronTerminal = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState<string>('');

  const isElectron = typeof window !== 'undefined' && window.electron?.isElectron;

  // Initialize current directory
  useEffect(() => {
    if (isElectron && !currentDirectory) {
      // Get current folder from file system hook or use home directory
      const folder = localStorage.getItem('currentFolder');
      if (folder) {
        setCurrentDirectory(folder);
      }
    }
  }, [isElectron, currentDirectory]);

  // Execute command
  const executeCommand = useCallback(async (
    command: string,
    cwd?: string
  ): Promise<CommandResult> => {
    if (!isElectron || !window.electron) {
      return {
        success: false,
        output: '',
        error: 'Not running in Electron environment'
      };
    }

    setIsExecuting(true);

    try {
      const workingDir = cwd || currentDirectory || undefined;
      const result = await window.electron.executeCommand(command, workingDir);
      
      return result;
    } catch (error: any) {
      return {
        success: false,
        output: '',
        error: error.message || 'Command execution failed'
      };
    } finally {
      setIsExecuting(false);
    }
  }, [isElectron, currentDirectory]);

  // Change directory
  const changeDirectory = useCallback((newDir: string) => {
    setCurrentDirectory(newDir);
    localStorage.setItem('currentDirectory', newDir);
  }, []);

  // Listen for real-time output
  const onOutput = useCallback((callback: (data: string) => void) => {
    if (!isElectron || !window.electron) return;

    window.electron.onTerminalOutput(callback);
  }, [isElectron]);

  return {
    isElectron,
    isExecuting,
    currentDirectory,
    executeCommand,
    changeDirectory,
    onOutput,
  };
};
