import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ children, direction = 'left', speed = 40 }) => {
  return (
    <div className="relative flex overflow-hidden group">
      <div 
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-scroll ${
          direction === 'right' ? 'reverse' : ''
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
      <div 
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-scroll absolute top-0 left-0 ${
          direction === 'right' ? 'reverse' : ''
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s`, transform: 'translateX(100%)' }}
      >
         {/* Note: Tailwind animate-scroll moves to -100%. For continuous loop we need duplicates. 
             The standard Tailwind approach is usually wrapping the content twice in the container.
         */}
      </div>
       {/* Gradient Masks */}
       <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-sui-dark to-transparent z-10" />
       <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-sui-dark to-transparent z-10" />
    </div>
  );
};

// Specialized Marquee Wrapper for duplicate content handling
export const MarqueeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
       <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll">
          {children}
       </ul>
       <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-scroll" aria-hidden="true">
          {children}
       </ul>
    </div>
  );
}

export default MarqueeContainer;