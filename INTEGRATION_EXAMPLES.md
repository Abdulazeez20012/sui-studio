# Backend Integration Examples

## Real-World Usage Examples

### 1. Enhanced Toolbar with Analytics

```typescript
// src/components/ide/Toolbar.tsx
import { analyticsService } from '../../services/analyticsService';
import { apiService } from '../../services/apiService';

const Toolbar: React.FC = () => {
  const [buildStatus, setBuildStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isBuilding, setIsBuilding] = useState(false);

  const handleBuild = async () => {
    if (!currentTab || isBuilding) return;
    
    const startTime = Date.now();
    setIsBuilding(true);
    setBuildStatus('idle');
    
    try {
      const result = await apiService.compileCode(
        currentTab.content, 
        currentTab.name.replace('.move', '')
      );
      
      const duration = Date.now() - startTime;
      
      if (result.success) {
        setBuildStatus('success');
        analyticsService.trackCodeCompile(true, duration);
        console.log('✅ Build successful!');
      } else {
        setBuildStatus('error');
        analyticsService.trackCodeCompile(false, duration);
        console.error('❌ Build failed:', result.errors);
      }
      
      setTimeout(() => setBuildStatus('idle'), 3000);
    } catch (error: any) {
      setBuildStatus('error');
      analyticsService.trackCodeCompile(false, Date.now() - startTime);
      console.error('❌ Build error:', error.message);
      setTimeout(() => setBuildStatus('idle'), 3000);
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <button
      onClick={handleBuild}
      disabled={isBuilding || !currentTab}
      className={`build-button ${buildStatus}`}
    >
      {isBuilding ? 'Building...' : buildStatus === 'success' ? 'Built ✓' : 'Build'}
    </button>
  );
};
```

---

### 2. AI-Powered Code Assistant

```typescript
// src/components/ide/NexiAI.tsx
import { aiService } from '../../services/aiService';
import { analyticsService } from '../../services/analyticsService';
import { useIDEStore } from '../../store/ideStore';

const NexiAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { tabs, activeTab } = useIDEStore();

  const currentTab = tabs.find(t => t.id === activeTab);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Send to AI service with code context
      const response = await aiService.sendMessage(input, {
        code: currentTab?.content,
        language: currentTab?.language || 'move',
        fileName: currentTab?.name,
      });

      if (response) {
        setMessages(prev => [...prev, {
          id: response.id,
          role: 'assistant',
          content: response.content,
          timestamp: new Date(response.createdAt),
        }]);

        // Track AI query
        const duration = Date.now() - startTime;
        analyticsService.trackAIQuery(input, duration);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    switch (action) {
      case 'generate':
        await aiService.generateCode('NFT collection with minting', 'move');
        break;
      case 'optimize':
        if (currentTab?.content) {
          await aiService.optimizeCode(currentTab.content, 'move');
        }
        break;
      case 'explain':
        if (currentTab?.content) {
          await aiService.explainCode(currentTab.content, 'move');
        }
        break;
      case 'debug':
        // Get error from terminal or console
        await aiService.debugError('Error message here', currentTab?.content);
        break;
    }
  };

  return (
    <div className="nexi-ai">
      {/* Messages display */}
      <div className="messages">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <button onClick={() => handleQuickAction('generate')}>Generate Code</button>
        <button onClick={() => handleQuickAction('optimize')}>Optimize Gas</button>
        <button onClick={() => handleQuickAction('explain')}>Explain Code</button>
        <button onClick={() => handleQuickAction('debug')}>Debug Error</button>
      </div>

      {/* Input */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Ask Nexi anything..."
      />
    </div>
  );
};
```

---

### 3. Extensions Marketplace with Backend

```typescript
// src/components/ide/ExtensionsMarketplace.tsx
import { apiService } from '../../services/apiService';
import { analyticsService } from '../../services/analyticsService';
import { useEffect, useState } from 'react';

const ExtensionsMarketplace: React.FC = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [installedExtensions, setInstalledExtensions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstalledExtensions();
  }, []);

  const loadInstalledExtensions = async () => {
    try {
      const response = await apiService.getInstalledExtensions();
      const installed = new Set(
        response.extensions.map((e: any) => e.extensionId)
      );
      setInstalledExtensions(installed);
    } catch (error) {
      console.error('Failed to load installed extensions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (extension: Extension) => {
    try {
      await apiService.installExtension(extension.id);
      setInstalledExtensions(prev => new Set([...prev, extension.id]));
      
      // Track installation
      analyticsService.trackExtensionInstall(extension.id, extension.name);
      
      console.log(`✅ Installed ${extension.name}`);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleUninstall = async (extensionId: string) => {
    try {
      await apiService.uninstallExtension(extensionId);
      setInstalledExtensions(prev => {
        const next = new Set(prev);
        next.delete(extensionId);
        return next;
      });
      
      console.log('✅ Extension uninstalled');
    } catch (error) {
      console.error('Uninstall failed:', error);
    }
  };

  return (
    <div className="extensions-marketplace">
      {extensions.map(ext => (
        <ExtensionCard
          key={ext.id}
          extension={ext}
          isInstalled={installedExtensions.has(ext.id)}
          onInstall={() => handleInstall(ext)}
          onUninstall={() => handleUninstall(ext.id)}
        />
      ))}
    </div>
  );
};
```

---

### 4. Analytics Dashboard

