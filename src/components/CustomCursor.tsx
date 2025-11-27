import React, { useEffect, useState, useRef } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<CursorPosition[]>([]);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<CursorPosition[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);

      // Add to trail
      trailRef.current = [...trailRef.current, newPosition].slice(-8);
      setTrail(trailRef.current);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('button') !== null ||
        target.closest('a') !== null;
      
      setIsHovering(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Trail Effect */}
      {trail.map((pos, index) => (
        <div
          key={index}
          className="custom-cursor-trail"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            opacity: (index + 1) / trail.length * 0.3,
            transform: `scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}

      {/* Main Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isClicking ? 'clicking' : ''} ${isHovering ? 'hovering' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="cursor-inner" />
        <div className="cursor-outer" />
      </div>

      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CustomCursor;
