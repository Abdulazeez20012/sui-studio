import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Plus,
  RefreshCw,
  Upload,
  Download,
  Check,
  X,
  Clock,
  User,
  FileText,
  GitMerge,
  Trash2,
} from 'lucide-react';
import { gitService, GitStatus, GitBranch as Branch, GitCommit as Commit } from '../../services/gitService';

const GitPanel: React.FC = () => {
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'changes' | 'branches' | 'history'>('changes');
  const [commitMessage, setCommitMessage] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [showNewBranch, setShowNewBranch] = useState(false);

  useEffect(() => {
    loadGitData();
  }, []);

  const loadGitData = async () => {
    setLoading(true);
    try {
      const [statusData, branchesData, commitsData] = await Promise.all([
        gitService.status(),
        gitService.branches(),
        gitService.log(20),
      ]);
      setStatus(statusData);
      setBranches(branchesData);
      setCommits(commitsData);
    } catch (error) {
      console.error('Failed to load git data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageFile = async (file: string) => {
    await gitService.add([file]);
    loadGitData();
  };

  const handleUnstageFile = async (file: string) => {
    await gitService.reset([file]);
    loadGitData();
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;
    
    const result = await gitService.commit(commitMessage);
    if (result.success) {
      setCommitMessage('');
      loadGitData();
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;
    
    const result = await gitService.createBranch(newBranchName);
    if (result.success) {
      setNewBranchName('');
      setShowNewBranch(false);
      loadGitData();
    }
  };

  const handleCheckoutBranch = async (branchName: string) => {
    await gitService.checkout(branchName);
    loadGitData();
  };

  const handlePull = async () => {
    setLoading(true);
    await gitService.pull();
    loadGitData();
  };

  const handlePush = async () => {
    setLoading(true);
    await gitService.push();
    loadGitData();
  };

  return (
    <div className="h-full flex flex-col bg-walrus-dark-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-tech font-bold flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Source Control
          </h2>
          <button
            onClick={loadGitData}
            disabled={loading}
            className="p-2 hover:bg-white/5 rounded transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['changes', 'branches', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded font-tech text-sm transition-colors ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'changes' && (
          <ChangesTab
            status={status}
            commitMessage={commitMessage}
            setCommitMessage={setCommitMessage}
            onStageFile={handleStageFile}
            onUnstageFile={handleUnstageFile}
            onCommit={handleCommit}
            onPull={handlePull}
            onPush={handlePush}
          />
        )}

        {activeTab === 'branches' && (
          <BranchesTab
            branches={branches}
            showNewBranch={showNewBranch}
            newBranchName={newBranchName}
            setNewBranchName={setNewBranchName}
            setShowNewBranch={setShowNewBranch}
            onCreateBranch={handleCreateBranch}
            onCheckoutBranch={handleCheckoutBranch}
          />
        )}

        {activeTab === 'history' && <HistoryTab commits={commits} />}
      </div>
    </div>
  );
};

export default GitPanel;


// Changes Tab Component
const ChangesTab: React.FC<{
  status: GitStatus | null;
  commitMessage: string;
  setCommitMessage: (msg: string) => void;
  onStageFile: (file: string) => void;
  onUnstageFile: (file: string) => void;
  onCommit: () => void;
  onPull: () => void;
  onPush: () => void;
}> = ({ status, commitMessage, setCommitMessage, onStageFile, onUnstageFile, onCommit, onPull, onPush }) => {
  if (!status) {
    return (
      <div className="text-center text-gray-500 py-8">
        <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No Git repository</p>
        <button className="mt-4 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30">
          Initialize Repository
        </button>
      </div>
    );
  }

  const allChanges = [
    ...status.modified.map(f => ({ file: f, status: 'modified' })),
    ...status.created.map(f => ({ file: f, status: 'created' })),
    ...status.deleted.map(f => ({ file: f, status: 'deleted' })),
  ];

  return (
    <div className="space-y-4">
      {/* Sync buttons */}
      <div className="flex gap-2">
        <button
          onClick={onPull}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
        >
          <Download className="w-4 h-4" />
          Pull
        </button>
        <button
          onClick={onPush}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Push
        </button>
      </div>

      {/* Staged Changes */}
      {status.staged.length > 0 && (
        <div>
          <h3 className="text-sm font-tech text-gray-400 mb-2">Staged Changes ({status.staged.length})</h3>
          <div className="space-y-1">
            {status.staged.map((file) => (
              <div
                key={file}
                className="flex items-center justify-between p-2 bg-green-500/10 rounded hover:bg-green-500/20 transition-colors"
              >
                <span className="text-sm font-mono text-green-400">{file}</span>
                <button
                  onClick={() => onUnstageFile(file)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Commit Message */}
          <div className="mt-4">
            <textarea
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message..."
              className="w-full p-2 bg-walrus-dark-800 border border-white/10 rounded text-sm font-mono resize-none focus:outline-none focus:border-cyan-500"
              rows={3}
            />
            <button
              onClick={onCommit}
              disabled={!commitMessage.trim()}
              className="mt-2 w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Commit
            </button>
          </div>
        </div>
      )}

      {/* Unstaged Changes */}
      {allChanges.length > 0 && (
        <div>
          <h3 className="text-sm font-tech text-gray-400 mb-2">Changes ({allChanges.length})</h3>
          <div className="space-y-1">
            {allChanges.map(({ file, status }) => (
              <div
                key={file}
                className="flex items-center justify-between p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-tech ${
                    status === 'modified' ? 'text-yellow-400' :
                    status === 'created' ? 'text-green-400' :
                    'text-red-400'
                  }`}>
                    {status === 'modified' ? 'M' : status === 'created' ? 'A' : 'D'}
                  </span>
                  <span className="text-sm font-mono">{file}</span>
                </div>
                <button
                  onClick={() => onStageFile(file)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {allChanges.length === 0 && status.staged.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Check className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No changes</p>
        </div>
      )}
    </div>
  );
};

// Branches Tab Component
const BranchesTab: React.FC<{
  branches: Branch[];
  showNewBranch: boolean;
  newBranchName: string;
  setNewBranchName: (name: string) => void;
  setShowNewBranch: (show: boolean) => void;
  onCreateBranch: () => void;
  onCheckoutBranch: (name: string) => void;
}> = ({ branches, showNewBranch, newBranchName, setNewBranchName, setShowNewBranch, onCreateBranch, onCheckoutBranch }) => {
  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowNewBranch(!showNewBranch)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded hover:bg-cyan-500/30 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New Branch
      </button>

      {showNewBranch && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
            placeholder="Branch name..."
            className="flex-1 px-3 py-2 bg-walrus-dark-800 border border-white/10 rounded text-sm font-mono focus:outline-none focus:border-cyan-500"
            onKeyPress={(e) => e.key === 'Enter' && onCreateBranch()}
          />
          <button
            onClick={onCreateBranch}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
          >
            Create
          </button>
        </div>
      )}

      <div className="space-y-1">
        {branches.map((branch) => (
          <button
            key={branch.name}
            onClick={() => !branch.current && onCheckoutBranch(branch.name)}
            className={`w-full flex items-center gap-2 p-3 rounded transition-colors ${
              branch.current
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span className="font-mono text-sm">{branch.name}</span>
            {branch.current && <Check className="w-4 h-4 ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
};

// History Tab Component
const HistoryTab: React.FC<{ commits: Commit[] }> = ({ commits }) => {
  return (
    <div className="space-y-2">
      {commits.map((commit) => (
        <div
          key={commit.hash}
          className="p-3 bg-white/5 rounded hover:bg-white/10 transition-colors"
        >
          <div className="flex items-start gap-2 mb-2">
            <GitCommit className="w-4 h-4 text-cyan-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{commit.message}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {commit.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(commit.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <code className="text-xs text-gray-500 font-mono">{commit.hash.substring(0, 7)}</code>
        </div>
      ))}

      {commits.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No commits yet</p>
        </div>
      )}
    </div>
  );
};
