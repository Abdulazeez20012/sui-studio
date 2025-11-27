# 🎯 Resizable Panels System

## Overview

The IDE now features a fully resizable panel system that allows users to customize their workspace layout by dragging panel borders. All panel sizes are automatically saved and restored between sessions.

## Features

### ✅ Implemented

1. **Drag to Resize**
   - Hover over panel borders to see resize handles
   - Click and drag to adjust panel sizes
   - Visual feedback with cyan glow during resize

2. **Double-Click to Reset**
   - Double-click any resize handle to reset to default size
   - Quick way to restore original layout

3. **Persistent Sizes**
   - Panel sizes saved to localStorage
   - Automatically restored on page reload
   - Per-panel storage keys

4. **Visual Feedback**
   - Cyan highlight on hover
   - Animated glow when resizing
   - Dot indicators for better visibility
   - Global cursor changes during resize

5. **Size Constraints**
   - Minimum and maximum sizes enforced
   - Prevents panels from becoming too small or large
   - Smooth clamping to limits

## Resizable Panels

### 1. Left Panel (File Explorer)
```
Default: 256px
Min: 200px
Max: 500px
Direction: Horizontal
Storage: 'ide-left-panel-width'
```

**Location:** Between sidebar and editor  
**Resize Handle:** Right edge of file explorer

### 2. Right Panel (Tools)
```
Default: 320px
Min: 250px
Max: 600px
Direction: Horizontal
Storage: 'ide-right-panel-width'
```

**Location:** Right side of IDE  
**Resize Handle:** Left edge of right panel

### 3. Bottom Panel (Terminal)
```
Default: 300px
Min: 150px
Max: 600px
Direction: Vertical
Storage: 'ide-bottom-panel-height'
```

**Location:** Bottom of editor area  
**Resize Handle:** Top edge of terminal

## Usage

### Basic Resizing

1. **Hover** over a panel border
   - Resize handle appears with cyan color
   - Cursor changes to resize icon
   - Dot indicators show drag area

2. **Click and Drag**
   - Hold mouse button down
   - Move mouse to resize
   - Panel size updates in real-time
   - Cyan glow indicates active resize

3. **Release**
   - Size is saved automatically
   - Persists across sessions

### Reset to Default

1. **Double-click** any resize handle
2. Panel instantly returns to default size
3. New size is saved

### Keyboard Shortcuts

While no direct keyboard shortcuts exist for resizing, you can:
- Use panel toggle shortcuts to show/hide panels
- `Ctrl+B` - Toggle left panel
- `Ctrl+J` - Toggle bottom panel
- Panel menu - Toggle right panel

## Visual States

### Idle State
```
┌─────────────┬─┬──────────────┬─┬─────────┐
│ File        │ │ Editor       │ │ Tools   │
│ Explorer    │ │              │ │         │
│             │ │              │ │         │
└─────────────┴─┴──────────────┴─┴─────────┘
                 Resize handles (transparent)
```

### Hover State
```
┌─────────────┬█┬──────────────┬█┬─────────┐
│ File        │█│ Editor       │█│ Tools   │
│ Explorer    │█│              │█│         │
│             │█│              │█│         │
└─────────────┴█┴──────────────┴█┴─────────┘
                 Cyan highlight with dots
```

### Resizing State
```
┌─────────────┬█┬──────────────┬█┬─────────┐
│ File        │█│ Editor       │█│ Tools   │
│ Explorer    │█│              │█│         │
│             │█│              │█│         │
└─────────────┴█┴──────────────┴█┴─────────┘
                 Glowing cyan with pulse
```

## Technical Implementation

### Components

#### ResizeHandle Component
**Location:** `src/components/ide/ResizeHandle.tsx`

```tsx
<ResizeHandle
  direction="horizontal" // or "vertical"
  onMouseDown={handleMouseDown}
  isResizing={isResizing}
/>
```

**Props:**
- `direction`: 'horizontal' | 'vertical'
- `onMouseDown`: Mouse down event handler
- `isResizing`: Boolean for active state

**Features:**
- Larger hit target for easier grabbing
- Visual indicators (dots)
- Glow effect when active
- Tooltip with instructions

#### useResizable Hook
**Location:** `src/hooks/useResizable.ts`

