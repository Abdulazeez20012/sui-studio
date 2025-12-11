# Sui Studio IDE - Comprehensive Technical Report
## Part 1: System Architecture & Core Design

---

## Executive Summary

Sui Studio is a professional-grade Integrated Development Environment (IDE) specifically designed for Sui blockchain development using the Move programming language. The system is built as a dual-platform application supporting both web-based and desktop (Electron) environments, featuring real-time collaboration, advanced code editing, integrated terminal, Git version control, and comprehensive blockchain development tools.

**Technology Stack:**
- **Frontend Framework:** React 18.2 with TypeScript
- **Desktop Runtime:** Electron 39.2.6
- **State Management:** Zustand 5.0.8 with persistence
- **Build Tool:** Vite 6.4.1
- **Code Editor:** Monaco Editor (VS Code engine) with fallback to SimpleEditor
- **UI Framework:** Tailwind CSS 4.1.17 with custom design system
- **Animation:** Framer Motion 12.23.24
- **Blockchain Integration:** Mysten Sui SDK 1.45.2 with dApp Kit 0.19.9
- **Real-time Collaboration:** Yjs 13.6.27 with WebSocket provider
- **File Watching:** Chokidar 4.0.3
- **Testing:** Vitest 1.6.1 with React Testing Library

---

## 1. ARCHITECTURAL OVERVIEW

### 1.1 System Architecture Pattern

**Architecture Type:** Modular Monolith with Event-Driven Communication

The application follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  (React Components, UI, User Interactions)              │
├─────────────────────────────────────────────────────────┤
│                   Application Layer                      │
│  (Hooks, State Management, Business Logic)              │
├─────────────────────────────────────────────────────────┤
│                    Service Layer                         │
│  (API Services, Git Service, File System Service)      │
├─────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                    │
│  (Electron IPC, File System, Terminal, Networking)     │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Core Design Principles

1. **Separation of Concerns:** Each component has a single, well-defined responsibility
2. **Platform Abstraction:** Code works seamlessly in both web and Electron environments
3. **Event-Driven Communication:** Custom events for cross-component communication
4. **State Centralization:** Zustand stores for predictable state management
5. **Progressive Enhancement:** Features gracefully degrade when unavailable
6. **Type Safety:** Full TypeScript coverage for compile-time error detection



### 1.3 State Management Architecture

**Primary Store: ideStore.ts**

The IDE state is managed through Zustand, providing a centralized, reactive state management solution.

**State Structure:**
```typescript
interface IDEState {
  // File System Management
  files: FileNode[]              // Complete file tree structure
  activeFile: string | null      // Currently selected file path
  
  // Tab Management
  tabs: Tab[]                    // Open editor tabs
  activeTab: string | null       // Currently active tab ID
  
  // Panel Management
  leftPanelOpen: boolean         // File explorer visibility
  leftPanelType: PanelType       // Active left panel type
  rightPanelOpen: boolean        // Right panel visibility
  bottomPanelOpen: boolean       // Terminal visibility
  
  // Terminal Management
  terminals: Terminal[]          // Multiple terminal instances
  activeTerminal: string | null  // Active terminal ID
  
  // View Configuration
  viewMode: ViewMode             // Editor layout mode
  rightPanelType: RightPanelType // Active right panel type
  collaborationEnabled: boolean  // Real-time collab status
  
  // Code Quality Metrics
  syntaxErrors: number           // Current error count
  syntaxWarnings: number         // Current warning count
}
```

**Design Rationale:**
- **Immutable Updates:** All state changes create new objects, enabling time-travel debugging
- **Selective Subscriptions:** Components only re-render when their specific state slice changes
- **Action-Based Mutations:** All state changes go through named actions for traceability
- **No Middleware Complexity:** Direct function calls instead of action dispatchers

**Secondary Store: settingsStore.ts**

Persistent user preferences with localStorage synchronization.

**Features:**
- Automatic persistence across sessions
- Default value fallbacks
- Type-safe setting updates
- Reset to defaults functionality

