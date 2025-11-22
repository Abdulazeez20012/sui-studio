# Sui Studio IDE - Feature List

## 🎨 User Interface

### Layout
- **Responsive Design** - Adapts to different screen sizes
- **Dark Theme** - Optimized for long coding sessions
- **Consistent Design System** - Matches landing page aesthetics
- **Smooth Animations** - Subtle transitions and hover effects

### Panels
- **Left Sidebar** - Icon-based navigation (48px width)
- **Left Panel** - Expandable panel (256px width) with multiple views
- **Editor Area** - Main coding workspace with tabs
- **Bottom Panel** - Terminal and output (resizable)
- **Status Bar** - Information display (24px height)
- **Toolbar** - Quick actions (48px height)

## 📝 Code Editor

### Monaco Editor Features
- **Syntax Highlighting** - Move, Rust, TOML, Markdown, JavaScript, TypeScript
- **IntelliSense** - Auto-completion and suggestions
- **Minimap** - Code overview on the right
- **Line Numbers** - With current line highlighting
- **Bracket Matching** - Colorized bracket pairs
- **Word Wrap** - Automatic line wrapping
- **Multiple Cursors** - Edit multiple locations simultaneously
- **Find & Replace** - Search within files
- **Code Folding** - Collapse/expand code blocks

