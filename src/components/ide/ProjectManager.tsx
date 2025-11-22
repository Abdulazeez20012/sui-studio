import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Clock, Plus } from 'lucide-react';
import { cloudStorageService } from '../../services/cloudStorageService';
import { useAuthStore } from '../../store/authStore';
import { useIDEStore } from '../../store/ideStore';

const ProjectManager: React.FC = () => {
  const { user } = useAuthStore();
  const { files, setFiles } = useIDEStore();
  const [projects, setProjects] = useState<any[]>([]);
  const [projectName, setProjectName] = useState('My Project');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProjects();
      // Check for auto-save
      const autoSaved = cloudStorageService.restoreAutoSave(user.id);
      if (autoSaved && autoSaved.length > 0) {
        // Ask user if they want to restore
        if (confirm('We found unsaved work. Would you like to restore it?')) {
          setFiles(autoSaved);
        }
      }
    }
  }, [user]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (user && files.length > 0) {
      const interval = setInterval(() => {
        cloudStorageService.autoSave(files, user.id);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, files]);

  const loadProjects = () => {
    if (user) {
      const userProjects = cloudStorageService.getUserProjects(user.id);
      setProjects(userProjects);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const success = await cloudStorageService.saveProject(projectName, files, user.id);
    setSaving(false);
    
    if (success) {
      setShowSaveDialog(false);
      loadProjects();
      alert('Project saved successfully!');
    } else {
      alert('Failed to save project');
    }
  };

  const handleLoad = (projectId: string) => {
    const project = cloudStorageService.getProject(projectId);
    if (project) {
      setFiles(project.files);
      setProjectName(project.name);
    }
  };

  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      cloudStorageService.deleteProject(projectId);
      loadProjects();
    }
  };

  return (
    <div className="h-full bg-dark-surface flex flex-col">
      <div className="p-4 border-b border-dark-border">
        <h3 className="text-sm font-semibold text-white mb-3">Projects</h3>
        
        <button
          onClick={() => setShowSaveDialog(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-sui-cyan text-black rounded-lg hover:bg-[#2ba6eb] transition-colors font-medium mb-3"
        >
          <Save size={16} />
          <span>Save Project</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No saved projects</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-3 bg-dark-bg rounded-lg border border-dark-border hover:border-sui-cyan/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{project.name}</h4>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/10 rounded transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <Clock size={12} />
                <span>{new Date(project.lastModified).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => handleLoad(project.id)}
                className="w-full px-3 py-1.5 text-xs bg-dark-surface border border-dark-border rounded hover:border-sui-cyan/50 hover:text-sui-cyan transition-colors"
              >
                Load Project
              </button>
            </div>
          ))
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-white mb-4">Save Project</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded text-white focus:outline-none focus:border-sui-cyan"
                placeholder="Enter project name"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-sui-cyan text-black rounded hover:bg-[#2ba6eb] disabled:opacity-50 transition-colors font-medium"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
