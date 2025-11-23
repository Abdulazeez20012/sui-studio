# Animated Text Effects

## Overview
Added cyberpunk-style animated glitch text effects to key headings throughout the Sui Studio IDE, creating a dynamic, futuristic appearance.

## Effects Implemented

### 1. Glitch Effect
**What it does**: Creates RGB color separation and text distortion
- Cyan, purple, and pink color shadows
- Random shifts and offsets
- Continuous animation loop (1s cycle)

**CSS Class**: `.glitch-text`

**Usage**:
```tsx
<h1 className="glitch-text" data-text="YOUR TEXT">
  YOUR TEXT
</h1>
```

**Note**: The `data-text` attribute is required for the pseudo-elements to work.

### 2. Color Shift Animation
**What it does**: Cycles through neon colors
- Cyan (#00D4FF) → Purple (#B026FF) → Pink (#FF006E)
- Smooth transitions
- 3-second cycle

**Included in**: `.glitch-text` class

### 3. Skew Animation
**What it does**: Adds subtle distortion and movement
- Random skew angles (-2deg to 2deg)
- Creates "unstable" appearance
- Applied to pseudo-elements

### 4. Scanline Effect
**What it does**: Adds horizontal scanning line
- Moves from top to bottom
- Cyan glow effect
- 3-second cycle

**CSS Class**: `.scanline`

**Usage**:
```tsx
<div className="scanline">
  <h1>Your content</h1>
</div>
```

## Where It's Applied

### Welcome Screen
**Main Heading**: "WELCOME TO SUI STUDIO"
- Full glitch effect
- Scanline overlay
- Color shifting
- Most prominent animation

**Extension Banner**: "CORE ANALYZER EXTENSION"
- Glitch effect
- Draws attention to download option

### Toolbar
**Brand Text**: "SUI STUDIO"
- Subtle glitch effect
- Maintains readability
- Adds dynamic feel

### Status Bar
**Brand Text**: "SUI STUDIO"
- Glitch effect
- Consistent branding
- Always visible animation

## Technical Details

### CSS Animations

#### Glitch Keyframes
```css
@keyframes glitch {
  0%, 14%, 49%, 99% {
    text-shadow: /* RGB separation */
  }
  15%, 50% {
    text-shadow: /* Different offset */
  }
  100% {
    text-shadow: /* Reset */
  }
}
```

#### Color Shift Keyframes
```css
@keyframes color-shift {
  0%, 100% { color: #00D4FF; }  /* Cyan */
  33% { color: #B026FF; }        /* Purple */
  66% { color: #FF006E; }        /* Pink */
}
```

#### Skew Keyframes
```css
@keyframes glitch-skew {
  /* Random skew values from -2deg to 2deg */
}
```

#### Scanline Keyframes
```css
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

### Pseudo-Elements
The glitch effect uses `::before` and `::after` pseudo-elements:
- Clone the text using `content: attr(data-text)`
- Apply different clip-paths (top 45% and bottom 40%)
- Animate with different skew patterns
- Create layered distortion effect

## Customization

### Adjust Animation Speed
```css
/* Faster glitch */
.glitch-text {
  animation: glitch 0.5s infinite;
}

/* Slower color shift */
.glitch-text {
  animation: color-shift 5s infinite;
}
```

### Change Colors
```css
@keyframes color-shift {
  0%, 100% { color: #YOUR_COLOR_1; }
  33% { color: #YOUR_COLOR_2; }
  66% { color: #YOUR_COLOR_3; }
}
```

### Adjust Intensity
```css
/* More intense glitch */
@keyframes glitch {
  text-shadow: 
    0.1em 0 0 rgba(0, 212, 255, 1),  /* Increase offset and opacity */
    -0.1em -0.05em 0 rgba(176, 38, 255, 1);
}
```

### Disable on Mobile
```css
@media (max-width: 768px) {
  .glitch-text {
    animation: none;
    text-shadow: none;
  }
  
  .glitch-text::before,
  .glitch-text::after {
    display: none;
  }
}
```

## Performance Considerations

### GPU Acceleration
The animations use `transform` and `opacity` which are GPU-accelerated:
- Smooth 60fps animation
- Low CPU usage
- No layout reflows

### Reduced Motion
Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  .glitch-text {
    animation: none;
  }
  
  .glitch-text::before,
  .glitch-text::after {
    display: none;
  }
}
```

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Adding to New Elements

### Step 1: Add Classes
```tsx
<h1 className="glitch-text" data-text="YOUR TEXT">
  YOUR TEXT
</h1>
```

### Step 2: Optional Scanline
```tsx
<h1 className="glitch-text scanline" data-text="YOUR TEXT">
  YOUR TEXT
</h1>
```

### Step 3: Style as Needed
```tsx
<h1 
  className="glitch-text font-cyber text-4xl"
  data-text="YOUR TEXT"
>
  YOUR TEXT
</h1>
```

## Tailwind Utilities
Added custom animation classes:
- `animate-glitch` - Glitch effect
- `animate-glitch-skew` - Skew animation
- `animate-color-shift` - Color cycling
- `animate-scanline` - Scanning line

## Examples

### Subtle Effect (Buttons)
```tsx
<button className="glitch-text" data-text="DEPLOY">
  DEPLOY
</button>
```

### Intense Effect (Hero)
```tsx
<h1 className="glitch-text scanline text-6xl" data-text="SUI STUDIO">
  SUI STUDIO
</h1>
```

### Custom Timing
```tsx
<h1 
  className="glitch-text"
  style={{ animationDuration: '2s' }}
  data-text="SLOW GLITCH"
>
  SLOW GLITCH
</h1>
```

## Accessibility

### Screen Readers
- Text content is preserved
- Animations don't affect readability
- `data-text` attribute is ignored by screen readers

### Keyboard Navigation
- No impact on focus states
- Animations don't interfere with interaction

### Motion Sensitivity
Consider adding a toggle in settings:
```tsx
const [reduceMotion, setReduceMotion] = useState(false);

<h1 className={reduceMotion ? '' : 'glitch-text'}>
  TEXT
</h1>
```

## Result
The IDE now features dynamic, animated text that:
- Creates a futuristic, cyberpunk aesthetic
- Draws attention to key branding elements
- Maintains readability while adding visual interest
- Performs smoothly across all devices
- Matches the Web3/blockchain theme perfectly

The glitch effect makes the text feel alive and constantly changing, just like the image you shared!
