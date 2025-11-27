import { useState, useCallback, useEffect, useRef } from 'react';

interface UseResizableOptions {
  initialSize: number;
  minSize: number;
  maxSize: number;
  direction: 'horizontal' | 'vertical';
  storageKey?: string;
}

export const useResizable = ({
  initialSize,
  minSize,
  maxSize,
  direction,
  storageKey,
}: UseResizableOptions) => {
  // Load saved size from localStorage if available
  const getSavedSize = () => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        return Math.max(minSize, Math.min(maxSize, parsed));
      }
    }
    return initialSize;
  };

  const [size, setSize] = useState(getSavedSize());
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Double-click to reset to initial size
    const now = Date.now();
    if (now - lastClickTimeRef.current < 300) {
      setSize(initialSize);
      if (storageKey) {
        localStorage.setItem(storageKey, initialSize.toString());
      }
      lastClickTimeRef.current = 0;
      return;
    }
    lastClickTimeRef.current = now;
    
    setIsResizing(true);
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSizeRef.current = size;
  }, [size, direction, initialSize, storageKey]);

  useEffect(() => {
    if (!isResizing) return;

    // Add global cursor style
    const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.cursor = cursor;
    document.body.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPosRef.current;
      const newSize = Math.max(minSize, Math.min(maxSize, startSizeRef.current + delta));
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Restore cursor
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Save to localStorage
      if (storageKey) {
        localStorage.setItem(storageKey, size.toString());
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, direction, minSize, maxSize, storageKey, size]);

  return {
    size,
    isResizing,
    handleMouseDown,
    setSize,
  };
};