```typescript
// src/components/ide/StatsPanel.tsx
import { analyticsService } from '../../services/analyticsService';
import { useEffect, useState } from 'react';

const StatsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getUserAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <div className="stats-panel">
      <h3>Your Statistics</h3>
      
      <div className="stat-card">
        <h4>Projects</h4>
        <div className="stat-value">{analytics.projects}</div>
      </div>

      <div className="stat-card">
        <h4>Deployments</h4>
        <div className="stat-value">{analytics.deployments.total}</div>
        <div className="stat-detail">
          Success Rate: {analytics.deployments.successRate}%
        </div>
      </div>

      <div className="stat-card">
        <h4>Gas Usage</h4>
        <div className="stat-value">
          {(analytics.gas.totalUsed / 1000000).toFixed(2)}M
        </div>
        <div className="stat-detail">
          Avg: {(analytics.gas.averagePerDeployment / 1000).toFixed(1)}K per deployment
        </div>
      </div>

      <div className="stat-card">
        <h4>Compilations</h4>
        <div className="stat-value">{analytics.compilations.last30Days}</div>
        <div className="stat-detail">Last 30 days</div>
      </div>

      <div className="activity-chart">
        <h4>Activity (Last 7 Days)</h4>
        {Object.entries(analytics.activity).map(([day, count]) => (
          <div key={day} className="activity-bar">
            <span>{day}</span>
            <div className="bar" style={{ width: `${count * 10}%` }} />
            <span>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### 5. Project-Specific Analytics

```typescript
// src/components/ide/ProjectManager.tsx
import { analyticsService } from '../../services/analyticsService';

const ProjectManager: React.FC = () => {
  const [projectAnalytics, setProjectAnalytics] = useState<ProjectAnalytics | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const loadProjectAnalytics = async (projectId: string) => {
    try {
      const data = await analyticsService.getProjectAnalytics(projectId);
      setProjectAnalytics(data);
    } catch (error) {
      console.error('Failed to load project analytics:', error);
    }
  };

  useEffect(() => {
    if (selectedProject) {
      loadProjectAnalytics(selectedProject);
    }
  }, [selectedProject]);

  return (
    <div className="project-manager">
      {projectAnalytics && (
        <div className="project-stats">
          <h3>{projectAnalytics.project.name}</h3>
          
          <div className="metrics">
            <div className="metric">
              <label>Total Deployments</label>
              <value>{projectAnalytics.deployments.total}</value>
            </div>
            
            <div className="metric">
              <label>Success Rate</label>
              <value>{projectAnalytics.deployments.successRate}%</value>
            </div>
            
            <div className="metric">
              <label>Total Gas Used</label>
              <value>{(projectAnalytics.gas.total / 1000000).toFixed(2)}M</value>
            </div>
          </div>

          <div className="network-distribution">
            <h4>Network Distribution</h4>
            {Object.entries(projectAnalytics.networks).map(([network, count]) => (
              <div key={network} className="network-stat">
                <span>{network}</span>
                <span>{count} deployments</span>
              </div>
            ))}
          </div>

          <div className="recent-deployments">
            <h4>Recent Deployments</h4>
            {projectAnalytics.recentDeployments.map(deployment => (
              <DeploymentCard key={deployment.id} deployment={deployment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

### 6. Event Tracking Throughout IDE

```typescript
// Track various user actions
import { analyticsService } from './services/analyticsService';

// File operations
analyticsService.trackFileOpen('main.move', 'move');
analyticsService.trackEvent('file_save', { fileName: 'main.move' });
analyticsService.trackEvent('file_create', { fileName: 'new.move', template: 'nft' });

// Code operations
analyticsService.trackCodeCompile(true, 1500);
analyticsService.trackEvent('code_format', { language: 'move' });
analyticsService.trackEvent('code_lint', { errors: 0, warnings: 2 });

// Deployment operations
analyticsService.trackDeployment('testnet', true);
analyticsService.trackEvent('deployment_start', { network: 'testnet', gasBudget: 100000 });

// Extension operations
analyticsService.trackExtensionInstall('core-analyzer', 'Core Analyzer');
analyticsService.trackEvent('extension_enable', { extensionId: 'move-linter' });

// AI operations
analyticsService.trackAIQuery('How to create NFT?', 2000);
analyticsService.trackEvent('ai_code_insert', { language: 'move', lines: 25 });

// UI interactions
analyticsService.trackEvent('panel_toggle', { panel: 'terminal', state: 'open' });
analyticsService.trackEvent('theme_change', { theme: 'dark' });
analyticsService.trackEvent('shortcut_used', { shortcut: 'Ctrl+B', action: 'build' });
```

---

## Testing the Integration

### 1. Start Backend

```bash
cd backend
npm run setup
npm run seed
npm run dev
```

### 2. Start Frontend

```bash
npm run dev
```

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get user analytics (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/analytics/user

# Send AI message
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Help me create an NFT"}'

# Install extension
curl -X POST http://localhost:3001/api/extensions/install \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"extensionId": "core-analyzer"}'
```

---

## Error Handling

```typescript
// Robust error handling example
const handleAPICall = async () => {
  try {
    const result = await apiService.compileCode(code);
    
    if (result.success) {
      // Handle success
      showNotification('Compilation successful', 'success');
    } else {
      // Handle compilation errors
      showNotification('Compilation failed', 'error');
      displayErrors(result.errors);
    }
  } catch (error: any) {
    // Handle network/API errors
    if (error.message.includes('401')) {
      // Unauthorized - redirect to login
      logout();
      navigate('/');
    } else if (error.message.includes('429')) {
      // Rate limited
      showNotification('Too many requests. Please wait.', 'warning');
    } else {
      // Generic error
      showNotification('An error occurred. Please try again.', 'error');
      console.error('API Error:', error);
    }
  }
};
```

---

*Complete backend integration with real-world examples and best practices.*
