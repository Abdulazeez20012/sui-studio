# Build and Run Desktop App 🚀

## Overview
Building the Sui Studio IDE desktop application with all the latest features including:
- ✅ Real Move compilation (Sui CLI)
- ✅ Real AI integration (Claude/OpenAI)
- ✅ Real debugging
- ✅ Real profiling
- ✅ Real package management
- ✅ Real test runner
- ✅ PTB Builder
- ✅ zkLogin
- ✅ Dynamic Fields
- ✅ Object Display
- ✅ Sponsored Transactions
- ✅ Yjs Collaboration
- ✅ WebRTC Video/Voice
- ✅ Walrus Storage
- ✅ Subscription System

## Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Sui CLI** (optional, for compilation features)

## Build Steps

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Build Frontend
```bash
npm run build
```

### 3. Build Desktop App
```bash
npm run electron:build
```

## Run Desktop App

### Development Mode
```bash
npm run electron:dev
```

### Production Mode (After Build)
```bash
# Windows
dist/win-unpacked/Sui Studio IDE.exe

# macOS
open dist/mac/Sui\ Studio\ IDE.app

# Linux
dist/linux-unpacked/sui-studio-ide
```

## Quick Commands

```bash
# Clean build
npm run electron:clean

# Build for specific platform
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux

# Build all platforms
npm run electron:build:all
```

## Features Included

### Core IDE Features
- Monaco Editor with Move syntax highlighting
- File explorer with context menus
- Multi-tab editing
- Terminal integration
- Git integration
- Search and replace

### Sui-Specific Features
- Real Move compilation with Sui CLI
- Contract deployment (wallet-signed)
- Gas analysis and profiling
- Package manager
- Test runner with coverage
- Debugger with breakpoints

### Advanced Features
- PTB (Programmable Transaction Blocks) Builder
- zkLogin integration
- Dynamic Fields explorer
- Object Display standard
- Sponsored Transactions
- Real-time collaboration (Yjs)
- Video/Voice chat (WebRTC)
- Walrus decentralized storage

### AI Features
- Claude AI integration
- OpenAI integration
- Code completion
- Error explanation
- Code optimization suggestions

## Environment Variables

Create `.env.local` in root:
```env
VITE_API_URL=http://localhost:3001
VITE_CLAUDE_API_KEY=your_claude_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
```

Create `backend/.env.local`:
```env
PORT=3001
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
CLAUDE_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
npm run electron:build
```

### Electron Won't Start
```bash
# Rebuild native modules
npm run electron:rebuild
```

### Backend Not Starting
```bash
# Check backend separately
cd backend
npm run dev
```

## Distribution

### Create Installer
```bash
npm run electron:dist
```

This creates:
- Windows: `.exe` installer
- macOS: `.dmg` installer
- Linux: `.AppImage` or `.deb`

### Code Signing (Optional)
Add to `electron-builder.yml`:
```yaml
win:
  certificateFile: path/to/cert.pfx
  certificatePassword: ${CERT_PASSWORD}
mac:
  identity: "Developer ID Application: Your Name"
```

## Performance Tips

1. **Enable Hardware Acceleration**: Already enabled in electron config
2. **Optimize Bundle Size**: Tree-shaking enabled in Vite
3. **Lazy Loading**: Components loaded on demand
4. **Service Workers**: Caching for offline support

## Next Steps

1. Test all features in desktop app
2. Create installers for distribution
3. Set up auto-updates
4. Submit to app stores (optional)

---

**Ready to build!** Run the commands below to start.
