import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  noPadding?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, id, className = '', noPadding = false }) => {
  return (
    <section id={id} className={`relative w-full ${noPadding ? '' : 'py-20 md:py-32'} ${className}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default Section;