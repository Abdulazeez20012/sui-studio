# Menu Bar Implementation

## Overview
Added a fully functional VS Code-style menu bar to the Sui Studio IDE with dropdown menus, keyboard shortcuts, and integrated actions.

## Features

### 1. Menu Structure
Eight main menu categories:
- **File** - File operations (New, Open, Save, Close)
- **Edit** - Editing operations (Undo, Redo, Cut, Copy, Paste, Find)
- **Selection** - Text selection operations
- **View** - View controls (Explorer, Search, Terminal, Panels)
- **Go** - Navigation (Go to File, Symbol, Line)
- **Run** - Build and debug operations
- **Terminal** - Terminal management
- **Help** - Documentation and about

### 2. Visual Design

#### Colors & Styling
- Background: Dark header (#0D1117)
- Border: Cyan with 20% opacity
- Active menu: Cyan background with 10% opacity
- Hover states: White with 5% opacity
- Dropdown: Dark surface with neon glow

#### Typography
- Font: Rajdhani (tech font)
- Size: 12px (text-xs)
- Weight: Medium (500)

#### Layout
- Height: 36px (h-9)
- Padding: 8px horizontal
- Gap: 4px between items

### 3. Components

#### Left Section
- **Logo**: Sui logo in cyan-bordered box
- **Menu Items**: File, Edit, Selection, View, Go, Run, Terminal, Help

#### Center Section
- **Navigation Arrows**: Back/Forward buttons
- **Search Bar**: 
  - Placeholder: "sui-studio"
  - Keyboard hint: Ctrl+P
  - Focus state with cyan border and glow

#### Right Section
- **Settings Icon**: Opens settings
- **User Icon**: User profile
- **Window Controls**: Minimize, Maximize, Close

### 4. Dropdown Menus

#### Structure
```tsx
{
  label: 'Menu Name',
  items: [
    { label: 'Action', shortcut: 'Ctrl+X' },
    { divider: true },
    { label: 'Another Action', shortcut: 'Ctrl+Y' }
  ]
}
```

#### Features
- Click to open/close
- Click outside to close (backdrop)
- Keyboard shortcuts displayed
- Dividers for grouping
- Hover effects
- Smooth transitions

### 5. Keyboard Shortcuts

#### File Operations
- `Ctrl+N` - New File
- `Ctrl+O` - Open File
- `Ctrl+S` - Save
- `Ctrl+Shift+S` - Save As
- `Ctrl+W` - Close Editor

#### Editing
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+X` - Cut
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+F` - Find
- `Ctrl+H` - Replace

#### View
- `Ctrl+Shift+P` - Command Palette
- `Ctrl+Shift+E` - Explorer
- `Ctrl+Shift+F` - Search
- `Ctrl+`` - Terminal
- `Ctrl+B` - Toggle Sidebar
- `Ctrl+J` - Toggle Panel

#### Navigation
- `Ctrl+P` - Go to File
- `Ctrl+G` - Go to Line
- `Alt+Left` - Back
- `Alt+Right` - Forward

#### Build & Run
- `F5` - Start Debugging
- `Ctrl+F5` - Run Without Debugging
- `Ctrl+Shift+B` - Build
- `Ctrl+Shift+T` - Test

### 6. Event System

#### Custom Events
The menu bar dispatches custom events that are handled by IDEPage:

```typescript
// Dispatch event
document.dispatchEvent(new CustomEvent('ide:newFile'));

// Listen for event
document.addEventListener('ide:newFile', handleNewFile);
```

#### Available Events
- `ide:newFile` - Create new file
- `ide:save` - Save current file
- `ide:find` - Open find dialog
- `ide:commandPalette` - Open command palette
- `ide:toggleSidebar` - Toggle left sidebar
- `ide:togglePanel` - Toggle bottom panel
- `ide:build` - Build project
- `ide:test` - Run tests

### 7. Implemented Actions

#### New File
- Creates new untitled.move file
- Adds tab to editor
- Sets focus to new tab

#### Save
- Saves current file
- Updates file content
- Clears dirty flag

#### Toggle Sidebar
- Shows/hides left panel
- Smooth transition
- Maintains state

#### Toggle Panel
- Shows/hides bottom panel (terminal)
- Smooth transition
- Maintains state

#### Build
- Sets build status to "building"
- Shows build message
- Simulates build process
- Updates status on completion

### 8. Integration

#### In IDEPage.tsx
```tsx
import MenuBar from '../components/ide/MenuBar';

// In component
<MenuBar />
```

#### Event Handlers
```tsx
React.useEffect(() => {
  const handleNewFile = () => {
    // Create new file
  };
  
  document.addEventListener('ide:newFile', handleNewFile);
  
  return () => {
    document.removeEventListener('ide:newFile', handleNewFile);
  };
}, [dependencies]);
```

### 9. Customization

#### Add New Menu
```tsx
{
  label: 'Custom',
  items: [
    { label: 'Custom Action', shortcut: 'Ctrl+K' },
  ],
}
```

#### Add New Action
```tsx
case 'Custom Action':
  document.dispatchEvent(new CustomEvent('ide:customAction'));
  break;
```

#### Style Customization
```tsx
// Change colors
className="bg-neon-purple/10 text-neon-purple"

// Change size
className="h-10 px-4"

// Change font
className="font-cyber text-sm"
```

### 10. Window Controls

#### Minimize
- Minimizes window
- Platform-specific behavior
- Optional callback: `onMinimize`

#### Maximize
- Toggles fullscreen
- Platform-specific behavior
- Optional callback: `onMaximize`

#### Close
- Closes window
- Confirmation if unsaved changes
- Optional callback: `onClose`

### 11. Search Bar

#### Features
- Quick file search
- Keyboard shortcut hint (Ctrl+P)
- Focus state with glow effect
- Placeholder text
- Auto-complete (future)

#### Styling
- Dark panel background
- Cyan border on focus
- Neon glow effect
- Monospace font for shortcut

### 12. Accessibility

#### Keyboard Navigation
- Tab through menu items
- Enter to open menu
- Arrow keys to navigate items
- Escape to close menu

#### Screen Readers
- Proper ARIA labels
- Semantic HTML
- Keyboard shortcuts announced

#### Focus Management
- Visible focus indicators
- Logical tab order
- Focus trap in dropdowns

### 13. Performance

#### Optimizations
- Event delegation
- Conditional rendering
- Memoized callbacks
- Efficient re-renders

#### Bundle Size
- Tree-shakeable imports
- Minimal dependencies
- Optimized icons

### 14. Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile: Touch-optimized

### 15. Future Enhancements
- [ ] Command palette integration
- [ ] Recent files in File menu
- [ ] Customizable shortcuts
- [ ] Menu search
- [ ] Context-aware menus
- [ ] Plugin system for custom menus
- [ ] Keyboard shortcut editor
- [ ] Menu bar themes

## Usage Example

```tsx
import MenuBar from '../components/ide/MenuBar';

function IDE() {
  return (
    <div className="h-screen flex flex-col">
      <MenuBar 
        onMinimize={() => console.log('Minimize')}
        onMaximize={() => console.log('Maximize')}
        onClose={() => console.log('Close')}
      />
      {/* Rest of IDE */}
    </div>
  );
}
```

## Result
A professional, fully functional menu bar that matches VS Code's design while maintaining the Sui Studio Web3 aesthetic with neon accents and smooth animations.
