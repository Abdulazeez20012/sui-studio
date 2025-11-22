# Sui Studio IDE

A complete browser-based IDE for Sui Move development with Monaco Editor integration.

## Features

- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **File Explorer**: Tree-based file navigation
- **Terminal**: Integrated terminal for running commands
- **Tabs Management**: Multiple file tabs with dirty state tracking
- **State Management**: Zustand for efficient state handling
- **Responsive Design**: Works on desktop and tablet devices

## Project Structure

```
src/
├── components/
│   └── ide/
│       ├── Sidebar.tsx          # Left sidebar with icons
│       ├── FileExplorer.tsx     # File tree navigation
│       ├── EditorTabs.tsx       # Tab bar for open files
│       ├── CodeEditor.tsx       # Monaco editor wrapper
│       ├── Terminal.tsx         # Integrated terminal
│       ├── StatusBar.tsx        # Bottom status bar
│       └── Toolbar.tsx          # Top toolbar
├── pages/
│   ├── LandingPage.tsx          # Marketing landing page
│   └── IDEPage.tsx              # Main IDE interface
├── store/
│   └── ideStore.ts              # Zustand state management
├── types/
│   └── ide.ts                   # TypeScript interfaces
└── styles/
    └── globals.css              # Global styles with Tailwind

## Routes

- `/` - Landing page
- `/ide` - IDE interface

## State Management

The IDE uses Zustand for state management with the following stores:

- File system state
- Tab management
- Panel visibility
- Terminal state
- View modes

## Customization

The IDE follows the design system from the landing page:
- Colors: `sui-cyan`, `dark-bg`, `dark-surface`
- Fonts: JetBrains Mono for code
- Consistent spacing and borders
