# 🔀 Separate Repositories Guide

## When Web and Desktop Are in Different GitHub Repos

This guide is for when your **web IDE** and **desktop IDE** are in **separate GitHub repositories**.

---

## 📊 Repository Structure

### **Scenario:**
```
Repository 1: sui-studio-web (GitHub)
├── src/
├── components/
├── public/
├── package.json
└── ... (web files only)

Repository 2: sui-studio-desktop (GitHub - THIS REPO)
├── electron/              ← Desktop-specific
├── electron-builder.yml   ← Desktop-specific
├── dist-electron/         ← Desktop builds
├── src/                   ← Synced from web repo
├── components/            ← Synced from web repo
└── package.json           ← Merged configuration
```

---

## 🎯 Solution Overview

We'll use a script that:
1. ✅ Pulls latest web code from the web repo
2. ✅ Syncs web files to the desktop repo
3. ✅ Preserves Electron-specific files
4. ✅ Rebuilds desktop applications

---

## 🚀 Quick Setup

### **Step 1: Configure the Sync Script**

Edit `sync-web-and-rebuild.sh` and set your web repo URL:

```bash
nano sync-web-and-rebuild.sh
```

Change this line:
```bash
WEB_REPO_URL="https://github.com/YOUR-USERNAME/sui-studio-web.git"
```

To your actual web repo:
```bash
WEB_REPO_URL="https://github.com/yourusername/sui-studio-web.git"
```

### **Step 2: Run the Sync Script**

```bash
./sync-web-and-rebuild.sh
```

This will:
1. Clone/pull your web repo
2. Sync web files to this desktop repo
3. Preserve Electron files
4. Build desktop apps

**Done!** Your desktop apps now have the latest web features.

---

## 📋 What Gets Synced

### **Files Synced FROM Web Repo:**
✅ `src/` - All React components  
✅ `components/` - UI components  
✅ `public/` - Public assets  
✅ `index.html` - Entry HTML  
✅ `vite.config.ts` - Build config  
✅ `tailwind.config.js` - Styles  
✅ `tsconfig.json` - TypeScript config  
✅ All other web source files  

### **Files PRESERVED in Desktop Repo:**
🔒 `electron/` - Electron configuration  
🔒 `electron-builder.yml` - Build configuration  
🔒 `dist-electron/` - Desktop builds  
🔒 Electron-specific scripts in `package.json`  

### **Files NOT Synced:**
❌ `node_modules/` - Installed locally  
❌ `.git/` - Git history stays separate  
❌ `dist/` - Built locally  
❌ Build artifacts  

---

## 🔄 Regular Update Workflow

### **When Web Repo Gets Updated:**

```bash
# Just run the sync script
./sync-web-and-rebuild.sh
```

This automatically:
1. Fetches latest web code
2. Syncs to desktop repo
3. Rebuilds desktop apps

### **Commit Desktop Repo Changes:**

After syncing, commit the updated files to the desktop repo:

```bash
git add .
git commit -m "Sync web features from web repo"
git push origin main
```

---

## 🎯 Alternative: Git Subtree

If you want a more integrated approach, you can use Git subtree:

### **One-Time Setup:**

```bash
# Add web repo as a subtree
git subtree add --prefix=web-src \
  https://github.com/yourusername/sui-studio-web.git main --squash
```

### **Update Web Code:**

```bash
# Pull latest from web repo
git subtree pull --prefix=web-src \
  https://github.com/yourusername/sui-studio-web.git main --squash

# Copy files to correct locations
rsync -av web-src/src/ src/
rsync -av web-src/components/ components/

# Rebuild
./rebuild-desktop.sh
```

---

## 🎯 Alternative: Git Submodule

Another option is using Git submodules:

### **One-Time Setup:**

```bash
# Add web repo as submodule
git submodule add https://github.com/yourusername/sui-studio-web.git web-src
git submodule init
```

### **Update Web Code:**

```bash
# Update submodule
git submodule update --remote web-src

# Copy files
rsync -av web-src/src/ src/
rsync -av web-src/components/ components/

# Rebuild
./rebuild-desktop.sh
```

