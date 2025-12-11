# Sui Studio IDE - Comprehensive Technical Report
## Part 9: Build System & Deployment

---

## 9. BUILD & DEPLOYMENT SYSTEM

### 9.1 Development Build System

**Build Tool: Vite 6.4.1**

**Why Vite:**
- Lightning-fast HMR (Hot Module Replacement)
- Native ES modules support
- Optimized production builds
- Plugin ecosystem
- TypeScript support out of the box

**Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    strictPort: false,  // Try other ports if 3000 is taken
    host: true,         // Listen on all addresses
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'monaco': ['@monaco-editor/react', 'monaco-editor'],
          'sui': ['@mysten/sui', '@mysten/dapp-kit'],
        },
      },
    },
  },
});
```

**Development Scripts:**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:3000 && electron .\"",
}
```

### 9.2 Electron Build System

**Builder: electron-builder 26.0.12**

**Configuration (electron-builder.yml):**

**Multi-Platform Support:**
- Linux: AppImage, deb, rpm
- Windows: NSIS installer, portable
- macOS: DMG, zip

**Build Optimization:**
```yaml
compression: maximum
asar: true  # Archive app files for faster loading

files:
  - dist/**/*
  - electron/**/*
  - package.json
  - "!**/*.map"
  - "!**/*.md"
  - "!**/test/**"
  - "!**/.git/**"
```

**Linux Configuration:**
```yaml
linux:
  target:
    - AppImage  # Universal Linux package
    - deb       # Debian/Ubuntu
    - rpm       # Fedora/RHEL
  category: Development
  icon: electron/icon.png
  executableName: sui-studio
  synopsis: Sui Move Development IDE
  description: Professional IDE for Sui blockchain development
```

**Windows Configuration:**
```yaml
win:
  target:
    - nsis      # Installer
    - portable  # Portable executable
  icon: electron/icon.png

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: always
  createStartMenuShortcut: true
  shortcutName: Sui Studio
  deleteAppDataOnUninstall: false
```

**macOS Configuration:**
```yaml
mac:
  target:
    - dmg  # Disk image
    - zip  # Archive
  category: public.app-category.developer-tools
  icon: electron/icon.png
  hardenedRuntime: true
  gatekeeperAssess: false
  darkModeSupport: true
  type: distribution

dmg:
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications
```



### 9.3 Build Scripts

**Complete Build Process:**

**1. Development Build:**
```bash
npm run dev
# Starts Vite dev server on port 3000
# Hot module replacement enabled
# Source maps for debugging
```

**2. Production Web Build:**
```bash
npm run build
# Compiles TypeScript
# Bundles with Rollup
# Minifies code
# Generates source maps
# Outputs to dist/
```

**3. Electron Development:**
```bash
npm run electron:dev
# Starts Vite dev server
# Waits for server to be ready
# Launches Electron with dev tools
# Hot reload enabled
```

**4. Electron Production Build:**
```bash
# Linux
npm run electron:build:linux
# Builds web app
# Packages Electron app
# Creates AppImage, deb, rpm

# Windows
npm run electron:build:windows
# Builds web app
# Packages Electron app
# Creates NSIS installer and portable

# macOS
npm run electron:build:mac
# Builds web app
# Packages Electron app
# Creates DMG and zip

# All platforms
npm run electron:build:all
# Builds for Linux, Windows, and macOS
```

### 9.4 Build Optimization Strategies

**1. Code Splitting:**
```typescript
// Automatic route-based splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const IDEPage = lazy(() => import('./pages/IDEPage'));

// Manual chunk splitting in vite.config.ts
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'monaco': ['@monaco-editor/react', 'monaco-editor'],
  'sui': ['@mysten/sui', '@mysten/dapp-kit'],
}
```

**2. Tree Shaking:**
- ES modules for better tree shaking
- Named imports instead of default
- Unused code elimination

**3. Asset Optimization:**
- Image compression
- SVG optimization
- Font subsetting
- CSS purging

**4. Bundle Analysis:**
```bash
npm run build -- --mode analyze
# Generates bundle size visualization
# Identifies large dependencies
# Suggests optimization opportunities
```

### 9.5 Deployment Strategies

**Web Deployment:**

**1. Static Hosting (Vercel, Netlify):**
```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

**2. Docker Deployment:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Desktop Deployment:**

**1. GitHub Releases:**
```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run electron:build
      - uses: softprops/action-gh-release@v1
        with:
          files: dist-electron/*
```

**2. Auto-Update System:**
```typescript
// electron/main.js
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. Downloading...',
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. Restart to install.',
    buttons: ['Restart', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
```

### 9.6 Release Process

**Version Management:**
```bash
# Update version
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# Create git tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

**Release Checklist:**
1. ✅ Run tests
2. ✅ Update version number
3. ✅ Update CHANGELOG.md
4. ✅ Build all platforms
5. ✅ Test installers
6. ✅ Create GitHub release
7. ✅ Upload artifacts
8. ✅ Publish release notes
9. ✅ Update documentation
10. ✅ Announce release

