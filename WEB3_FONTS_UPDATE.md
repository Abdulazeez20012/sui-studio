# Web3 Fonts & Logo Update

## Overview
Updated the Sui Studio IDE with Web3-style fonts and replaced the welcome screen icon with the actual Sui logo.

## Fonts Added

### Primary Fonts
1. **Orbitron** - Futuristic, geometric sans-serif
   - Used for: Main headings, brand text, important labels
   - Weights: 400, 500, 600, 700, 800, 900
   - Perfect for: Cyber/tech aesthetic

2. **Rajdhani** - Modern, condensed sans-serif
   - Used for: Body text, UI elements, buttons
   - Weights: 300, 400, 500, 600, 700
   - Perfect for: Clean, readable interface text

3. **JetBrains Mono** - Monospace for code
   - Used for: Code editor, terminal, technical text
   - Weights: 400, 500, 600, 700

## Font Usage

### Tailwind Classes
- `font-cyber` - Orbitron font family
- `font-tech` - Rajdhani font family
- `font-mono` - JetBrains Mono font family

### Component Updates

#### WelcomeScreen
- **Logo**: Changed from Zap icon to actual Sui logo
  - Size: 24x24 (96px container)
  - Border: 2px cyan with glow effect
  - Hover: Gradient overlay animation
- **Heading**: "WELCOME TO SUI STUDIO"
  - Font: Orbitron (font-cyber)
  - Size: 5xl (48px)
  - Weight: Black (900)
  - Effect: Glow text shadow
- **Description**: Rajdhani font
- **Buttons**: Rajdhani with uppercase, wider tracking
- **Template Cards**: Rajdhani for titles and descriptions

#### Toolbar
- **Brand Text**: "SUI STUDIO"
  - Font: Orbitron (font-cyber)
  - Tracking: Wider letter spacing
  - Effect: Glow text
- **Action Buttons**: Rajdhani (font-tech)
  - Build, Test, Deploy buttons
  - Uppercase with wider tracking

#### Terminal
- **Tab Labels**: Rajdhani (font-tech)
  - "TESTS", "CONSOLE"
  - Bold, uppercase, wider tracking
- **Test Headers**: Rajdhani (font-tech)
- **Action Buttons**: Rajdhani (font-tech)
  - "RUN TEST", "SUBMIT"

#### StatusBar
- **Brand Text**: Orbitron (font-cyber)
  - "SUI STUDIO" with glow effect

#### FileExplorer
- **Header**: "FILES"
  - Font: Rajdhani (font-tech)
  - Uppercase, wider tracking

## Typography Hierarchy

### Level 1 - Brand/Hero
- Font: Orbitron
- Weight: 700-900
- Use: Main headings, brand elements
- Effect: Glow text shadow

### Level 2 - UI Elements
- Font: Rajdhani
- Weight: 500-700
- Use: Buttons, labels, navigation
- Style: Uppercase, wider tracking

### Level 3 - Body Text
- Font: Rajdhani
- Weight: 400-500
- Use: Descriptions, content

### Level 4 - Code/Technical
- Font: JetBrains Mono
- Weight: 400-600
- Use: Code editor, terminal

## CSS Updates

### Global Styles
```css
body {
  font-family: 'Rajdhani', 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  font-weight: 700;
  letter-spacing: 0.02em;
}
```

### Utility Classes
- `.font-cyber` - Orbitron
- `.font-tech` - Rajdhani

## Logo Implementation

### Sui Logo
- **Source**: Cloudinary CDN
- **URL**: `https://res.cloudinary.com/dwiewdn6f/image/upload/v1763580906/sui-sui-logo_gmux9g.png`
- **Container**: 96px x 96px with rounded corners
- **Border**: 2px cyan with 30% opacity
- **Shadow**: Neon glow effect
- **Hover**: Gradient overlay with 20% opacity

## Visual Impact

### Before
- Generic Zap icon
- Standard Inter font throughout
- Less distinctive branding

### After
- Official Sui logo with glow effects
- Futuristic Orbitron for headings
- Clean Rajdhani for UI elements
- Strong Web3/blockchain aesthetic
- Better visual hierarchy
- More professional and branded

## Font Loading
Fonts are loaded via Google Fonts CDN in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Result
The IDE now has a cohesive Web3 aesthetic with:
- Official Sui branding on welcome screen
- Futuristic typography that matches the neon/cyber theme
- Clear visual hierarchy
- Professional, modern appearance
- Strong blockchain/Web3 identity
