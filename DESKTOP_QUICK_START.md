# 🚀 Desktop IDE - Quick Start Guide

## TL;DR - Get Building in 5 Minutes

```bash
# 1. Run setup script
chmod +x setup-electron.sh
./setup-electron.sh

# 2. Add an icon (optional but recommended)
# Place a 512x512 PNG at: electron/icon.png

# 3. Test it
npm run electron:dev

# 4. Build it
npm run electron:build
```

---

## Step-by-Step Instructions

### 1️⃣ Install Dependencies

**Linux:**
```bash
chmod +x setup-electron.sh
./setup-electron.sh
```

**Windows:**
```cmd
setup-electron.bat
```

**Manual Installation:**
```bash
npm install --save-dev electron electron-builder electron-updater
npm install --save-dev concurrently wait-on cross-env
```

---

### 2️⃣ Add App Icon (Optional)

Create or download a 512x512 PNG icon and save it as:
```
electron/icon.png
```

**Quick placeholder icon:**
```bash
# Download Sui logo as placeholder
curl -o electron/icon.png https://avatars.githubusercontent.com/u/100925345?s=512
```

---

### 3️⃣ Test in Development Mode

```bash
npm run electron:dev
```

This will:
- Start Vite dev server (http://localhost:5173)
- Launch Electron window
- Enable hot reload
- Open DevTools

**Expected output:**
```
> vite
  VITE v6.4.1  ready in 1234 ms
  ➜  Local:   http://localhost:5173/

> electron .
  Electron window opened
```

---

### 4️⃣ Build Desktop Apps

**Build for your current platform:**
```bash
npm run electron:build
```

**Build for specific platforms:**
```bash
# Linux only (AppImage, deb, rpm)
npm run electron:build:linux

# Windows only (installer, portable)
npm run electron:build:windows

# Both platforms
npm run electron:build:all
```

**Build time:** 2-5 minutes depending on your system

---

### 5️⃣ Find Your Built Apps

**Linux builds:**
```
dist-electron/linux/
├── sui-studio-1.0.0.AppImage          # Universal (recommended)
├── sui-studio_1.0.0_amd64.deb         # Debian/Ubuntu
└── sui-studio-1.0.0.x86_64.rpm        # Fedora/RedHat
```

**Windows builds:**
```
dist-electron/windows/
├── sui-studio-setup-1.0.0.exe         # Installer
└── sui-studio-1.0.0-portable.exe      # Portable (no install)
```

---

### 6️⃣ Test Your Built App

**Linux:**
```bash
# AppImage (easiest)
chmod +x dist-electron/linux/sui-studio-1.0.0.AppImage
./dist-electron/linux/sui-studio-1.0.0.AppImage

# Or install deb
sudo dpkg -i dist-electron/linux/sui-studio_1.0.0_amd64.deb
sui-studio
```

**Windows:**
```cmd
# Run portable version
dist-electron\windows\sui-studio-1.0.0-portable.exe

# Or run installer
dist-electron\windows\sui-studio-setup-1.0.0.exe
```

---

## 🎯 What You Get

### Desktop Features
✅ **Native File System** - Full access to local files
✅ **Native Menus** - File, Edit, View, Build, Help
✅ **Keyboard Shortcuts** - System-level shortcuts
✅ **Offline Mode** - Works without internet
✅ **Auto-Updates** - Automatic update checking
✅ **System Tray** - Minimize to tray
✅ **Native Dialogs** - Open/save file dialogs
✅ **Better Performance** - Native rendering

### Enhanced IDE Features
✅ **Real Terminal** - Execute actual shell commands
✅ **Git Integration** - Real git commands
✅ **Sui CLI** - Direct Sui CLI access
✅ **File Watchers** - Auto-reload on changes

---

## 🐛 Troubleshooting

### Build Fails on Linux

**Error:** Missing dependencies
```bash
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 \
  libxtst6 xdg-utils libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
```

**Error:** Permission denied
```bash
chmod +x setup-electron.sh
```

### Build Fails on Windows

**Error:** electron-builder not found
```cmd
npm install --save-dev electron-builder
```

**Error:** Python not found (for native modules)
```cmd
npm install --global windows-build-tools
```

### App Won't Start

**Check Node.js version:**
```bash
node -v  # Should be 18+
```

**Clear cache and rebuild:**
```bash
rm -rf node_modules dist dist-electron
npm install
npm run electron:build
```

### Large Bundle Size

**Normal sizes:**
- Linux AppImage: 150-200 MB
- Windows installer: 160-200 MB
- Windows portable: 150-190 MB

**To reduce size:**
- Enable compression (already configured)
- Remove unused dependencies
- Use production build

---

## 📦 Distribution

### Linux

**AppImage (Recommended):**
- No installation required
- Works on all distros
- Just download and run

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i sui-studio_1.0.0_amd64.deb
```

**Fedora/RedHat (.rpm):**
```bash
sudo rpm -i sui-studio-1.0.0.x86_64.rpm
```

### Windows

**Installer (.exe):**
- Standard Windows installer
- Creates Start Menu shortcuts
- Adds to Programs list

**Portable (.exe):**
- No installation
- Run from USB drive
- No admin rights needed

---

## 🔄 Updates

### Enable Auto-Updates

1. Create GitHub release
2. Upload built files
3. App will auto-check for updates

**Configure in `electron-builder.yml`:**
```yaml
publish:
  provider: github
  owner: your-username
  repo: sui-studio
```

---

## 🎨 Customization

### Change App Name
Edit `electron-builder.yml`:
```yaml
productName: Your IDE Name
```

### Change App ID
Edit `electron-builder.yml`:
```yaml
appId: com.yourcompany.youride
```

### Change Icon
Replace `electron/icon.png` with your 512x512 PNG

### Change Window Size
Edit `electron/main.js`:
```javascript
mainWindow = new BrowserWindow({
  width: 1600,  // Change this
  height: 1000, // Change this
  // ...
});
```

---

## 📚 Next Steps

1. **Read Full Guide:** `DESKTOP_BUILD_GUIDE.md`
2. **Customize:** Edit `electron/main.js` and `electron-builder.yml`
3. **Add Features:** Implement native features
4. **Test:** Test on target platforms
5. **Distribute:** Upload to GitHub releases or website

---

## 🆘 Need Help?

- **Full Documentation:** `DESKTOP_BUILD_GUIDE.md`
- **Electron Docs:** https://www.electronjs.org/docs
- **Electron Builder:** https://www.electron.build/
- **Issues:** Open an issue on GitHub

---

## ✅ Checklist

- [ ] Dependencies installed
- [ ] Icon added (`electron/icon.png`)
- [ ] Tested in dev mode (`npm run electron:dev`)
- [ ] Built successfully (`npm run electron:build`)
- [ ] Tested built app
- [ ] Ready to distribute

---

**You're ready to build desktop IDEs!** 🎉

Build time: ~5 minutes
First build: ~10 minutes (downloads Electron binaries)
Subsequent builds: ~2-3 minutes
