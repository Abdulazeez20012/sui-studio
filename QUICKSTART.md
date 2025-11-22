# Quick Start Guide - Sui Studio IDE

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure Overview

```
├── src/                    # IDE source code
│   ├── components/ide/     # IDE components
│   ├── pages/             # Route pages
│   ├── store/             # State management
│   └── types/             # TypeScript types
├── components/            # Landing page components
└── index.tsx             # Entry point
```

## Key Files

### State Management
- `src/store/ideStore.ts` - Zustand store for IDE state

### Main Components
- `src/pages/IDEPage.tsx` - Main IDE layout
- `src/components/ide/CodeEditor.tsx` - Monaco editor wrapper
- `src/components/ide/FileExplorer.tsx` - File tree
- `src/components/ide/Terminal.tsx` - Terminal emulator

### Templates
- `src/data/templates.ts` - Project templates (Hello World, NFT, DeFi)

## Navigation

- **Landing Page**: `/` - Marketing page with "Start Building Free" button
- **IDE**: `/ide` - Full IDE interface

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + J` | Toggle terminal |
| `Ctrl/Cmd + S` | Save file |
| `Ctrl/Cmd + W` | Close tab |
| `Ctrl/Cmd + Tab` | Next tab |

## Customization

### Colors (tailwind.config.js)
```javascript
colors: {
  'sui-cyan': '#3CB9FF',
  'dark-bg': '#0B0F14',
  'dark-surface': '#151B23',
  'dark-border': '#1F2937',
}
```

### Monaco Editor (CodeEditor.tsx)
```typescript
options={{
  fontSize: 14,
  fontFamily: 'JetBrains Mono, Fira Code, monospace',
  theme: 'vs-dark',
  // ... more options
}}
```

## Adding New Templates

Edit `src/data/templates.ts`:

```typescript
export const templates = {
  myTemplate: {
    name: 'My Template',
    description: 'Description here',
    files: [
      // FileNode array
    ]
  }
}
```

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## Troubleshooting

### Monaco Editor not loading
- Check network tab for CDN issues
- Ensure `@monaco-editor/react` is installed

### Styles not applying
- Run `npm install` to ensure Tailwind is installed
- Check `tailwind.config.js` content paths

### Router not working
- Ensure `react-router-dom` is installed
- Check `src/App.tsx` for route configuration

## Next Steps

1. Explore the IDE at `/ide`
2. Try different templates
3. Customize the design system
4. Add new features to the IDE
5. Integrate with Sui blockchain APIs

## Resources

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Sui Documentation](https://docs.sui.io/)
