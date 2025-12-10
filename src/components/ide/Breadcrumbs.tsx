import React from 'react';
import { ChevronRight, File } from 'lucide-react';

interface BreadcrumbsProps {
  filePath: string;
  fileName: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ filePath, fileName }) => {
  // Split path into segments
  const segments = filePath.split('/').filter(Boolean);
  
  // Remove filename from segments (it's shown separately)
  const pathSegments = segments.slice(0, -1);

  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-walrus-dark-900/50 border-b border-white/5 text-sm font-mono">
      {/* File icon */}
      <File className="w-4 h-4 text-cyan-400 flex-shrink-0" />
      
      {/* Path segments */}
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <span className="text-gray-500 hover:text-gray-300 transition-colors cursor-default">
            {segment}
          </span>
        </React.Fragment>
      ))}
      
      {/* Current file */}
      {pathSegments.length > 0 && (
        <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
      )}
      <span className="text-white font-medium">{fileName}</span>
    </div>
  );
};

export default Breadcrumbs;
