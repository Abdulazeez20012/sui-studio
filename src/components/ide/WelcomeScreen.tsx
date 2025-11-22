import React from 'react';
import { FileText, Folder, Download, Zap } from 'lucide-react';
import { useIDEStore } from '../../store/ideStore';
import { templates, TemplateKey } from '../../data/templates';

const WelcomeScreen: React.FC = () => {
  const { setFiles } = useIDEStore();

  const loadTemplate = (key: TemplateKey) => {
    const template = templates[key];
    setFiles(template.files);
  };

  return (
    <div className="flex items-center justify-center h-full bg-dark-bg">
      <div className="max-w-4xl w-full px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sui-cyan/10 rounded-xl mb-4">
            <Zap className="w-8 h-8 text-sui-cyan" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Sui Studio IDE</h1>
          <p className="text-slate-400">Start building on Sui with our templates or create a new project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key as TemplateKey)}
              className="p-6 bg-dark-surface border border-dark-border rounded-lg hover:border-sui-cyan/50 hover:bg-dark-surface/80 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-sui-cyan/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-sui-cyan/20 transition-colors">
                <FileText className="w-5 h-5 text-sui-cyan" />
              </div>
              <h3 className="text-white font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-slate-400">{template.description}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg hover:border-sui-cyan/50 hover:bg-dark-surface/80 transition-all text-slate-300 hover:text-white">
            <Folder size={18} />
            <span>Open Folder</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg hover:border-sui-cyan/50 hover:bg-dark-surface/80 transition-all text-slate-300 hover:text-white">
            <Download size={18} />
            <span>Clone Repository</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
