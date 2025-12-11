# 🔄 Update Desktop IDE Guide

## How to Update Desktop Apps with New Web Features

When you add new features to your web IDE, follow this guide to update the desktop applications.

---

## 🎯 Quick Update (Recommended)

### **⚠️ IMPORTANT: Pull from GitHub First!**

### **One Command (Complete Update):**
```bash
./update-and-rebuild.sh
```

This script will:
1. ✅ Pull latest code from GitHub
2. ✅ Install new dependencies
3. ✅ Clean old builds
4. ✅ Build web app with latest features
5. ✅ Build Linux desktop app
6. ✅ Build Windows desktop app
7. ✅ Create Windows portable ZIP

**Time:** 5-10 minutes

### **Alternative (If you already pulled manually):**
```bash
git pull origin main
npm install
./rebuild-desktop.sh
```

---

## 📋 Manual Update Process

### **Step 1: Pull Latest Code** ⚠️ **REQUIRED!**
```bash
git pull origin main
```

This gets all your new features from GitHub.

### **Step 2: Install Dependencies**
```bash
npm install
```

This installs any new packages.

### **Step 3: Build Web App**
```bash
npm run build
```

This compiles your React app with all new features.

### **Step 4: Build Desktop Apps**

**Linux:**
```bash
npm run electron:build:linux
```

**Windows:**
```bash
npm run electron:build:windows
```

**Both (parallel):**
```bash
npm run electron:build:linux &
npm run electron:build:windows &
wait
```

### **Step 3: Package Windows**
```bash
zip -r "dist-electron/Sui-Studio-1.0.0-Windows-Portable.zip" dist-electron/win-unpacked/
```

---

## 🔍 What Gets Updated?

### **Automatically Included:**
✅ All React components  
✅ All new features  
✅ All UI changes  
✅ All bug fixes  
✅ All dependencies  
✅ All assets  

### **Requires Manual Update:**
⚠️ Electron configuration (electron/main.js)  
⚠️ Native menus (if you added new menu items)  
⚠️ IPC handlers (if you added new native features)  
⚠️ Version number (package.json)  

---

## 📦 Version Management

### **Update Version Number**

Before rebuilding, update the version in `package.json`:

```json
{
  "version": "1.1.0"  // Change this
}
```

This will create:
- `Sui Studio-1.1.0.AppImage`
- `Sui-Studio-1.1.0-Windows-Portable.zip`

---

## 🚀 Complete Update Workflow

### **1. Add Features to Web IDE**
```bash
# Make your changes to React components
# Test in browser
npm run dev
```

### **2. Update Version**
```bash
# Edit package.json
nano package.json
# Change version: "1.0.0" → "1.1.0"
```

### **3. Rebuild Desktop**
```bash
./rebuild-desktop.sh
```

### **4. Test Desktop Apps**
```bash
# Linux
./"dist-electron/Sui Studio-1.1.0.AppImage"

# Windows (on Windows machine)
# Extract and run Sui Studio.exe
```

### **5. Distribute**
```bash
# Upload to GitHub releases
gh release create v1.1.0 \
  "dist-electron/Sui Studio-1.1.0.AppImage" \
  "dist-electron/Sui-Studio-1.1.0-Windows-Portable.zip"
```

---

## 🔧 Troubleshooting

### **Build Fails**

**Clean everything and retry:**
```bash
rm -rf dist dist-electron node_modules/.cache
npm run build
npm run electron:build:linux
```

### **Old Features Still Showing**

**Clear Electron cache:**
```bash
rm -rf ~/.cache/electron
rm -rf ~/.cache/electron-builder
./rebuild-desktop.sh
```

### **Desktop App Doesn't Reflect Changes**

**Verify web build:**
```bash
# Check if dist/ has latest files
ls -lt dist/assets/ | head -5

# Should show recent timestamps
```

---

## 📊 Update Checklist

Before distributing updated desktop apps:

- [ ] Updated version in package.json
- [ ] Tested web version in browser
- [ ] Built web app (`npm run build`)
- [ ] Built Linux desktop app
- [ ] Built Windows desktop app
- [ ] Tested Linux AppImage
- [ ] Tested Windows executable
- [ ] Updated release notes
- [ ] Tagged git commit
- [ ] Uploaded to releases

---

## 🎯 Common Update Scenarios

### **Scenario 1: Added New Component**
```bash
# Just rebuild - it's automatically included
./rebuild-desktop.sh
```

### **Scenario 2: Fixed Bug**
```bash
# Rebuild with new version
# Edit package.json: version → "1.0.1"
./rebuild-desktop.sh
```

### **Scenario 3: Added New Feature**
```bash
# Rebuild with new version
# Edit package.json: version → "1.1.0"
./rebuild-desktop.sh
```

### **Scenario 4: Added Native Feature**
```bash
# 1. Update electron/main.js (add IPC handler)
# 2. Update electron/preload.js (expose to renderer)
# 3. Rebuild
./rebuild-desktop.sh
```

---

## 🔄 Continuous Updates

### **Development Cycle:**

```
1. Add feature to web IDE
   ↓
2. Test in browser (npm run dev)
   ↓
3. Commit changes
   ↓
4. Update version number
   ↓
5. Rebuild desktop (./rebuild-desktop.sh)
   ↓
6. Test desktop apps
   ↓
7. Create release
   ↓
8. Distribute to users
```

---

## 📝 Release Notes Template

```markdown
# Sui Studio v1.1.0

## What's New
- Added [feature name]
- Improved [component name]
- Fixed [bug description]

## Downloads
- Linux: Sui Studio-1.1.0.AppImage
- Windows: Sui-Studio-1.1.0-Windows-Portable.zip

## Installation
Same as before - download and run!
```

---

## ⚡ Quick Commands Reference

```bash
# Update everything
./rebuild-desktop.sh

# Build web only
npm run build

# Build Linux only
npm run electron:build:linux

# Build Windows only
npm run electron:build:windows

# Clean and rebuild
rm -rf dist dist-electron
./rebuild-desktop.sh

# Test Linux app
./"dist-electron/Sui Studio-1.0.0.AppImage"
```

---

## 🎊 Summary

**To update desktop IDE with new features:**

1. **Simple way:** Run `./rebuild-desktop.sh`
2. **Manual way:** `npm run build` then `npm run electron:build:linux` and `npm run electron:build:windows`
3. **Result:** Desktop apps automatically include all web features!

**The desktop app is just a wrapper around your web app, so any changes to the web version automatically appear in the desktop version after rebuilding!**

---

## 📚 Additional Resources

- **BUILD_RESULTS.md** - Initial build results
- **DESKTOP_BUILD_GUIDE.md** - Complete build guide
- **DESKTOP_BUILD_COMMANDS.md** - Command reference
- **package.json** - Version management

---

**🔄 Keep your desktop IDE up to date with your web features!**