```tsx
const panel = useResizable({
  initialSize: 256,
  minSize: 200,
  maxSize: 500,
  direction: 'horizontal',
  storageKey: 'ide-left-panel-width',
});
```

**Options:**
- `initialSize`: Default size in pixels
- `minSize`: Minimum allowed size
- `maxSize`: Maximum allowed size
- `direction`: Resize direction
- `storageKey`: localStorage key (optional)

**Returns:**
- `size`: Current size in pixels
- `isResizing`: Boolean for active state
- `handleMouseDown`: Event handler for resize
- `setSize`: Manual size setter

### Integration Example

```tsx
// In IDEPage.tsx
const leftPanel = useResizable({
  initialSize: 256,
  minSize: 200,
  maxSize: 500,
  direction: 'horizontal',
  storageKey: 'ide-left-panel-width',
});

return (
  <div className="flex">
    {/* Panel */}
    <div style={{ width: `${leftPanel.size}px` }}>
      <LeftPanel />
    </div>
    
    {/* Resize Handle */}
    <ResizeHandle
      direction="horizontal"
      onMouseDown={leftPanel.handleMouseDown}
      isResizing={leftPanel.isResizing}
    />
    
    {/* Rest of layout */}
  </div>
);
```

## Styling

### CSS Classes

```css
/* Resize handle base */
.cursor-col-resize  /* Horizontal resize cursor */
.cursor-row-resize  /* Vertical resize cursor */

/* Visual states */
.bg-sui-cyan        /* Active color */
.bg-sui-cyan/50     /* Hover color */
.shadow-neon        /* Glow effect */

/* Transitions */
.transition-all duration-150  /* Smooth animations */
```

### Tailwind Configuration

The resize handles use the following Tailwind utilities:
- `group` - For hover effects
- `relative` / `absolute` - Positioning
- `z-10` - Stacking context
- `flex-shrink-0` - Prevent shrinking
- `animate-pulse` - Pulsing glow

## Behavior Details

### Mouse Events

1. **mousedown** - Start resize
   - Capture start position
   - Capture start size
   - Set isResizing to true
   - Apply global cursor style

2. **mousemove** - Update size
   - Calculate delta from start
   - Apply to start size
   - Clamp to min/max
   - Update panel size

3. **mouseup** - End resize
   - Set isResizing to false
   - Save size to localStorage
   - Restore cursor style

### Double-Click Detection

```typescript
const now = Date.now();
if (now - lastClickTime < 300) {
  // Reset to initial size
  setSize(initialSize);
}
lastClickTime = now;
```

### Size Persistence

```typescript
// Save
localStorage.setItem(storageKey, size.toString());

// Load
const saved = localStorage.getItem(storageKey);
const size = saved ? parseInt(saved, 10) : initialSize;
```

## Customization

### Adjust Default Sizes

Edit the `useResizable` calls in `IDEPage.tsx`:

```tsx
const leftPanel = useResizable({
  initialSize: 300,  // Change default width
  minSize: 200,
  maxSize: 500,
  direction: 'horizontal',
  storageKey: 'ide-left-panel-width',
});
```

### Change Size Limits

```tsx
const leftPanel = useResizable({
  initialSize: 256,
  minSize: 150,      // Smaller minimum
  maxSize: 800,      // Larger maximum
  direction: 'horizontal',
  storageKey: 'ide-left-panel-width',
});
```

### Customize Visual Style

Edit `ResizeHandle.tsx`:

```tsx
// Change colors
className="bg-purple-500"  // Instead of bg-sui-cyan

// Change size
className="w-2"  // Thicker handle

// Change hover effect
className="hover:bg-purple-500/70"
```

### Add More Resizable Panels

1. Create a new `useResizable` instance:
```tsx
const myPanel = useResizable({
  initialSize: 400,
  minSize: 300,
  maxSize: 700,
  direction: 'horizontal',
  storageKey: 'my-panel-width',
});
```

2. Add the panel and handle to layout:
```tsx
<div style={{ width: `${myPanel.size}px` }}>
  <MyPanel />
</div>
<ResizeHandle
  direction="horizontal"
  onMouseDown={myPanel.handleMouseDown}
  isResizing={myPanel.isResizing}
/>
```

