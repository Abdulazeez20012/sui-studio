# Core Analyzer Extension Integration

## Overview
Added prominent download links for the Core Analyzer VS Code extension throughout the Sui Studio IDE to help users enhance their development experience.

## What is Core Analyzer?
Core Analyzer is a VS Code extension built by your team that provides advanced Sui Move analysis and debugging tools. It enhances the development workflow with features like:
- Advanced code analysis
- Real-time error detection
- Debugging capabilities
- Move-specific syntax highlighting
- Smart code completion

## Integration Points

### 1. Welcome Screen
**Location**: First screen users see when opening the IDE

**Design**:
- Prominent banner above the action buttons
- Gradient background (purple → cyan → pink)
- VS Code icon with purple glow effect
- Large, bold heading: "CORE ANALYZER EXTENSION"
- Description text
- Purple "DOWNLOAD" button with glow effect

**Features**:
- Hover effects with gradient overlay
- Neon border glow on hover
- Opens VS Code Marketplace in new tab
- Positioned prominently for maximum visibility

**Code Location**: `src/components/ide/WelcomeScreen.tsx`

### 2. Settings Panel
**Location**: Right panel → Settings

**Design**:
- New "Extensions" section
- Card layout with purple accent
- VS Code icon
- Extension name and description
- Download button

**Features**:
- Consistent with settings panel design
- Purple theme to match VS Code branding
- Easy access from within the IDE
- Opens marketplace in new tab

**Code Location**: `src/components/ide/SettingsPanel.tsx`

## Visual Design

### Colors
- **Primary**: Neon Purple (`#B026FF`)
- **Background**: Dark panel with purple tint
- **Border**: Purple with 30% opacity
- **Glow**: Purple shadow effect

### Typography
- **Heading**: Orbitron font (cyber style)
- **Body**: Rajdhani font (tech style)
- **Button**: Bold, uppercase, wider tracking

### Icons
- VS Code logo SVG (official icon path)
- Download icon on buttons
- Consistent sizing and styling

## Marketplace Link
The extension links to:
```
https://marketplace.visualstudio.com/items?itemName=your-team-name.core-analyzer
```

**Note**: Update `your-team-name.core-analyzer` with your actual VS Code Marketplace extension ID.

## How to Update the Link

### Step 1: Get Your Extension ID
1. Go to VS Code Marketplace
2. Find your Core Analyzer extension
3. Copy the extension ID from the URL
   - Format: `publisher.extension-name`
   - Example: `myteam.core-analyzer`

### Step 2: Update the Code
Replace `your-team-name.core-analyzer` in both files:

**WelcomeScreen.tsx** (line ~175):
```tsx
href="https://marketplace.visualstudio.com/items?itemName=YOUR-ACTUAL-ID"
```

**SettingsPanel.tsx** (line ~220):
```tsx
href="https://marketplace.visualstudio.com/items?itemName=YOUR-ACTUAL-ID"
```

## User Experience Flow

### From Welcome Screen
1. User opens IDE
2. Sees prominent Core Analyzer banner
3. Clicks "DOWNLOAD" button
4. Opens VS Code Marketplace in new tab
5. Can install extension directly

### From Settings Panel
1. User opens Settings (right panel)
2. Scrolls to "Extensions" section
3. Sees Core Analyzer card
4. Clicks "DOWNLOAD EXTENSION" button
5. Opens VS Code Marketplace in new tab

## Benefits

### For Users
- Easy discovery of the extension
- Multiple access points
- Clear call-to-action
- Professional presentation
- Seamless integration

### For Your Team
- Increased extension adoption
- Better user engagement
- Professional branding
- Consistent messaging
- Easy to update

## Customization Options

### Change Button Text
```tsx
<span>Download</span>
// Change to:
<span>Get Extension</span>
<span>Install Now</span>
<span>Add to VS Code</span>
```

### Change Colors
```tsx
className="bg-neon-purple"
// Change to:
className="bg-sui-cyan"  // Cyan theme
className="bg-neon-pink" // Pink theme
```

### Add More Info
Add features list, ratings, or screenshots to the cards for more context.

## Analytics (Optional)
Consider adding click tracking to measure adoption:
```tsx
onClick={() => {
  // Track download click
  analytics.track('core_analyzer_download_clicked', {
    source: 'welcome_screen'
  });
  window.open(marketplaceUrl, '_blank');
}}
```

## Future Enhancements
- Show extension installation status
- Display extension version
- Add "What's New" section
- Include user ratings/reviews
- Add video demo or screenshots
- Check if extension is already installed

## Maintenance
- Update marketplace link when extension ID changes
- Keep description text current
- Update screenshots/demos as extension evolves
- Monitor click-through rates
- Gather user feedback

## Result
Users now have prominent, easy access to download the Core Analyzer extension from multiple locations within the IDE, with a professional, Web3-styled presentation that matches the overall aesthetic.
