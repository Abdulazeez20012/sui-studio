import React from 'react';
import { FileText, Coins, Gamepad2, Rocket } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { templates, Template } from '../../data/templates';

interface TemplateSelectorProps {
  onClose: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onClose }) => {
  const { setFiles } = useIDEStore();

  const handleSelectTemplate = (templateId: string) => {
    const template = templates[templateId];
    if (template) {
      // Load template files into the IDE
      setFiles(template.files);
      onClose();
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'nft': return FileText;
      case 'defi': return Coins;
      case 'gaming': return Gamepad2;
      default: return Rocket;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] border border-cyan-500/30 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Choose a Template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => {
            const Icon = getIcon(template.category);
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template.id)}
                className="group bg-black/40 border border-cyan-500/20 rounded-lg p-6 text-left hover:border-cyan-500/50 hover:bg-black/60 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {template.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
