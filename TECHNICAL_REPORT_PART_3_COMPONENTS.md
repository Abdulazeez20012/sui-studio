# Sui Studio IDE - Comprehensive Technical Report
## Part 3: Component Architecture & Implementation

---

## 3. COMPONENT SYSTEM

### 3.1 Component Hierarchy

```
App
├── ErrorBoundary
│   ├── WalletProvider (Google OAuth + Sui Wallet)
│   │   └── BrowserRouter
│   │       └── Routes
│   │           ├── HomePage
│   │           ├── LoginPage
│   │           └── ProtectedRoute
│   │               └── IDEPage
│   │                   ├── Header
│   │                   ├── LeftPanel
│   │                   │   ├── FileExplorer
│   │                   │   ├── SearchPanel
│   │                   │   ├── GitPanel
│   │                   │   └── TestPanel
│   │                   ├── EditorArea
│   │                   │   ├── EditorTabs
│   │                   │   ├── Breadcrumbs
│   │                   │   └── CodeEditor / SimpleEditor
│   │                   ├── RightPanel
│   │                   │   ├── SettingsPanel
│   │                   │   ├── NexiHome
│   │                   │   └── [Other Panels]
│   │                   └── BottomPanel
│   │                       └── Terminal
│   └── ToastContainer
```

### 3.2 Core Components Deep Dive

#### 3.2.1 IDEPage Component

**Purpose:** Main container orchestrating the entire IDE layout

**Responsibilities:**
- Layout management (panels, splitters)
- Keyboard shortcut handling
- Menu event listeners
- File save coordination
- Panel visibility control

**State Management:**
- Consumes ideStore for panel states
- Manages local UI state (hover, resize)
- Coordinates between child components

**Key Features:**
- Responsive panel system
- Drag-to-resize panels
- Keyboard shortcut integration
- Menu command handling
- Auto-save coordination

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│                    Header                        │
├──────┬──────────────────────────────┬───────────┤
│      │                              │           │
│ Left │        Editor Area           │   Right   │
│Panel │    (Tabs + Code Editor)      │  Panel    │
│      │                              │           │
├──────┴──────────────────────────────┴───────────┤
│              Terminal (Bottom Panel)             │
└─────────────────────────────────────────────────┘
```



#### 3.2.2 Header Component

**Purpose:** Top navigation bar with branding and action buttons

**Key Features:**
1. **Branding Section:**
   - Logo with gradient background
   - Product name with custom font
   - Backend connection status indicator
   - Navigation to home page

2. **Action Buttons (Center):**
   - Open Folder (Desktop only)
   - Create New File
   - Build Project
   - Run Tests
   - Deploy Contract
   - Publish Package

3. **User Section (Right):**
   - Wallet connection status
   - User profile/avatar
   - Settings access

**Backend Integration:**
- Real-time connection status monitoring
- API service health checks
- Visual feedback (green/red indicator)

**Platform Detection:**
```typescript
{typeof window !== 'undefined' && (window as any).electron?.isElectron && (
  <ActionButton
    icon={<FolderOpen size={18} />}
    label="Open"
    onClick={() => document.dispatchEvent(new CustomEvent('ide:openFolder'))}
    primary
  />
)}
```

**Event System:**
- Dispatches custom events for cross-component communication
- Listens for menu events from Electron
- Coordinates with FileExplorer for folder operations

#### 3.2.3 FileExplorer Component

**Purpose:** Hierarchical file tree navigation and management

**Architecture:**
- Recursive component structure for nested folders
- Lazy loading of file contents
- Context menu for file operations
- Drag-and-drop support (planned)

**State Management:**
- Local state for UI (expanded folders, rename mode)
- Global state for file tree (ideStore)
- Recent files tracking (localStorage)

**File Operations:**
1. **Open File:**
   - Checks if tab already exists
   - Loads content from Electron or memory
   - Creates new tab with proper language detection
   - Adds to recent files list

2. **Create File/Folder:**
   - Inline creation with validation
   - Automatic focus on input field
   - Cancel on Escape, confirm on Enter
   - Updates file tree immediately

3. **Rename:**
   - Inline editing mode
   - Validation for duplicate names
   - Updates all open tabs with new path
   - Preserves file content

4. **Delete:**
   - Confirmation dialog
   - Closes associated tabs
   - Updates file tree
   - Handles both files and folders

**Language Detection:**
```typescript
const languageMap = {
  'move': 'move',
  'toml': 'toml',
  'json': 'json',
  'js': 'javascript',
  'ts': 'typescript',
  'md': 'markdown',
  // ... more mappings
};
```

**Ignore Patterns:**
- Hidden files (starting with .)
- node_modules
- .git
- build/dist directories
- IDE-specific folders

