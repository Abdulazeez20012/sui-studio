import React, { useState, useCallback } from 'react';
import { Network, Box, Database, Cloud, Zap, GitBranch } from 'lucide-react';

interface Component {
  id: string;
  type: 'module' | 'object' | 'resource' | 'capability';
  name: string;
  x: number;
  y: number;
  connections: string[];
}

export const SystemDesigner: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addComponent = (type: Component['type']) => {
    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type,
      name: `${type}_${components.length + 1}`,
      x: 100 + components.length * 50,
      y: 100 + components.length * 30,
      connections: []
    };
    setComponents([...components, newComponent]);
  };

  const exportToMove = () => {
    let moveCode = `module sui_studio::generated_system {\n`;
    
    components.forEach(comp => {
      if (comp.type === 'module') {
        moveCode += `  // Module: ${comp.name}\n`;
      } else if (comp.type === 'object') {
        moveCode += `  public struct ${comp.name} has key {\n    id: UID,\n  }\n\n`;
      } else if (comp.type === 'resource') {
        moveCode += `  public struct ${comp.name} has store {\n    value: u64,\n  }\n\n`;
      }
    });
    
    moveCode += `}\n`;
    return moveCode;
  };

  const generateDiagram = () => {
    return `
# System Architecture

\`\`\`mermaid
graph TD
${components.map(c => `  ${c.id}[${c.name}]`).join('\n')}
${components.flatMap(c => 
  c.connections.map(target => `  ${c.id} --> ${target}`)
).join('\n')}
\`\`\`
    `.trim();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-semibold flex items-center gap-2">
          <Network className="w-4 h-4" />
          System Designer
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => addComponent('module')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            <Box className="w-4 h-4 inline mr-1" />
            Module
          </button>
          <button
            onClick={() => addComponent('object')}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
          >
            <Database className="w-4 h-4 inline mr-1" />
            Object
          </button>
          <button
            onClick={() => addComponent('resource')}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            <Zap className="w-4 h-4 inline mr-1" />
            Resource
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-auto bg-gray-800">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {components.flatMap(comp =>
            comp.connections.map(targetId => {
              const target = components.find(c => c.id === targetId);
              if (!target) return null;
              return (
                <line
                  key={`${comp.id}-${targetId}`}
                  x1={comp.x + 60}
                  y1={comp.y + 30}
                  x2={target.x + 60}
                  y2={target.y + 30}
                  stroke="#4B5563"
                  strokeWidth="2"
                />
              );
            })
          )}
        </svg>

        {components.map(comp => (
          <div
            key={comp.id}
            className={`absolute p-4 rounded-lg border-2 cursor-move ${
              comp.type === 'module' ? 'bg-blue-900 border-blue-500' :
              comp.type === 'object' ? 'bg-green-900 border-green-500' :
              comp.type === 'resource' ? 'bg-purple-900 border-purple-500' :
              'bg-gray-900 border-gray-500'
            } ${selectedComponent === comp.id ? 'ring-2 ring-yellow-400' : ''}`}
            style={{ left: comp.x, top: comp.y, width: 120 }}
            onClick={() => setSelectedComponent(comp.id)}
          >
            <div className="text-xs font-semibold mb-1">{comp.type}</div>
            <div className="text-sm">{comp.name}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-700 flex gap-2">
        <button
          onClick={() => {
            const code = exportToMove();
            navigator.clipboard.writeText(code);
          }}
          className="px-4 py-2 bg-sui-blue hover:bg-blue-600 rounded"
        >
          Export to Move
        </button>
        <button
          onClick={() => {
            const diagram = generateDiagram();
            navigator.clipboard.writeText(diagram);
          }}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          <GitBranch className="w-4 h-4 inline mr-1" />
          Generate Diagram
        </button>
      </div>
    </div>
  );
};
