# Sui Studio IDE - Complete Frontend Architecture

## Overview

A complete browser-based IDE for Sui Move development built with React 18, TypeScript, Monaco Editor, and Tailwind CSS. The IDE follows the design system from the Sui Studio landing page.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Monaco Editor** - Code editor (VS Code's editor)
- **Zustand** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Framer Motion** - Animations (landing page)

## Project Structure

```
sui-studio/
├── src/
│   ├── components/
│   │   └── ide/
│   │       ├── Sidebar.tsx           # Left icon sidebar
│   │       ├── LeftPanel.tsx         # Panel switcher
│   │       ├── FileExplorer.tsx      # File tree navigation
│   │       ├── SearchPanel.tsx       # Search functionality
│   │       ├── EditorTabs.tsx        # Tab management
│   │       ├── CodeEditor.tsx        # Monaco editor wrapper
│   │       ├── Terminal.tsx          # Integrated terminal
│   │       ├── StatusBar.tsx         # Bottom status bar
│   │       ├── Toolbar.tsx           # Top toolbar
│   │       ├── WelcomeScreen.tsx     # Initial welcome screen
│   │       └── ContextMenu.tsx       # Right-click menu
│   ├── pages/
│   │   ├── LandingPage.tsx           # Marketing page
│   │   └── IDEPage.tsx               # Main IDE interface
│   ├── store/
│   │   └── ideStore.ts               # Zustand state
│   ├── types/
│   │   └── ide.ts                    # TypeScript types
│   ├── data/
│   │   └── templates.ts              # Project templates
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts   # Keyboard shortcuts
│   ├── styles/
│   │   └── globals.css               # Global styles
│   └── App.tsx                       # Router setup
├── components/                        # Landing page components
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Features

### 1. Code Editor
- Monaco Editor integration (VS Code's editor)
- Syntax highlighting for Move, Rust, TOML, Markdown
- Auto-completion and IntelliSense
- Multiple file tabs
- Dirty state tracking (unsaved changes)

### 2. File System
- Tree-based file explorer
- Folder expansion/collapse
- File type icons
- Click to open files

### 3. Terminal
- Integrated terminal emulator
- Multiple terminal instances
- Command history
- Tab switching

### 4. Panels
- **Left Sidebar**: Explorer, Search, Git, Extensions
- **Bottom Panel**: Terminal (toggleable)
- **Status Bar**: Git branch, line/col, language, encoding

### 5. Templates
- Hello World - Basic Sui Move project
- NFT Collection - NFT minting template
- DeFi Protocol - AMM liquidity pool

### 6. Keyboard Shortcuts
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + J` - Toggle terminal
- `Ctrl/Cmd + S` - Save file
- `Ctrl/Cmd + W` - Close tab
- `Ctrl/Cmd + Tab` - Next tab

## Design System

### Colors
```css
--sui-cyan: #3CB9FF
--sui-blue: #4DA2FF
--dark-bg: #0B0F14
--dark-surface: #151B23
--dark-border: #1F2937
```

### Typography
- **Code**: JetBrains Mono, Fira Code
- **UI**: System fonts

### Components
- Consistent border radius (8px, 12px)
- Subtle shadows and glows
- Hover states with cyan accent
- Dark theme optimized

## State Management

### Zustand Store (`ideStore.ts`)

```typescript
interface IDEState {
  // File System
  files: FileNode[]
  activeFile: string | null
  
  // Tabs
  tabs: Tab[]
  activeTab: string | null
  
  // Panels
  leftPanelOpen: boolean
  leftPanelType: 'explorer' | 'search' | 'git' | 'extensions'
  rightPanelOpen: boolean
  bottomPanelOpen: boolean
  
  // Terminal
  terminals: Terminal[]
  activeTerminal: string | null
  
  // View
  viewMode: 'editor' | 'split' | 'preview'
}
```

## Routes

- `/` - Landing page with marketing content
- `/ide` - Full IDE interface

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Usage

1. **Start the IDE**: Click "Start Building Free" on landing page or navigate to `/ide`
2. **Choose Template**: Select from Hello World, NFT, or DeFi templates
3. **Edit Code**: Click files in explorer to open in editor
4. **Use Terminal**: Run commands in integrated terminal
5. **Save Work**: Use Ctrl/Cmd + S to save files

## Monaco Editor Configuration

```typescript
{
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  lineNumbers: 'on',
  renderWhitespace: 'selection',
  bracketPairColorization: { enabled: true }
}
```

## Future Enhancements

- [ ] Git integration
- [ ] Extension marketplace
- [ ] Real command execution
- [ ] File system persistence (localStorage/IndexedDB)
- [ ] Collaborative editing
- [ ] Sui blockchain integration
- [ ] Smart contract deployment
- [ ] Gas estimation
- [ ] Transaction simulation
- [ ] Debugger integration

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## Performance

- Code splitting with React Router
- Lazy loading for Monaco Editor
- Optimized re-renders with Zustand
- Virtual scrolling for large file trees

## Accessibility

- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader support

## License

MIT
