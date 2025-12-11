# 🖥️ Build Desktop IDE - Start Here

Convert your web-based Sui Studio IDE into native desktop applications for Linux and Windows.

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Run setup
./setup-electron.sh

# 2. Add icon (optional)
# Place 512x512 PNG at: electron/icon.png

# 3. Test
npm run electron:dev

# 4. Build
npm run electron:build:all
```

**Done!** Find your apps in `dist-electron/`

---

## 📚 Full Documentation

**Start here:** [DESKTOP_BUILD_INDEX.md](DESKTOP_BUILD_INDEX.md)

### Quick Links

- **[5-Minute Quick Start](DESKTOP_QUICK_START.md)** - Get building fast
- **[Complete Guide](DESKTOP_BUILD_GUIDE.md)** - Full documentation
- **[Command Reference](DESKTOP_BUILD_COMMANDS.md)** - All commands
- **[Visual Guide](DESKTOP_BUILD_VISUAL_GUIDE.md)** - Diagrams & flowcharts
- **[Summary](BUILD_DESKTOP_SUMMARY.md)** - Overview & features

---

## 🎯 What You Get

### Desktop Applications
- ✅ **Linux:** AppImage, .deb, .rpm
- ✅ **Windows:** Installer, Portable
- ✅ **Native Features:** Menus, dialogs, file system
- ✅ **Offline Mode:** Works without internet
- ✅ **Auto-Updates:** Automatic update checking

### Enhanced Features
- ✅ **Real Terminal** - Execute actual commands
- ✅ **Git Integration** - Real git commands
- ✅ **Sui CLI** - Direct Sui CLI access
- ✅ **File System** - Full local file access

---

## 📦 Build Output

```
dist-electron/
├── linux/
│   ├── sui-studio-1.0.0.AppImage          (180 MB)
│   ├── sui-studio_1.0.0_amd64.deb         (165 MB)
│   └── sui-studio-1.0.0.x86_64.rpm        (165 MB)
└── windows/
    ├── sui-studio-setup-1.0.0.exe         (190 MB)
    └── sui-studio-1.0.0-portable.exe      (175 MB)
```

---

## 🛠️ Requirements

- Node.js 18+
- npm or yarn
- Linux: libgtk-3-0, libnotify4, libnss3 (auto-installed by setup script)
- Windows: No additional requirements

---

## 🚀 Commands

```bash
# Development
npm run electron:dev              # Run in dev mode

# Building
npm run electron:build            # Build for current platform
npm run electron:build:linux      # Build Linux only
npm run electron:build:windows    # Build Windows only
npm run electron:build:all        # Build all platforms

# Testing
./dist-electron/linux/sui-studio-1.0.0.AppImage
dist-electron\windows\sui-studio-1.0.0-portable.exe
```

---

## 📖 Documentation Index

1. **[DESKTOP_BUILD_INDEX.md](DESKTOP_BUILD_INDEX.md)** - Documentation index
2. **[DESKTOP_QUICK_START.md](DESKTOP_QUICK_START.md)** - 5-minute guide
3. **[DESKTOP_BUILD_GUIDE.md](DESKTOP_BUILD_GUIDE.md)** - Complete guide
4. **[DESKTOP_BUILD_COMMANDS.md](DESKTOP_BUILD_COMMANDS.md)** - Command reference
5. **[DESKTOP_BUILD_VISUAL_GUIDE.md](DESKTOP_BUILD_VISUAL_GUIDE.md)** - Visual guide
6. **[BUILD_DESKTOP_SUMMARY.md](BUILD_DESKTOP_SUMMARY.md)** - Summary

---

## 🐛 Troubleshooting

### Build fails on Linux
```bash
sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils
```

### Build fails on Windows
```bash
npm install --save-dev electron-builder
```

### App won't start
```bash
node -v  # Check Node.js version (must be 18+)
```

**More help:** See [DESKTOP_QUICK_START.md](DESKTOP_QUICK_START.md) → Troubleshooting

---

## 🎨 Customization

### Change app name
Edit `electron-builder.yml`:
```yaml
productName: Your IDE Name
```

### Change window size
Edit `electron/main.js`:
```javascript
width: 1600,
height: 1000,
```

### Add custom features
Edit `electron/main.js` and `electron/preload.js`

**More details:** See [BUILD_DESKTOP_SUMMARY.md](BUILD_DESKTOP_SUMMARY.md) → Customization

---

## 📊 Project Structure

```
sui-studio/
├── electron/                      Desktop app files
│   ├── main.js                    Main process
│   ├── preload.js                 Security bridge
│   ├── icon.png                   App icon (ADD THIS!)
│   └── README.md                  Documentation
├── electron-builder.yml           Build configuration
├── setup-electron.sh              Linux setup script
├── setup-electron.bat             Windows setup script
└── dist-electron/                 Built apps (generated)
```

---

## ✅ Quick Checklist

- [ ] Run `./setup-electron.sh`
- [ ] Add icon to `electron/icon.png`
- [ ] Test with `npm run electron:dev`
- [ ] Build with `npm run electron:build:all`
- [ ] Test built apps
- [ ] Distribute!

---

## 🆘 Need Help?

1. **Quick Start:** [DESKTOP_QUICK_START.md](DESKTOP_QUICK_START.md)
2. **Full Guide:** [DESKTOP_BUILD_GUIDE.md](DESKTOP_BUILD_GUIDE.md)
3. **Commands:** [DESKTOP_BUILD_COMMANDS.md](DESKTOP_BUILD_COMMANDS.md)
4. **Index:** [DESKTOP_BUILD_INDEX.md](DESKTOP_BUILD_INDEX.md)

---

## 🎉 Ready to Build!

**Next step:** Read [DESKTOP_QUICK_START.md](DESKTOP_QUICK_START.md) and start building!

Build time: ~5 minutes
First build: ~10 minutes
Result: Professional desktop IDE for Linux & Windows

---

**Let's build!** 🚀
