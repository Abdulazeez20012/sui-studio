import { useState, useEffect, useCallback } from 'react';

interface RecentFile {
  path: string;
  name: string;
  timestamp: number;
}

const MAX_RECENT_FILES = 10;
const STORAGE_KEY = 'ide-recent-files';

export const useRecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);

  // Load recent files from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const files = JSON.parse(stored) as RecentFile[];
        setRecentFiles(files);
      }
    } catch (error) {
      console.error('Failed to load recent files:', error);
    }
  }, []);

  // Add a file to recent files
  const addRecentFile = useCallback((path: string, name: string) => {
    setRecentFiles((prev) => {
      // Remove if already exists
      const filtered = prev.filter((f) => f.path !== path);
      
      // Add to beginning
      const updated = [
        { path, name, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_RECENT_FILES); // Keep only MAX_RECENT_FILES

      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent files:', error);
      }

      return updated;
    });
  }, []);

  // Remove a file from recent files
  const removeRecentFile = useCallback((path: string) => {
    setRecentFiles((prev) => {
      const updated = prev.filter((f) => f.path !== path);
      
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save recent files:', error);
      }

      return updated;
    });
  }, []);

  // Clear all recent files
  const clearRecentFiles = useCallback(() => {
    setRecentFiles([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recent files:', error);
    }
  }, []);

  return {
    recentFiles,
    addRecentFile,
    removeRecentFile,
    clearRecentFiles,
  };
};
