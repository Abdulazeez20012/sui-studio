# Sui Studio IDE - Comprehensive Technical Report
## Part 8: UI/UX System & Design

---

## 8. USER INTERFACE SYSTEM

### 8.1 Design System

**Brand Colors:**
```css
--walrus-cyan: #00D9FF      /* Primary accent */
--walrus-purple: #A855F7    /* Secondary accent */
--walrus-dark-950: #0B0F14  /* Background */
--walrus-dark-900: #1F2937  /* Surface */
--walrus-dark-800: #374151  /* Elevated surface */
```

**Typography:**
- **Display Font:** Custom sans-serif for branding
- **UI Font:** System font stack (Inter, SF Pro, Segoe UI)
- **Code Font:** JetBrains Mono, Consolas, Monaco

**Spacing System:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Consistent padding/margin throughout

**Border Radius:**
- Small: 4px (buttons, inputs)
- Medium: 8px (cards, panels)
- Large: 12px (modals, major sections)
- XL: 16px (hero sections)

### 8.2 Component Library

**1. Toast Notifications**

**Purpose:** Non-intrusive user feedback

**Component: Toast.tsx**
```typescript
interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration || 3000);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle className="text-green-400" />,
    error: <XCircle className="text-red-400" />,
    warning: <AlertTriangle className="text-yellow-400" />,
    info: <Info className="text-blue-400" />,
  };

  return (
    <div className={`toast toast-${type}`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};
```

**Hook: useToast.ts**
```typescript
export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}`;
    const toast = { id, message, type };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};
```

**Usage:**
```typescript
const { showToast } = useToast();

// Success
showToast('File saved successfully', 'success');

// Error
showToast('Failed to compile', 'error');

// Warning
showToast('Unsaved changes', 'warning');

// Info
showToast('Building project...', 'info');
```



**2. Loading Overlay**

**Component: LoadingOverlay.tsx**
```typescript
interface LoadingOverlayProps {
  message?: string;
  progress?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = 'Loading...', 
  progress 
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-walrus-dark-900 rounded-xl p-8 shadow-2xl">
        <div className="spinner" />
        <p className="text-white mt-4">{message}</p>
        {progress !== undefined && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
```

**3. Breadcrumbs**

**Component: Breadcrumbs.tsx**
```typescript
interface BreadcrumbsProps {
  path: string;
  onNavigate?: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate }) => {
  const segments = path.split('/').filter(Boolean);
  
  return (
    <div className="breadcrumbs">
      <button onClick={() => onNavigate?.('/')}>
        <Home size={16} />
      </button>
      {segments.map((segment, index) => {
        const segmentPath = '/' + segments.slice(0, index + 1).join('/');
        return (
          <React.Fragment key={segmentPath}>
            <ChevronRight size={14} className="text-gray-500" />
            <button
              onClick={() => onNavigate?.(segmentPath)}
              className={index === segments.length - 1 ? 'active' : ''}
            >
              {segment}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
```

**4. Status Bar**

**Component: StatusBar.tsx**

**Features:**
- Current file info
- Line/column position
- Language mode
- Git branch
- Error/warning count
- Backend connection status

```typescript
const StatusBar: React.FC = () => {
  const { activeTab, tabs, syntaxErrors, syntaxWarnings } = useIDEStore();
  const currentTab = tabs.find(t => t.id === activeTab);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [gitBranch, setGitBranch] = useState<string | null>(null);

  return (
    <div className="status-bar">
      {/* Left Section */}
      <div className="status-left">
        {currentTab && (
          <>
            <span className="status-item">
              <File size={14} />
              {currentTab.name}
            </span>
            <span className="status-item">
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
            <span className="status-item">
              {currentTab.language.toUpperCase()}
            </span>
          </>
        )}
      </div>

      {/* Center Section */}
      <div className="status-center">
        {gitBranch && (
          <span className="status-item">
            <GitBranch size={14} />
            {gitBranch}
          </span>
        )}
      </div>

      {/* Right Section */}
      <div className="status-right">
        {syntaxErrors > 0 && (
          <span className="status-item text-red-400">
            <XCircle size={14} />
            {syntaxErrors} errors
          </span>
        )}
        {syntaxWarnings > 0 && (
          <span className="status-item text-yellow-400">
            <AlertTriangle size={14} />
            {syntaxWarnings} warnings
          </span>
        )}
        <span className="status-item">
          <Activity size={14} />
          {backendConnected ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  );
};
```

### 8.3 Animation System

**Framer Motion Integration:**

**Panel Transitions:**
```typescript
<motion.div
  initial={{ x: -300, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -300, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
>
  {/* Panel content */}
</motion.div>
```

**Tab Animations:**
```typescript
<motion.div
  layout
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2 }}
>
  {/* Tab content */}
</motion.div>
```

**Button Hover Effects:**
```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### 8.4 Responsive Design

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Adaptive Layout:**
- Mobile: Single column, collapsible panels
- Tablet: Two columns, side-by-side panels
- Desktop: Full three-column layout

**Touch Support:**
- Larger touch targets (44x44px minimum)
- Swipe gestures for panel navigation
- Touch-friendly scrolling