## Accessibility

### Keyboard Support

Currently, resize handles are mouse-only. To add keyboard support:

```tsx
// Add to ResizeHandle
onKeyDown={(e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    // Adjust size by 10px
  }
}}
tabIndex={0}
role="separator"
aria-orientation={direction}
aria-valuenow={size}
aria-valuemin={minSize}
aria-valuemax={maxSize}
```

### Screen Reader Support

```tsx
<div
  role="separator"
  aria-label={`Resize ${direction} panel`}
  aria-orientation={direction}
>
  {/* Handle content */}
</div>
```

## Performance

### Optimization Techniques

1. **Debouncing** - Size updates are immediate (no debounce)
2. **RAF** - Could add requestAnimationFrame for smoother updates
3. **CSS** - Uses transform for better performance
4. **Memoization** - Callbacks are memoized with useCallback

### Potential Improvements

```tsx
// Add RAF for smoother updates
const handleMouseMove = (e: MouseEvent) => {
  requestAnimationFrame(() => {
    const newSize = calculateSize(e);
    setSize(newSize);
  });
};
```

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

**Requirements:**
- CSS Grid/Flexbox support
- localStorage API
- Mouse events
- CSS transitions

## Troubleshooting

### Panel won't resize
- Check if panel is visible (toggled on)
- Verify min/max constraints
- Check browser console for errors

### Size not persisting
- Check localStorage is enabled
- Verify storageKey is unique
- Check browser privacy settings

### Resize handle not visible
- Check z-index stacking
- Verify panel borders are present
- Try hovering slowly over border

### Cursor not changing
- Check CSS cursor classes
- Verify global cursor style is applied
- Check for conflicting cursor styles

## Future Enhancements

### Planned Features
- [ ] Keyboard resize support
- [ ] Snap to preset sizes
- [ ] Layout presets (save/load)
- [ ] Resize animations
- [ ] Touch support for mobile
- [ ] Resize limits based on content
- [ ] Collapsible panels on resize
- [ ] Resize history (undo/redo)

### Advanced Features
- [ ] Multi-panel synchronization
- [ ] Proportional resizing
- [ ] Resize constraints based on siblings
- [ ] Custom resize behaviors per panel
- [ ] Resize event callbacks
- [ ] Animated transitions between sizes

## Examples

### Minimal Example

```tsx
import { useResizable } from '../hooks/useResizable';
import ResizeHandle from '../components/ide/ResizeHandle';

function MyComponent() {
  const panel = useResizable({
    initialSize: 300,
    minSize: 200,
    maxSize: 500,
    direction: 'horizontal',
  });

  return (
    <div className="flex">
      <div style={{ width: `${panel.size}px` }}>
        Panel Content
      </div>
      <ResizeHandle
        direction="horizontal"
        onMouseDown={panel.handleMouseDown}
        isResizing={panel.isResizing}
      />
    </div>
  );
}
```

### With Persistence

```tsx
const panel = useResizable({
  initialSize: 300,
  minSize: 200,
  maxSize: 500,
  direction: 'horizontal',
  storageKey: 'my-panel-size', // Enables persistence
});
```

### Vertical Resize

```tsx
const panel = useResizable({
  initialSize: 400,
  minSize: 200,
  maxSize: 600,
  direction: 'vertical', // Vertical instead of horizontal
  storageKey: 'vertical-panel-height',
});

<ResizeHandle
  direction="vertical"
  onMouseDown={panel.handleMouseDown}
  isResizing={panel.isResizing}
/>
```

## Summary

The resizable panels system provides a flexible, user-friendly way to customize the IDE layout. With persistent sizes, visual feedback, and smooth animations, users can create their perfect workspace configuration.

**Key Benefits:**
- ✅ Intuitive drag-to-resize
- ✅ Double-click reset
- ✅ Persistent across sessions
- ✅ Visual feedback
- ✅ Size constraints
- ✅ Smooth animations
- ✅ Easy to customize

**Files Modified:**
- `src/pages/IDEPage.tsx` - Integrated resizable panels
- `src/components/ide/ResizeHandle.tsx` - Resize handle component
- `src/hooks/useResizable.ts` - Resize logic hook

The system is production-ready and fully functional! 🎉