### Editor Configuration
```typescript
{
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  theme: 'vs-dark',
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

## 📂 File Management

### File Explorer
- **Tree View** - Hierarchical file structure
- **Folder Expansion** - Click to expand/collapse folders
- **File Icons** - Visual file type indicators
- **Click to Open** - Single click opens file in editor
- **Nested Folders** - Unlimited depth support

### Tab System
- **Multiple Tabs** - Open multiple files simultaneously
- **Tab Switching** - Click or keyboard shortcuts
- **Dirty Indicator** - Shows unsaved changes (dot icon)
- **Close Button** - X button on hover
- **Active Tab Highlight** - Cyan border on active tab

## 💻 Terminal

### Features
- **Multiple Terminals** - Create multiple terminal instances
- **Tab Switching** - Switch between terminals
- **Command Input** - Type and execute commands
- **Output Display** - View command results
- **Scrollable History** - Scroll through past output
- **Auto-scroll** - Automatically scrolls to latest output

### Terminal UI
- **Dark Background** - Matches editor theme
- **Monospace Font** - JetBrains Mono
- **Cyan Prompt** - `$` prompt in sui-cyan color
- **New Terminal Button** - Plus icon to create new terminal

## 🔍 Search & Navigation

### Search Panel
- **File Search** - Search across all files
- **Find & Replace** - Replace text in files
- **Case Sensitive** - Toggle case sensitivity
- **Regex Support** - Regular expression search
- **Results List** - Shows all matches

### Navigation
- **Quick File Open** - Keyboard shortcut to open files
- **Go to Line** - Jump to specific line number
- **Breadcrumbs** - Show current file path
- **Recent Files** - Access recently opened files

## ⌨️ Keyboard Shortcuts

### File Operations
- `Ctrl/Cmd + S` - Save current file
- `Ctrl/Cmd + W` - Close current tab
- `Ctrl/Cmd + Tab` - Next tab
- `Ctrl/Cmd + Shift + Tab` - Previous tab

### Panel Toggles
- `Ctrl/Cmd + B` - Toggle left sidebar
- `Ctrl/Cmd + J` - Toggle terminal panel

### Editor
- `Ctrl/Cmd + F` - Find in file
- `Ctrl/Cmd + H` - Replace in file
- `Ctrl/Cmd + /` - Toggle comment
- `Ctrl/Cmd + D` - Select next occurrence

## 🎯 Project Templates

### Hello World
**Description**: Basic Sui Move project
**Files**:
- `src/main.move` - Simple hello world module
- `Move.toml` - Package configuration
- `README.md` - Project documentation

### NFT Collection
**Description**: NFT minting template
**Files**:
- `src/nft.move` - NFT collection module
- `Move.toml` - Package configuration

**Features**:
- Mint NFTs with name, description, URL
- Transfer NFTs to users
- Sui object model integration

### DeFi Protocol
**Description**: AMM liquidity pool
**Files**:
- `src/pool.move` - AMM pool module
- `Move.toml` - Package configuration

**Features**:
- Create liquidity pools
- Generic coin types
- Balance management

## 🎨 Design System

### Colors
```css
--sui-cyan: #3CB9FF      /* Primary accent */
--sui-blue: #4DA2FF      /* Secondary accent */
--dark-bg: #0B0F14       /* Main background */
--dark-surface: #151B23  /* Panel background */
--dark-border: #1F2937   /* Border color */
```

### Typography
- **UI Font**: Inter, Space Grotesk
- **Code Font**: JetBrains Mono, Fira Code
- **Font Sizes**: 12px (small), 14px (base), 16px (large)

### Spacing
- **Panel Padding**: 12px, 16px
- **Border Radius**: 8px (small), 12px (medium)
- **Border Width**: 1px

## 🔧 State Management

### Zustand Store
**Files State**:
- File tree structure
- Active file path
- File contents

**Tabs State**:
- Open tabs list
- Active tab ID
- Dirty state per tab

**Panels State**:
- Left panel open/closed
- Left panel type (explorer/search/git/extensions)
- Bottom panel open/closed

**Terminal State**:
- Terminal instances
- Active terminal ID
- Output history per terminal

## 🚀 Performance

### Optimizations
- **Code Splitting** - Lazy load Monaco Editor
- **Virtual Scrolling** - Efficient file tree rendering
- **Memoization** - React.memo for expensive components
- **Debouncing** - Debounced search and file operations

### Bundle Size
- **Total**: 495.92 KB
- **Gzipped**: 147.88 KB
- **CSS**: 0.52 KB
- **HTML**: 5.57 KB

## 🎯 User Experience

### Welcome Screen
- **Template Cards** - Visual template selection
- **Quick Actions** - Open folder, clone repo
- **Getting Started** - Clear call-to-action

### Status Bar
- **Git Branch** - Current branch name
- **Line/Column** - Cursor position
- **Language** - Current file language
- **Encoding** - File encoding (UTF-8)
- **Status** - Compilation status

### Toolbar
- **Logo** - Navigate back to landing page
- **Run Button** - Execute code (cyan button)
- **Debug Button** - Start debugger
- **Save Button** - Save current file
- **Layout Button** - Change view layout
- **Settings Button** - Open settings

## 🔐 Future Features

### Planned Enhancements
- [ ] Real command execution with Sui CLI
- [ ] File system persistence (localStorage/IndexedDB)
- [ ] Git integration (commit, push, pull)
- [ ] Extension marketplace
- [ ] Debugger with breakpoints
- [ ] Sui blockchain integration
- [ ] Smart contract deployment
- [ ] Gas estimation
- [ ] Transaction simulation
- [ ] Collaborative editing
- [ ] Cloud sync
- [ ] Project sharing
- [ ] Code snippets
- [ ] Linting and formatting
- [ ] Test runner integration

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px (limited support)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px (optimal)

### Adaptations
- Collapsible panels on smaller screens
- Touch-friendly buttons and controls
- Responsive font sizes
- Flexible layouts

## ♿ Accessibility

### Features
- **Keyboard Navigation** - Full keyboard support
- **ARIA Labels** - Screen reader support
- **Focus Management** - Clear focus indicators
- **High Contrast** - Dark theme with good contrast
- **Semantic HTML** - Proper HTML structure

## 🎓 Learning Resources

### In-App Help
- Welcome screen with templates
- Keyboard shortcuts reference
- Status indicators
- Tooltips on hover

### Documentation
- IDE Architecture guide
- Quick start guide
- Feature documentation
- Code examples in templates

---

**Total Features**: 50+
**Components**: 11 IDE components
**Templates**: 3 project templates
**Keyboard Shortcuts**: 10+ shortcuts
**Panels**: 4 panel types
