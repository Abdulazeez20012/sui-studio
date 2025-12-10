# 🚀 Commands to Push Desktop IDE for Collaboration

## 🎯 Quick Start - Execute These Commands

### Step 1: Check Current Status
```bash
# See what branch you're on
git branch

# See what changes you have
git status
```

---

### Step 2: Commit All Desktop Changes
```bash
# Add all new files and changes
git add .

# Commit with descriptive message
git commit -m "feat: complete desktop IDE with all features

- File watcher with chokidar
- Recent files dropdown
- Toast notification system
- Breadcrumbs navigation
- Git integration (stage, commit, push, pull)
- Settings panel (font size, tab size, themes)
- Search across files with regex
- Test execution and results
- Complete documentation

All features tested and working. Ready for collaboration."
```

---

### Step 3: Create Desktop Branch
```bash
# Create desktop branch from current state
git checkout -b desktop

# Push desktop branch to remote
git push -u origin desktop
```

---

### Step 4: Go Back to Main (Optional)
```bash
# If you want to keep main as web-only
git checkout main

# Remove desktop-specific files from main (optional)
# Only do this if you want complete separation
```

---

## 🔒 Recommended: Protect Main Branch

### On GitHub:
1. Go to your repository
2. Click **Settings** → **Branches**
3. Click **Add rule**
4. Branch name pattern: `main`
5. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1-2)
   - ✅ Require status checks to pass before merging
6. Click **Create**

---

## 📝 Create Collaboration Files

### Create README for Collaborators
```bash
cat > README_DESKTOP.md << 'EOF'
# 🖥️ Sui Studio Desktop IDE

## For Collaborators

### Setup
\`\`\`bash
git clone <your-repo-url>
cd sui-studio
git checkout desktop
npm install
\`\`\`

### Development
\`\`\`bash
# Run desktop IDE
npm run electron:dev

# Build desktop IDE
npm run electron:build
\`\`\`

### Workflow
1. Create feature branch from `desktop`
2. Make your changes
3. Submit PR to `desktop` branch
4. Never push to `main` directly

### Current Features
- ✅ File management with watcher
- ✅ Git integration
- ✅ Terminal with Sui CLI
- ✅ Settings & customization
- ✅ Search & navigation
- ✅ Testing integration

### Planned Features
See `SUI_IDE_FEATURE_ANALYSIS.md` for roadmap
EOF

git add README_DESKTOP.md
git commit -m "docs: add desktop IDE collaboration guide"
git push origin desktop
```

---

## 🤝 Invite Collaborators

### On GitHub:
1. Go to **Settings** → **Collaborators**
2. Click **Add people**
3. Enter their GitHub username
4. Choose permission level:
   - **Write** - Can push to branches (not main)
   - **Maintain** - Can manage issues and PRs
   - **Admin** - Full access

---

## 📋 Share This Workflow with Collaborators

### For New Collaborators:

**1. Clone and Setup**
```bash
git clone <your-repo-url>
cd sui-studio
git checkout desktop
npm install
```

**2. Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

**3. Make Changes and Commit**
```bash
git add .
git commit -m "feat: your feature description"
git push -u origin feature/your-feature-name
```

**4. Create Pull Request**
- Go to GitHub
- Click "Compare & pull request"
- **Base:** `desktop` (not main!)
- **Compare:** `feature/your-feature-name`
- Add description
- Submit PR

---

## 🔄 Keeping Branches in Sync

### Update Desktop Branch
```bash
git checkout desktop
git pull origin desktop
```

### Merge Desktop to Main (When Ready)
```bash
# Only do this when desktop features are stable
git checkout main
git merge desktop
git push origin main
```

---

## 📦 Alternative: Separate Repository

If you want complete separation:

### Create New Repository for Desktop
```bash
# Create new repo on GitHub first, then:

# Clone your current repo to new location
git clone <current-repo> sui-studio-desktop
cd sui-studio-desktop

# Remove old remote
git remote remove origin

# Add new remote
git remote add origin <new-desktop-repo-url>

# Push to new repo
git push -u origin main

# Rename branch if needed
git branch -m main desktop
git push -u origin desktop
```

---

## 🎯 Recommended Approach

### For Your Situation:

**Use Separate Branch (Recommended)**

**Why:**
- ✅ Easy to sync features between web and desktop
- ✅ Single repository to manage
- ✅ Can merge desktop features to web when ready
- ✅ Simpler for collaborators
- ✅ Shared components and utilities

**Commands:**
```bash
# 1. Commit everything
git add .
git commit -m "feat: complete desktop IDE implementation"

# 2. Create desktop branch
git checkout -b desktop
git push -u origin desktop

# 3. Protect main branch on GitHub

# 4. Share desktop branch with collaborators
```

---

## 🚨 Important Notes

### Before Pushing:

**1. Check for Sensitive Data**
```bash
# Make sure no API keys or secrets
grep -r "API_KEY" .
grep -r "SECRET" .
grep -r "PASSWORD" .
```

**2. Check .gitignore**
```bash
# Make sure these are ignored:
cat .gitignore | grep -E "node_modules|dist|build|.env"
```

**3. Test Build**
```bash
# Make sure it builds
npm run build
npm run electron:build
```

---

## 📊 Verification Checklist

Before pushing:
- [ ] All changes committed
- [ ] Desktop branch created
- [ ] .gitignore includes build files
- [ ] No sensitive data in code
- [ ] Documentation updated
- [ ] Build succeeds
- [ ] Tests pass (if any)

After pushing:
- [ ] Desktop branch visible on GitHub
- [ ] Main branch protected
- [ ] Collaborators invited
- [ ] README updated
- [ ] Issues/Projects created (optional)

---

## 🎉 You're Ready!

Execute these commands to push your desktop IDE:

```bash
# Final push commands
git add .
git commit -m "feat: complete desktop IDE with all features"
git checkout -b desktop
git push -u origin desktop

# Then on GitHub:
# 1. Protect main branch
# 2. Invite collaborators
# 3. Share COLLABORATION_SETUP_GUIDE.md
```

**Your desktop IDE is now ready for collaboration!** 🚀
