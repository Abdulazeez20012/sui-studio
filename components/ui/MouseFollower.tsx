import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseFollower: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 300); // Center the 600px glow
      cursorY.set(e.clientY - 300);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-[80px] z-0 mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, rgba(60,185,255,0.4) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

export default MouseFollower;