---

## 📊 Comparison of Methods

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Sync Script** | Simple, clean separation | Manual sync needed | Most users |
| **Git Subtree** | Integrated history | More complex | Advanced users |
| **Git Submodule** | Linked repos | Requires submodule knowledge | Teams |

**Recommendation:** Use the **sync script** - it's simple and works well!

---

## 🔧 Customizing the Sync

### **Exclude Specific Files:**

Edit `sync-web-and-rebuild.sh` and add to the rsync command:

```bash
rsync -av --exclude='electron/' \
          --exclude='electron-builder.yml' \
          --exclude='YOUR_FILE_TO_EXCLUDE' \
          "$TEMP_WEB_DIR/" ./
```

### **Sync Specific Directories Only:**

```bash
# Only sync src and components
rsync -av "$TEMP_WEB_DIR/src/" ./src/
rsync -av "$TEMP_WEB_DIR/components/" ./components/
```

---

## 🐛 Troubleshooting

### **Issue: Electron Files Got Overwritten**

**Solution:** The script backs up Electron files automatically. If something goes wrong:

```bash
# Restore from backup
cp -r .electron-backup/electron .
cp .electron-backup/electron-builder.yml .
```

### **Issue: Package.json Conflicts**

**Solution:** Manually merge package.json:

```bash
# Keep Electron-specific fields:
# - "main": "electron/main.js"
# - electron:* scripts
# - electron dependencies

# Merge web dependencies
npm install
```

### **Issue: Build Fails After Sync**

**Solution:** Clean and rebuild:

```bash
rm -rf node_modules dist dist-electron
npm install
./rebuild-desktop.sh
```

---

## 📝 .gitignore for Desktop Repo

Add to your desktop repo's `.gitignore`:

```gitignore
# Temporary sync directory
temp-web-sync/

# Electron backup
.electron-backup/

# Build outputs
dist/
dist-electron/
*.AppImage
*.exe
*.zip
*.deb
*.rpm

# Dependencies
node_modules/
```

---

## 🎯 Best Practices

### **1. Keep Electron Files Separate**

Never commit Electron files to the web repo:
- `electron/`
- `electron-builder.yml`
- Desktop-specific scripts

### **2. Document the Relationship**

In both repos, add a README section:

**Web Repo:**
```markdown
## Desktop Version
The desktop version is maintained in a separate repository:
https://github.com/yourusername/sui-studio-desktop
```

**Desktop Repo:**
```markdown
## Web Source
This desktop app syncs web code from:
https://github.com/yourusername/sui-studio-web

To update: `./sync-web-and-rebuild.sh`
```

### **3. Version Synchronization**

Keep versions in sync:

```bash
# After syncing, update version in desktop repo
# Edit package.json to match web repo version
```

### **4. Test After Sync**

Always test after syncing:

```bash
# Test web build
npm run build

# Test desktop build
npm run electron:dev
```

---

## 🎊 Summary

### **For Separate Repositories:**

1. **Setup (once):**
   ```bash
   # Edit sync-web-and-rebuild.sh
   # Set WEB_REPO_URL to your web repo
   ```

2. **Update desktop with latest web features:**
   ```bash
   ./sync-web-and-rebuild.sh
   ```

3. **Commit to desktop repo:**
   ```bash
   git add .
   git commit -m "Sync latest web features"
   git push
   ```

### **Key Points:**

✅ Web and desktop repos stay separate  
✅ Electron files are preserved  
✅ Web features sync automatically  
✅ One command updates everything  
✅ No conflicts or overwrites  

---

## 📚 Scripts Available

1. **`sync-web-and-rebuild.sh`** ✅ - Sync from web repo + rebuild
2. **`rebuild-desktop.sh`** - Rebuild only (no sync)
3. **`update-and-rebuild.sh`** - For same repo (not applicable here)

**Use `sync-web-and-rebuild.sh` when repos are separate!**

---

**🔀 Perfect for maintaining separate web and desktop repositories!**
