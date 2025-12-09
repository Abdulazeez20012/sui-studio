# 🖥️ Desktop Build - Command Reference

Quick reference for all desktop build commands.

---

## 🚀 Setup (One-Time)

### Linux
```bash
chmod +x setup-electron.sh
./setup-electron.sh
```

### Windows
```cmd
setup-electron.bat
```

### Manual
```bash
npm install --save-dev electron electron-builder electron-updater
npm install --save-dev concurrently wait-on cross-env
```

---

## 🎨 Add Icon (Required)

```bash
# Place your 512x512 PNG icon here:
electron/icon.png

# Or download placeholder:
curl -o electron/icon.png https://avatars.githubusercontent.com/u/100925345?s=512
```

---

## 🧪 Development

### Run in Dev Mode
```bash
npm run electron:dev
```

**What it does:**
- Starts Vite dev server (http://localhost:5173)
- Opens Electron window
- Enables hot reload
- Opens DevTools

---

## 🏗️ Building

### Build for Current Platform
```bash
npm run electron:build
```

### Build for Linux Only
```bash
npm run electron:build:linux
```
**Output:**
- `sui-studio-1.0.0.AppImage` (Universal)
- `sui-studio_1.0.0_amd64.deb` (Debian/Ubuntu)
- `sui-studio-1.0.0.x86_64.rpm` (Fedora/RedHat)

### Build for Windows Only
```bash
npm run electron:build:windows
```
**Output:**
- `sui-studio-setup-1.0.0.exe` (Installer)
- `sui-studio-1.0.0-portable.exe` (Portable)

### Build for All Platforms
```bash
npm run electron:build:all
```
**Output:** All Linux + Windows packages

### Package Without Installer
```bash
npm run electron:package
```
**Output:** Unpacked app in `dist-electron/`

---

## 🧹 Clean Build

```bash
# Remove old builds
rm -rf dist-electron

# Remove all build artifacts
rm -rf dist dist-electron node_modules/.cache

# Full clean rebuild
rm -rf dist dist-electron node_modules
npm install
npm run electron:build
```

---

## 🧪 Testing Built Apps

### Linux

**AppImage:**
```bash
chmod +x dist-electron/linux/sui-studio-1.0.0.AppImage
./dist-electron/linux/sui-studio-1.0.0.AppImage
```

**Debian Package:**
```bash
sudo dpkg -i dist-electron/linux/sui-studio_1.0.0_amd64.deb
sui-studio
```

**RPM Package:**
```bash
sudo rpm -i dist-electron/linux/sui-studio-1.0.0.x86_64.rpm
sui-studio
```

### Windows

**Portable:**
```cmd
dist-electron\windows\sui-studio-1.0.0-portable.exe
```

**Installer:**
```cmd
dist-electron\windows\sui-studio-setup-1.0.0.exe
```

---

## 📦 Distribution

### Create Release Package
```bash
# Build all platforms
npm run electron:build:all

# Create release directory
mkdir -p releases/v1.0.0

# Copy builds
cp dist-electron/linux/*.AppImage releases/v1.0.0/
cp dist-electron/linux/*.deb releases/v1.0.0/
cp dist-electron/linux/*.rpm releases/v1.0.0/
cp dist-electron/windows/*.exe releases/v1.0.0/

# Create checksums
cd releases/v1.0.0
sha256sum * > SHA256SUMS.txt
```

### Upload to GitHub
```bash
# Create release
gh release create v1.0.0 \
  --title "Sui Studio v1.0.0" \
  --notes "Release notes here" \
  releases/v1.0.0/*
```

---

## 🔧 Troubleshooting Commands

### Check Node Version
```bash
node -v  # Should be 18+
npm -v
```

### Check Electron Installation
```bash
npx electron --version
```

### Install Linux Dependencies
```bash
sudo apt-get update
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 \
  libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

### Install Wine (for Windows builds on Linux)
```bash
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install wine64 wine32
```

### Clear Electron Cache
```bash
rm -rf ~/.cache/electron
rm -rf ~/.cache/electron-builder
```

### Rebuild Native Modules
```bash
npm rebuild
npx electron-rebuild
```

---

## 📊 Build Information

### Check Build Size
```bash
du -sh dist-electron/linux/*.AppImage
du -sh dist-electron/windows/*.exe
```

### List Build Contents
```bash
# Linux AppImage
./dist-electron/linux/sui-studio-1.0.0.AppImage --appimage-extract
ls squashfs-root/

# Windows (requires 7zip)
7z l dist-electron/windows/sui-studio-1.0.0-portable.exe
```

### Verify Build
```bash
# Check if files exist
ls -lh dist-electron/linux/
ls -lh dist-electron/windows/

# Check file types
file dist-electron/linux/*.AppImage
file dist-electron/windows/*.exe
```

---

## 🎯 Quick Workflows

### First Time Setup
```bash
./setup-electron.sh
curl -o electron/icon.png https://avatars.githubusercontent.com/u/100925345?s=512
npm run electron:dev
```

### Daily Development
```bash
npm run electron:dev
# Make changes, hot reload works
# Ctrl+C to stop
```

### Release Build
```bash
# Update version in package.json
npm version 1.0.1

# Build all platforms
npm run electron:build:all

# Test builds
./dist-electron/linux/sui-studio-1.0.1.AppImage

# Create release
gh release create v1.0.1 dist-electron/**/*
```

### Quick Test Build
```bash
npm run build
npm run electron:package
./dist-electron/linux-unpacked/sui-studio
```

---

## 🔍 Debugging

### Enable Verbose Logging
```bash
DEBUG=electron-builder npm run electron:build
```

### Check Build Configuration
```bash
npx electron-builder --help
cat electron-builder.yml
```

### Test Electron Main Process
```bash
# Run main.js directly
npx electron electron/main.js
```

### Inspect Built App
```bash
# Extract AppImage
./dist-electron/linux/sui-studio-1.0.0.AppImage --appimage-extract

# Check resources
ls squashfs-root/resources/
```

---

## 📈 Performance

### Measure Build Time
```bash
time npm run electron:build
```

### Measure App Startup Time
```bash
time ./dist-electron/linux/sui-studio-1.0.0.AppImage --no-sandbox
```

### Profile Build
```bash
npm run electron:build -- --profile
```

---

## 🎨 Customization Commands

### Change App Version
```bash
npm version 1.0.1
npm run electron:build
```

### Update Dependencies
```bash
npm update electron electron-builder
npm run electron:build
```

### Add New Platform
```bash
# Edit electron-builder.yml, add:
# mac:
#   target: dmg

npm run electron:build:mac
```

---

## 📚 Help Commands

### Electron Help
```bash
npx electron --help
```

### Electron Builder Help
```bash
npx electron-builder --help
```

### List Available Targets
```bash
npx electron-builder --help | grep -A 20 "Targets:"
```

---

## ✅ Pre-Release Checklist

```bash
# 1. Update version
npm version 1.0.0

# 2. Clean build
rm -rf dist dist-electron
npm install

# 3. Build all platforms
npm run electron:build:all

# 4. Test each build
./dist-electron/linux/sui-studio-1.0.0.AppImage
# (Test Windows on Windows machine)

# 5. Create checksums
cd dist-electron
sha256sum **/* > SHA256SUMS.txt

# 6. Create release
gh release create v1.0.0 **/*
```

---

**All commands ready to use!** 🚀

Copy and paste these commands to build your desktop IDE.
