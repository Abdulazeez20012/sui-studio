# 🤝 Collaboration Setup Guide - Desktop IDE Development

## 🎯 Goal
Enable collaboration on the desktop IDE without affecting the existing web IDE deployment.

---

## 📋 Strategy Overview

### Option 1: Separate Branch (Recommended) ⭐
**Best for:** Active web IDE in production

- Keep `main` branch for web IDE
- Create `desktop` branch for desktop development
- Merge desktop features back when ready
- Web IDE remains untouched

### Option 2: Separate Repository
**Best for:** Long-term separate projects

- Fork/create new repo for desktop IDE
- Independent development
- Can sync features between repos
- Complete separation

### Option 3: Monorepo with Workspaces
**Best for:** Shared codebase

- Use npm/yarn workspaces
- Separate packages for web/desktop
- Share common components
- More complex setup

---

## 🚀 RECOMMENDED: Separate Branch Strategy

### Step 1: Create Desktop Branch

```bash
# Make sure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to desktop branch
git checkout -b desktop

# Push desktop branch to remote
git push -u origin desktop
```

---

### Step 2: Protect Main Branch

**On GitHub/GitLab:**
1. Go to Settings → Branches
2. Add branch protection rule for `main`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Restrict who can push

**This ensures web IDE stays stable!**

---

### Step 3: Set Up Branch-Specific Deployment

#### For Web IDE (main branch):
```yaml
# .github/workflows/deploy-web.yml
name: Deploy Web IDE

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Build web
        run: npm run build
      - name: Deploy to hosting
        run: # Your web deployment command
```

#### For Desktop IDE (desktop branch):
```yaml
# .github/workflows/build-desktop.yml
name: Build Desktop IDE

on:
  push:
    branches: [desktop]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install
      - name: Build desktop
        run: npm run electron:build
```

---

### Step 4: Create .gitignore for Desktop-Specific Files

```bash
# Add to .gitignore (if not already there)
echo "
# Desktop IDE specific
dist-electron/
release/
*.dmg
*.exe
*.AppImage
*.deb
*.rpm
" >> .gitignore
```

---

### Step 5: Update README for Collaborators

Create `README_COLLABORATION.md`:

```markdown
# 🤝 Collaboration Guide

## Branches

- **main** - Web IDE (production)
- **desktop** - Desktop IDE (development)

## Getting Started

### For Web IDE Development
\`\`\`bash
git checkout main
npm install
npm run dev
\`\`\`

### For Desktop IDE Development
\`\`\`bash
git checkout desktop
npm install
npm run electron:dev
\`\`\`

## Workflow

1. Always work on `desktop` branch
2. Create feature branches from `desktop`
3. Submit PRs to `desktop` branch
4. Never push directly to `main`

## Feature Branches

\`\`\`bash
# Create feature branch
git checkout desktop
git pull origin desktop
git checkout -b feature/your-feature-name

# Work on your feature
# Commit changes

# Push feature branch
git push -u origin feature/your-feature-name

# Create PR to desktop branch
\`\`\`
```

---

### Step 6: Set Up Collaboration Workflow

#### For Collaborators:

**1. Clone Repository**
```bash
git clone https://github.com/your-username/sui-studio.git
cd sui-studio
```

**2. Checkout Desktop Branch**
```bash
git checkout desktop
npm install
```

**3. Create Feature Branch**
```bash
git checkout -b feature/language-server
# or
git checkout -b feature/object-inspector
# or
git checkout -b feature/gas-profiler
```

**4. Work on Feature**
```bash
# Make changes
git add .
git commit -m "feat: implement language server integration"
git push -u origin feature/language-server
```

**5. Create Pull Request**
- Go to GitHub
- Create PR from `feature/language-server` → `desktop`
- Request review
- Merge when approved

---

### Step 7: Syncing Changes

#### Keep Desktop Branch Updated
```bash
git checkout desktop
git pull origin desktop
```

#### Merge Web IDE Fixes to Desktop (if needed)
```bash
git checkout desktop
git merge main
# Resolve conflicts if any
git push origin desktop
```

#### Merge Desktop Features to Web (when ready)
```bash
git checkout main
git merge desktop
# Test thoroughly
git push origin main
```

---

## 📁 Recommended File Structure

```
sui-studio/
├── .github/
│   └── workflows/
│       ├── deploy-web.yml      # Web IDE deployment
│       └── build-desktop.yml   # Desktop IDE builds
├── electron/                   # Desktop-specific
│   ├── main.js
│   ├── preload.js
│   └── README.md
├── src/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── ...
├── docs/                       # Documentation
│   ├── WEB_IDE.md
│   ├── DESKTOP_IDE.md
│   └── COLLABORATION.md
├── package.json
├── package.electron.json       # Desktop-specific
├── electron-builder.yml        # Desktop-specific
├── README.md                   # Main readme
└── README_COLLABORATION.md     # This guide
```

---

## 🔒 Branch Protection Rules

