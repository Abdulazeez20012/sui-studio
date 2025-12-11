# 🌳 Branch Strategy - Visual Guide

## 🎯 Recommended Strategy: Separate Branches

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│                      sui-studio                          │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼────────┐      ┌──────▼──────┐
        │  main branch   │      │desktop branch│
        │   (Web IDE)    │      │ (Desktop IDE)│
        │   PROTECTED    │      │              │
        └───────┬────────┘      └──────┬───────┘
                │                      │
                │                      ├─── feature/language-server
                │                      ├─── feature/object-inspector
                │                      ├─── feature/gas-profiler
                │                      └─── feature/templates
                │
        ┌───────▼────────┐
        │  Production    │
        │  Web Deploy    │
        └────────────────┘
```

---

## 🔄 Workflow Diagram

```
Developer Workflow:
═══════════════════

1. Clone Repository
   ↓
2. Checkout desktop branch
   ↓
3. Create feature branch
   ↓
4. Make changes
   ↓
5. Commit & Push
   ↓
6. Create Pull Request → desktop branch
   ↓
7. Code Review
   ↓
8. Merge to desktop
   ↓
9. (Optional) Merge desktop → main when stable
```

---

## 📊 Branch Comparison

```
┌──────────────┬─────────────────┬──────────────────┐
│   Feature    │   main branch   │  desktop branch  │
├──────────────┼─────────────────┼──────────────────┤
│ Purpose      │ Web IDE         │ Desktop IDE      │
│ Deployment   │ Vercel/Netlify  │ Electron builds  │
│ Protection   │ ✅ Protected    │ ⚠️ Semi-protected│
│ CI/CD        │ Web deploy      │ Desktop builds   │
│ Collaborators│ Maintainers     │ All contributors │
│ Merge to     │ Production      │ main (when ready)│
└──────────────┴─────────────────┴──────────────────┘
```

---

## 🎯 Feature Development Flow

```
Step 1: Create Feature Branch
═══════════════════════════════

desktop (base)
  │
  └─── feature/language-server (new branch)


Step 2: Develop Feature
═══════════════════════

feature/language-server
  │
  ├─── commit: "feat: add LSP client"
  ├─── commit: "feat: implement hover provider"
  └─── commit: "feat: add go-to-definition"


Step 3: Create Pull Request
════════════════════════════

feature/language-server ──PR──> desktop
                         (review)
                         (approve)
                         (merge)


Step 4: Merge to Desktop
═════════════════════════

desktop (updated)
  │
  └─── includes language-server feature


Step 5: Eventually Merge to Main
═════════════════════════════════

desktop ──PR──> main (when stable)
         (thorough testing)
         (maintainer approval)
         (merge)
```

---

## 🔒 Protection Levels

```
┌─────────────────────────────────────────────────┐
│              main branch (Web IDE)              │
│  🔒 HIGHLY PROTECTED                            │
│  ✅ Require 2 PR reviews                        │
│  ✅ Require status checks                       │
│  ✅ Require up-to-date branch                   │
│  ✅ Restrict push (maintainers only)            │
│  ✅ Require linear history                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│            desktop branch (Desktop IDE)         │
│  🔓 SEMI-PROTECTED                              │
│  ✅ Require 1 PR review                         │
│  ✅ Require status checks                       │
│  ⚠️ Allow force push (for rebasing)            │
│  ⚠️ Allow direct push (for maintainers)        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         feature/* branches (Development)        │
│  🔓 UNPROTECTED                                 │
│  ✅ Anyone can create                           │
│  ✅ Anyone can push                             │
│  ✅ Deleted after merge                         │
└─────────────────────────────────────────────────┘
```

---

## 👥 Team Permissions

```
┌──────────────┬──────────┬──────────┬──────────┐
│   Action     │Maintainer│Contributor│ Viewer  │
├──────────────┼──────────┼──────────┼──────────┤
│Push to main  │    ✅    │    ❌    │    ❌    │
│Push to desktop│   ✅    │    ❌    │    ❌    │
│Create feature│    ✅    │    ✅    │    ❌    │
│Create PR     │    ✅    │    ✅    │    ❌    │
│Review PR     │    ✅    │    ✅    │    ❌    │
│Merge PR      │    ✅    │    ⚠️    │    ❌    │
│Create release│    ✅    │    ❌    │    ❌    │
│View code     │    ✅    │    ✅    │    ✅    │
└──────────────┴──────────┴──────────┴──────────┘

⚠️ = Can merge own PRs after approval
```

---

## 🔄 Sync Strategies

### Strategy 1: Keep Desktop Updated from Main
```
main ──────────> desktop
     (merge)
     
When: Web IDE gets bug fixes
Why: Keep desktop up-to-date
How: git merge main
```

### Strategy 2: Merge Desktop Features to Main
```
desktop ──────────> main
        (PR + review)
        
When: Desktop features are stable
Why: Share features with web IDE
How: Create PR, thorough testing
```

### Strategy 3: Cherry-Pick Specific Features
```
desktop ──────────> main
        (cherry-pick)
        
When: Only want specific features
Why: Selective feature sharing
How: git cherry-pick <commit>
```

---

## 📦 Release Strategy

```
Desktop IDE Releases:
═══════════════════

desktop branch
  │
  ├─── Tag: v1.0.0-desktop
  ├─── Build: Windows, Mac, Linux
  └─── Release: GitHub Releases


Web IDE Releases:
═════════════════

main branch
  │
  ├─── Tag: v1.0.0-web
  ├─── Build: npm run build
  └─── Deploy: Vercel/Netlify
```

---

## 🎯 Example Timeline

```
Week 1:
───────
main:    [Web IDE v1.0] ────────────────────>
                              │
desktop:                      └─[Branch created]
                                      │
                                      ├─ feature/file-watcher
                                      └─ feature/recent-files


Week 2:
───────
main:    [Web IDE v1.0] ────────────────────>
                              
desktop:                      [Desktop v0.1] ─>
                                      │
                                      ├─ feature/git-integration
                                      └─ feature/toast-system


Week 3:
───────
main:    [Web IDE v1.0] ────────────────────>
                              
desktop:                      [Desktop v0.2] ─>
                                      │
                                      ├─ feature/language-server
                                      └─ feature/object-inspector


Week 4:
───────
main:    [Web IDE v1.0] ──[Merge]──> [v1.1] ─>
                              ↑
desktop:                      [Desktop v1.0] ─>
                         (stable features)
```

---

## 🚀 Quick Commands Reference

```bash
# Setup
git checkout -b desktop
git push -u origin desktop

# Feature Development
git checkout desktop
git pull origin desktop
git checkout -b feature/my-feature
# ... make changes ...
git push -u origin feature/my-feature

# Update Desktop
git checkout desktop
git pull origin desktop

# Merge to Main (when ready)
git checkout main
git merge desktop
git push origin main
```

---

## ✅ Success Indicators

```
✅ Desktop branch exists
✅ Main branch protected
✅ CI/CD configured for both branches
✅ Collaborators can create feature branches
✅ PRs go to desktop, not main
✅ Web IDE still deploys from main
✅ Desktop IDE builds from desktop
✅ Features can be synced between branches
```

---

## 🎉 You're All Set!

This branch strategy allows:
- ✅ Safe collaboration on desktop IDE
- ✅ Web IDE remains untouched
- ✅ Easy feature sharing when ready
- ✅ Clear separation of concerns
- ✅ Professional workflow

**Ready to collaborate!** 🚀
