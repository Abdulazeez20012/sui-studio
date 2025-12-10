import { useEffect, useCallback } from 'react';
import { useElectronFileSystem } from './useElectronFileSystem';

interface FileWatcherCallbacks {
  onFileChanged?: (filePath: string) => void;
  onFileAdded?: (filePath: string) => void;
  onFileDeleted?: (filePath: string) => void;
  onDirectoryAdded?: (dirPath: string) => void;
  onDirectoryDeleted?: (dirPath: string) => void;
}

export const useFileWatcher = (callbacks: FileWatcherCallbacks = {}) => {
  const { currentFolder, isElectron } = useElectronFileSystem();

  // Start file watcher when folder changes
  useEffect(() => {
    if (!isElectron || !currentFolder || !window.electron) {
      return;
    }

    // Start watching the folder
    window.electron.startFileWatcher(currentFolder);

    // Cleanup on unmount or folder change
    return () => {
      if (window.electron) {
        window.electron.stopFileWatcher();
      }
    };
  }, [currentFolder, isElectron]);

  // Set up event listeners
  useEffect(() => {
    if (!isElectron || !window.electron) {
      return;
    }

    // File changed handler
    if (callbacks.onFileChanged) {
      window.electron.onFileChanged(callbacks.onFileChanged);
    }

    // File added handler
    if (callbacks.onFileAdded) {
      window.electron.onFileAdded(callbacks.onFileAdded);
    }

    // File deleted handler
    if (callbacks.onFileDeleted) {
      window.electron.onFileDeleted(callbacks.onFileDeleted);
    }

    // Directory added handler
    if (callbacks.onDirectoryAdded) {
      window.electron.onDirectoryAdded(callbacks.onDirectoryAdded);
    }

    // Directory deleted handler
    if (callbacks.onDirectoryDeleted) {
      window.electron.onDirectoryDeleted(callbacks.onDirectoryDeleted);
    }
  }, [callbacks, isElectron]);

  return {
    isWatching: isElectron && !!currentFolder,
  };
};
