# Sui Studio - Complete IDE Platform

> The Unified Development Platform for the Sui Ecosystem - From landing page to full-featured IDE

A complete browser-based IDE for Sui Move development with an integrated marketing landing page. Built with React 18, TypeScript, Monaco Editor, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the landing page, then click "Start Building Free" to access the IDE.

## 📋 Features

### Landing Page (/)
- Modern marketing page with hero section
- Platform showcase (Web & Desktop IDE)
- Ecosystem orbit visualization
- Pricing tiers and roadmap
- Partner logos and testimonials
- Responsive design with Framer Motion animations

### IDE (/ide)
- **Monaco Editor** - Full VS Code editor experience
- **File Explorer** - Tree-based file navigation with folder expansion
- **Multi-Tab Support** - Work on multiple files simultaneously
- **Integrated Terminal** - Multiple terminal instances
- **Project Templates** - Hello World, NFT Collection, DeFi Protocol
- **Keyboard Shortcuts** - Ctrl/Cmd + B, J, S, W, Tab
- **State Management** - Zustand for efficient state handling
- **Search Panel** - Find and replace across files
- **Status Bar** - Git branch, line/col, language indicators
- **Dark Theme** - Optimized for long coding sessions

## 📁 Project Structure

```
sui-studio/
├── src/                          # IDE source code
│   ├── components/ide/           # IDE components (11 files)
│   │   ├── Sidebar.tsx           # Left icon sidebar
│   │   ├── LeftPanel.tsx         # Panel switcher
│   │   ├── FileExplorer.tsx      # File tree
│   │   ├── SearchPanel.tsx       # Search UI
│   │   ├── EditorTabs.tsx        # Tab bar
│   │   ├── CodeEditor.tsx        # Monaco wrapper
│   │   ├── Terminal.tsx          # Terminal emulator
│   │   ├── StatusBar.tsx         # Bottom bar
│   │   ├── Toolbar.tsx           # Top toolbar
│   │   ├── WelcomeScreen.tsx     # Template selection
│   │   └── ContextMenu.tsx       # Right-click menu
│   ├── pages/
│   │   ├── LandingPage.tsx       # Marketing page
│   │   └── IDEPage.tsx           # IDE layout
│   ├── store/
│   │   └── ideStore.ts           # Zustand state
│   ├── types/
│   │   └── ide.ts                # TypeScript types
│   ├── data/
│   │   └── templates.ts          # Project templates
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts
│   └── App.tsx                   # Router setup
├── components/                   # Landing page components
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ... (more components)
├── index.html                    # Entry HTML
├── index.css                     # Global styles
├── tailwind.config.js            # Tailwind config
└── package.json
```

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Monaco Editor** - VS Code's editor
- **Zustand** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling (CDN)
- **Lucide React** - Icons
- **Framer Motion** - Animations

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + J` | Toggle terminal |
| `Ctrl/Cmd + S` | Save file |
| `Ctrl/Cmd + W` | Close tab |
| `Ctrl/Cmd + Tab` | Next tab |

## 🎯 Project Templates

### Hello World
Basic Sui Move project with a simple module demonstrating the fundamentals.

### NFT Collection
Complete NFT minting template with metadata support and transfer functionality.

### DeFi Protocol
AMM liquidity pool implementation with generic coin types and balance management.

## 📚 Documentation

- **[IDE_ARCHITECTURE.md](./IDE_ARCHITECTURE.md)** - Complete architecture overview
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[FEATURES.md](./FEATURES.md)** - Detailed feature list
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation summary

## 🎨 Design System

### Colors
```css
--sui-cyan: #3CB9FF      /* Primary accent */
--dark-bg: #0B0F14       /* Main background */
--dark-surface: #151B23  /* Panel background */
--dark-border: #1F2937   /* Border color */
```

### Typography
- **UI**: Inter, Space Grotesk
- **Code**: JetBrains Mono, Fira Code

## 🔧 Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment
The project uses Vite for fast development and optimized production builds.

## 📦 Build Output

```
dist/
├── index.html                   5.57 kB │ gzip: 1.98 kB
├── assets/
│   ├── index-BjSlIswx.css      0.52 kB │ gzip: 0.28 kB
│   └── index-BbjZqTpD.js     495.92 kB │ gzip: 147.88 kB
```

## 🚀 Deployment

The built files in `dist/` can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN or web server

## 🎓 Usage Flow

1. User lands on marketing page at `/`
2. Clicks "Start Building Free" button
3. Navigates to `/ide`
4. Sees welcome screen with template options
5. Selects a template (Hello World, NFT, or DeFi)
6. Files load in explorer
7. Click file to open in Monaco editor
8. Edit code with full IDE features
9. Use integrated terminal for commands
10. Toggle panels with keyboard shortcuts

## 🔮 Future Enhancements

- [ ] Real Sui CLI integration
- [ ] File system persistence (localStorage/IndexedDB)
- [ ] Git integration (commit, push, pull)
- [ ] Extension marketplace
- [ ] Debugger with breakpoints
- [ ] Smart contract deployment
- [ ] Gas estimation and simulation
- [ ] Collaborative editing
- [ ] Cloud project sync

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions and support, please open an issue on GitHub.

---

Built with ❤️ for the Sui ecosystem
