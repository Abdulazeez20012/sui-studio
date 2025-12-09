# 🤔 Which Update Method Should I Use?

Quick guide to choose the right update script for your situation.

---

## 🎯 Choose Your Scenario

### **Scenario 1: Same Repository** ✅
**Web and desktop code are in the SAME GitHub repository**

```
sui-studio/ (one repo)
├── src/                  ← Web code
├── components/           ← Web code
├── electron/             ← Desktop code
├── electron-builder.yml  ← Desktop code
└── dist-electron/        ← Desktop builds
```

**Use this script:**
```bash
./update-and-rebuild.sh
```

**What it does:**
1. Pulls from THIS repo
2. Installs dependencies
3. Builds web + desktop

---

### **Scenario 2: Separate Repositories** 🔀
**Web and desktop code are in DIFFERENT GitHub repositories**

```
Repo 1: sui-studio-web
├── src/
├── components/
└── ... (web only)

Repo 2: sui-studio-desktop (THIS REPO)
├── electron/
├── electron-builder.yml
└── ... (desktop + synced web)
```

**Use this script:**
```bash
./sync-web-and-rebuild.sh
```

**What it does:**
1. Pulls from web repo
2. Syncs web files here
3. Preserves Electron files
4. Builds desktop

**⚠️ First time setup:**
```bash
# Edit the script first
nano sync-web-and-rebuild.sh

# Change this line:
WEB_REPO_URL="https://github.com/YOUR-USERNAME/sui-studio-web.git"

# To your actual web repo URL
```

---

### **Scenario 3: Already Pulled Manually** 🔄
**You already pulled/synced the code manually**

**Use this script:**
```bash
./rebuild-desktop.sh
```

**What it does:**
1. Builds web app
2. Builds desktop apps
3. Creates packages

---

## 📊 Quick Decision Tree

```
Do you have web and desktop in the same repo?
│
├─ YES → Use: ./update-and-rebuild.sh
│
└─ NO → Are they in different repos?
    │
    ├─ YES → Use: ./sync-web-and-rebuild.sh
    │         (Configure WEB_REPO_URL first!)
    │
    └─ Already synced manually?
        │
        └─ YES → Use: ./rebuild-desktop.sh
```

---

## 🎯 Common Situations

### **"I just added features to the web version"**

**Same repo:**
```bash
./update-and-rebuild.sh
```

**Different repos:**
```bash
./sync-web-and-rebuild.sh
```

---

### **"I want to test without pulling"**

```bash
./rebuild-desktop.sh
```

---

### **"I'm not sure which repo structure I have"**

Check if you have `electron/` folder:

```bash
ls -la | grep electron
```

**If you see:**
- `electron/` folder → You have desktop code here
- Check if `src/` is also here → Same repo
- Check if `src/` is elsewhere → Different repos

---

## 📝 Script Comparison

| Script | Same Repo | Different Repos | Pulls Code | Syncs | Builds |
|--------|-----------|-----------------|------------|-------|--------|
| `update-and-rebuild.sh` | ✅ | ❌ | ✅ | N/A | ✅ |
| `sync-web-and-rebuild.sh` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `rebuild-desktop.sh` | ✅ | ✅ | ❌ | ❌ | ✅ |

---

## 🚀 Recommended Setup

### **For Most Users (Same Repo):**

```bash
# Regular updates
./update-and-rebuild.sh
```

### **For Separate Repos:**

```bash
# One-time setup
nano sync-web-and-rebuild.sh  # Configure WEB_REPO_URL

# Regular updates
./sync-web-and-rebuild.sh
```

### **For Quick Rebuilds:**

```bash
# When you already have latest code
./rebuild-desktop.sh
```

---

## 🎊 Summary

**Choose based on your repository structure:**

1. **Same repo** → `./update-and-rebuild.sh`
2. **Different repos** → `./sync-web-and-rebuild.sh` (configure first!)
3. **Already synced** → `./rebuild-desktop.sh`

**Still not sure?** Use `./sync-web-and-rebuild.sh` - it works for both scenarios if configured correctly!

---

## 📚 More Information

- **Same Repo:** See `UPDATE_DESKTOP_GUIDE.md`
- **Different Repos:** See `SEPARATE_REPOS_GUIDE.md`
- **Build Commands:** See `DESKTOP_BUILD_COMMANDS.md`

---

**🎯 Pick the right tool for your setup!**
