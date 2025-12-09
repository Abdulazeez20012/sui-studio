# 🖥️ Desktop IDE Build Guide

## Overview
Convert Sui Studio web IDE into native desktop applications for Linux and Windows using Electron.

## Prerequisites

### Required Software
- Node.js 18+ (already installed)
- npm or yarn
- Git

### For Windows Builds (on Linux)
```bash
sudo apt-get install wine64  # For building Windows apps on Linux
```

### For Linux Builds
```bash
sudo apt-get install rpm  # For RPM packages
```

---

## Quick Start

### 1. Install Electron Dependencies
```bash
npm install --save-dev electron electron-builder
npm install --save-dev concurrently wait-on cross-env
```

### 2. Build Desktop App
```bash
# Build for current platform
npm run electron:build

# Build for specific platform
npm run electron:build:linux
npm run electron:build:windows
npm run electron:build:all
```

### 3. Run in Development
```bash
npm run electron:dev
```

---

## File Structure

```
sui-studio/
├── electron/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script (security)
│   └── icon.png             # App icon (512x512)
├── electron-builder.yml     # Build configuration
├── package.json             # Updated with electron scripts
└── dist-electron/           # Built desktop apps (generated)
    ├── linux/
    │   ├── sui-studio-1.0.0.AppImage
    │   ├── sui-studio-1.0.0.deb
    │   └── sui-studio-1.0.0.rpm
    └── windows/
        ├── sui-studio-setup-1.0.0.exe
        └── sui-studio-1.0.0-portable.exe
```

---

## Build Commands

### Development
```bash
npm run electron:dev          # Run in dev mode with hot reload
```

### Production Builds
```bash
npm run electron:build        # Build for current OS
npm run electron:build:linux  # Build Linux (AppImage, deb, rpm)
npm run electron:build:windows # Build Windows (exe, portable)
npm run electron:build:all    # Build for all platforms
```

### Package Only (No Installer)
```bash
npm run electron:package      # Package without installer
```

---

## Platform-Specific Builds

### Linux Formats
- **AppImage** - Universal, no installation required
- **deb** - Debian/Ubuntu packages
- **rpm** - Fedora/RedHat packages
- **snap** - Snap packages (optional)

### Windows Formats
- **NSIS Installer** - Standard Windows installer
- **Portable** - No installation required
- **MSI** - Windows Installer format (optional)

---

## Build Output

### Linux Build Results
```
dist-electron/linux/
├── sui-studio-1.0.0.AppImage          # 150-200 MB
├── sui-studio_1.0.0_amd64.deb         # 140-180 MB
└── sui-studio-1.0.0.x86_64.rpm        # 140-180 MB
```

### Windows Build Results
```
dist-electron/windows/
├── sui-studio-setup-1.0.0.exe         # 160-200 MB (installer)
└── sui-studio-1.0.0-portable.exe      # 150-190 MB (portable)
```

---

## Features Enabled in Desktop

### Native Features
✅ **File System Access** - Full local file system access
✅ **Native Menus** - File, Edit, View, Help menus
✅ **Keyboard Shortcuts** - System-level shortcuts
✅ **Auto-Updates** - Automatic update checking
✅ **Offline Mode** - Works without internet
✅ **System Tray** - Minimize to tray
✅ **Native Notifications** - OS notifications
✅ **Window Management** - Maximize, minimize, fullscreen

### Enhanced Features
✅ **Real Terminal** - Execute actual shell commands
✅ **Git Integration** - Real git commands
✅ **Sui CLI** - Direct Sui CLI access
✅ **File Watchers** - Auto-reload on file changes
✅ **Native Dialogs** - Open/save file dialogs

---

## Configuration

### App Information
Edit `electron-builder.yml`:
```yaml
appId: com.suistudio.ide
productName: Sui Studio
copyright: Copyright © 2024 Sui Studio
```

### Icon Requirements
- **Linux**: 512x512 PNG
- **Windows**: 256x256 ICO (auto-generated from PNG)
- **macOS**: 512x512 ICNS (for future macOS builds)

Place icon at: `electron/icon.png`

---

## Testing

### Test Development Build
```bash
npm run electron:dev
```

### Test Production Build
```bash
# Build
npm run electron:build

# Run the built app
# Linux:
./dist-electron/linux/sui-studio-1.0.0.AppImage

# Windows:
./dist-electron/windows/sui-studio-1.0.0-portable.exe
```

---

## Distribution

### Linux Distribution
1. **AppImage** - Upload to GitHub releases
2. **deb** - Upload to apt repository or GitHub
3. **rpm** - Upload to yum repository or GitHub
4. **Snap** - Publish to Snap Store

### Windows Distribution
1. **Installer** - Upload to website or GitHub releases
2. **Portable** - Direct download from website
3. **Microsoft Store** - Submit to Windows Store (optional)

### Auto-Updates
Configure in `electron-builder.yml`:
```yaml
publish:
  provider: github
  owner: your-username
  repo: sui-studio
```

---

## Troubleshooting

### Build Fails on Linux
```bash
# Install missing dependencies
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 \
  libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

### Build Fails on Windows (from Linux)
```bash
# Install Wine
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install wine64 wine32
```

### Large Bundle Size
- Enable compression in `electron-builder.yml`
- Use `asar` packaging (enabled by default)
- Exclude unnecessary files in `files` section

### Slow Startup
- Enable V8 snapshot
- Preload critical modules
- Lazy load heavy dependencies

---

## Performance Optimization

### Reduce Bundle Size
```yaml
# electron-builder.yml
files:
  - "!**/*.map"
  - "!**/*.md"
  - "!**/test/**"
```

### Enable Compression
```yaml
compression: maximum
```

### Code Signing (Optional)
```yaml
# For Windows
win:
  certificateFile: path/to/cert.pfx
  certificatePassword: ${CERT_PASSWORD}

# For Linux
linux:
  sign: true
```

---

## CI/CD Integration

### GitHub Actions
```yaml
name: Build Desktop Apps

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run electron:build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist-electron/
```

---

## Next Steps

1. **Install Dependencies**
   ```bash
   npm install --save-dev electron electron-builder concurrently wait-on cross-env
   ```

2. **Create Electron Files**
   - Copy `electron/main.js`
   - Copy `electron/preload.js`
   - Add app icon to `electron/icon.png`

3. **Update package.json**
   - Add electron scripts
   - Set main entry point

4. **Build**
   ```bash
   npm run electron:build
   ```

5. **Test**
   ```bash
   npm run electron:dev
   ```

6. **Distribute**
   - Upload to GitHub releases
   - Create download page
   - Set up auto-updates

---

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Electron Forge](https://www.electronforge.io/)
- [VS Code Source](https://github.com/microsoft/vscode) - Reference implementation

---

**Ready to build your desktop IDE!** 🚀