### Main Branch (Web IDE)
- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict who can push (maintainers only)
- ✅ Require linear history

### Desktop Branch
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Allow force pushes (for rebasing)

---

## 👥 Team Roles & Permissions

### Maintainers
- Can merge to `main` and `desktop`
- Can create releases
- Can manage branch protection

### Contributors
- Can create feature branches
- Can submit PRs to `desktop`
- Cannot push to `main` or `desktop`

### Collaborators
- Can review PRs
- Can comment and suggest changes
- Can approve PRs

---

## 🔄 Workflow Diagram

```
main (Web IDE - Production)
  ↑
  │ (merge when stable)
  │
desktop (Desktop IDE - Development)
  ↑
  ├── feature/language-server
  ├── feature/object-inspector
  ├── feature/gas-profiler
  └── feature/templates
```

---

## 📝 Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Target Branch
- [ ] desktop (Desktop IDE)
- [ ] main (Web IDE) - Requires maintainer approval

## Testing
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] All tests passing

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes to web IDE

## Screenshots (if applicable)
Add screenshots here
```

---

## 🧪 Testing Strategy

### Before Merging to Desktop
```bash
# Run tests
npm test

# Build desktop app
npm run electron:build

# Test on your OS
# Open the built app and test
```

### Before Merging to Main
```bash
# Checkout main
git checkout main
git merge desktop

# Test web IDE
npm run build
npm run preview

# Test desktop IDE
npm run electron:build

# If all good, push
git push origin main
```

---

## 📦 Release Strategy

### Desktop IDE Releases
```bash
# On desktop branch
git checkout desktop
git pull origin desktop

# Update version
npm version patch  # or minor, or major

# Build for all platforms
npm run electron:build:all

# Create GitHub release
# Upload built files
```

### Web IDE Releases
```bash
# On main branch
git checkout main
git pull origin main

# Deploy to hosting
npm run build
# Deploy to Vercel/Netlify/etc.
```

---

## 🚨 Important Rules

### DO:
✅ Always work on `desktop` branch for desktop features
✅ Create feature branches from `desktop`
✅ Submit PRs to `desktop` branch
✅ Test thoroughly before merging
✅ Keep commits clean and descriptive
✅ Update documentation

### DON'T:
❌ Push directly to `main` branch
❌ Merge desktop features to main without testing
❌ Break the web IDE
❌ Commit large binary files
❌ Commit sensitive data (API keys, etc.)

---

## 🔧 Setup Commands for New Collaborators

```bash
# 1. Clone repository
git clone https://github.com/your-username/sui-studio.git
cd sui-studio

# 2. Install dependencies
npm install

# 3. Checkout desktop branch
git checkout desktop

# 4. Test web IDE (should still work)
npm run dev

# 5. Test desktop IDE
npm run electron:dev

# 6. Create your feature branch
git checkout -b feature/your-feature

# 7. Start coding!
```

---

## 📞 Communication

### GitHub Issues
- Use labels: `web-ide`, `desktop-ide`, `bug`, `feature`
- Assign to appropriate team members
- Link PRs to issues

### GitHub Discussions
- Feature proposals
- Architecture decisions
- Questions and help

### Pull Request Reviews
- Be constructive
- Test changes locally
- Approve or request changes

---

## 🎯 Feature Development Workflow

### Example: Implementing Language Server

```bash
# 1. Create feature branch
git checkout desktop
git pull origin desktop
git checkout -b feature/language-server

# 2. Create feature files
mkdir -p src/services/languageServer
touch src/services/languageServer/index.ts

# 3. Implement feature
# ... code ...

# 4. Test locally
npm run electron:dev

# 5. Commit changes
git add .
git commit -m "feat: add Move language server integration"

# 6. Push to remote
git push -u origin feature/language-server

# 7. Create PR on GitHub
# Target: desktop branch
# Request review from team

# 8. Address review comments
# Make changes, commit, push

# 9. Merge when approved
# Delete feature branch after merge
```

---

## 📊 Monitoring & Maintenance

### Weekly Tasks
- Review open PRs
- Update dependencies
- Check CI/CD status
- Triage new issues

### Monthly Tasks
- Review branch strategy
- Clean up stale branches
- Update documentation
- Plan next features

---

## 🎉 Success Checklist

- [ ] Desktop branch created
- [ ] Branch protection rules set
- [ ] CI/CD workflows configured
- [ ] Collaboration guide shared
- [ ] Team members added
- [ ] First PR submitted
- [ ] First feature merged
- [ ] Web IDE still working
- [ ] Desktop IDE building
- [ ] Documentation updated

---

## 🚀 Ready to Collaborate!

Your repository is now set up for safe collaboration on the desktop IDE without affecting the web IDE!

**Next Steps:**
1. Push desktop branch to GitHub
2. Set up branch protection
3. Invite collaborators
4. Share this guide
5. Start building amazing features!

**Questions?** Open a GitHub Discussion or Issue!
