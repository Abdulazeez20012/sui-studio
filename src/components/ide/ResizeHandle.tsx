import React from 'react';

interface ResizeHandleProps {
  direction: 'horizontal' | 'vertical';
  onMouseDown: (e: React.MouseEvent) => void;
  isResizing?: boolean;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ direction, onMouseDown, isResizing }) => {
  const isHorizontal = direction === 'horizontal';

  return (
    <div
      className={`
        group relative z-10 flex-shrink-0
        ${isHorizontal 
          ? 'w-1 cursor-col-resize hover:w-1.5' 
          : 'h-1 cursor-row-resize hover:h-1.5'
        }
        ${isResizing ? 'bg-sui-cyan' : 'bg-transparent hover:bg-sui-cyan/50'}
        transition-all duration-150
      `}
      onMouseDown={onMouseDown}
      title="Drag to resize • Double-click to reset"
    >
      {/* Visual indicator */}
      <div
        className={`
          absolute inset-0
          ${isHorizontal ? 'w-full' : 'h-full'}
          ${isResizing ? 'bg-sui-cyan shadow-neon' : 'bg-transparent'}
          transition-all duration-150
        `}
      />
      
      {/* Hover area (larger hit target) */}
      <div
        className={`
          absolute
          ${isHorizontal 
            ? 'w-3 h-full -left-1.5 top-0' 
            : 'h-3 w-full -top-1.5 left-0'
          }
        `}
      />
      
      {/* Drag indicator dots */}
      <div
        className={`
          absolute
          ${isHorizontal 
            ? 'left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 flex-col' 
            : 'top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 flex-row'
          }
          flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity
        `}
      >
        <div className={`bg-sui-cyan rounded-full ${isHorizontal ? 'w-1 h-1' : 'w-1 h-1'}`} />
        <div className={`bg-sui-cyan rounded-full ${isHorizontal ? 'w-1 h-1' : 'w-1 h-1'}`} />
        <div className={`bg-sui-cyan rounded-full ${isHorizontal ? 'w-1 h-1' : 'w-1 h-1'}`} />
      </div>

      {/* Glow effect when resizing */}
      {isResizing && (
        <div
          className={`
            absolute inset-0
            ${isHorizontal ? 'w-full' : 'h-full'}
            bg-sui-cyan/30 blur-sm
            animate-pulse
          `}
        />
      )}
    </div>
  );
};

export default ResizeHandle;
