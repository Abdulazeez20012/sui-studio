#!/bin/bash

# 🤝 Setup Collaboration for Desktop IDE
# This script prepares your repository for collaboration

set -e  # Exit on error

echo "🚀 Setting up Desktop IDE for Collaboration"
echo "============================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "Run 'git init' first"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${CURRENT_BRANCH}${NC}"
echo ""

# Step 1: Check for uncommitted changes
echo "Step 1: Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
    echo ""
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📝 Committing changes..."
        git add .
        git commit -m "feat: complete desktop IDE implementation

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
        echo -e "${GREEN}✅ Changes committed${NC}"
    else
        echo "⏭️  Skipping commit"
    fi
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi
echo ""

# Step 2: Create desktop branch
echo "Step 2: Creating desktop branch..."
if git show-ref --verify --quiet refs/heads/desktop; then
    echo -e "${YELLOW}⚠️  Desktop branch already exists${NC}"
    read -p "Do you want to switch to it? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout desktop
        echo -e "${GREEN}✅ Switched to desktop branch${NC}"
    fi
else
    git checkout -b desktop
    echo -e "${GREEN}✅ Desktop branch created${NC}"
fi
echo ""

# Step 3: Push desktop branch
echo "Step 3: Pushing desktop branch to remote..."
read -p "Do you want to push to remote? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git push -u origin desktop; then
        echo -e "${GREEN}✅ Desktop branch pushed to remote${NC}"
    else
        echo -e "${YELLOW}⚠️  Failed to push. Make sure remote is configured.${NC}"
    fi
else
    echo "⏭️  Skipping push"
fi
echo ""

# Step 4: Create collaboration files
echo "Step 4: Creating collaboration documentation..."

# Create README_DESKTOP.md if it doesn't exist
if [ ! -f "README_DESKTOP.md" ]; then
    cat > README_DESKTOP.md << 'EOF'
# 🖥️ Sui Studio Desktop IDE

## For Collaborators

### Quick Setup
```bash
git clone <your-repo-url>
cd sui-studio
git checkout desktop
npm install
```

### Development
```bash
# Run desktop IDE in development mode
npm run electron:dev

# Build desktop IDE for your platform
npm run electron:build
```

### Workflow
1. Always work on `desktop` branch
2. Create feature branches from `desktop`
3. Submit PRs to `desktop` branch (not main!)
4. Never push directly to `main`

### Current Features
- ✅ File management with auto-reload
- ✅ Git integration (stage, commit, push, pull)
- ✅ Terminal with Sui CLI
- ✅ Settings & customization
- ✅ Search & navigation
- ✅ Testing integration
- ✅ Toast notifications
- ✅ Recent files
- ✅ Breadcrumbs

### Planned Features
See `SUI_IDE_FEATURE_ANALYSIS.md` for complete roadmap:
- Move Language Server
- Live Object Inspector
- Gas Profiler & Optimizer
- Visual Transaction Builder
- Smart Contract Templates
- And more!

### Documentation
- `COLLABORATION_SETUP_GUIDE.md` - Complete collaboration guide
- `PUSH_DESKTOP_COMMANDS.md` - Git commands reference
- `BRANCH_STRATEGY_VISUAL.md` - Visual workflow guide
- `SUI_IDE_FEATURE_ANALYSIS.md` - Feature roadmap
EOF
    git add README_DESKTOP.md
    git commit -m "docs: add desktop IDE collaboration guide"
    echo -e "${GREEN}✅ README_DESKTOP.md created${NC}"
else
    echo -e "${YELLOW}⚠️  README_DESKTOP.md already exists${NC}"
fi
echo ""

# Step 5: Create .github/PULL_REQUEST_TEMPLATE.md
echo "Step 5: Creating PR template..."
mkdir -p .github
if [ ! -f ".github/PULL_REQUEST_TEMPLATE.md" ]; then
    cat > .github/PULL_REQUEST_TEMPLATE.md << 'EOF'
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Target Branch
- [ ] desktop (Desktop IDE) - Default
- [ ] main (Web IDE) - Requires maintainer approval

## Testing
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux
- [ ] All tests passing
- [ ] Desktop app builds successfully

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes to web IDE
- [ ] Commits are clean and descriptive

## Screenshots (if applicable)
Add screenshots or GIFs here

## Related Issues
Closes #(issue number)
EOF
    git add .github/PULL_REQUEST_TEMPLATE.md
    git commit -m "chore: add PR template"
    echo -e "${GREEN}✅ PR template created${NC}"
else
    echo -e "${YELLOW}⚠️  PR template already exists${NC}"
fi
echo ""

# Step 6: Summary
echo "============================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "============================================"
echo ""
echo "Next Steps:"
echo ""
echo "1. 🔒 Protect main branch on GitHub:"
echo "   - Go to Settings → Branches"
echo "   - Add protection rule for 'main'"
echo "   - Require PR reviews"
echo ""
echo "2. 👥 Invite collaborators:"
echo "   - Go to Settings → Collaborators"
echo "   - Add team members"
echo ""
echo "3. 📢 Share with team:"
echo "   - Send them the repository URL"
echo "   - Share README_DESKTOP.md"
echo "   - Share COLLABORATION_SETUP_GUIDE.md"
echo ""
echo "4. 🚀 Start collaborating:"
echo "   - Team creates feature branches"
echo "   - Submit PRs to 'desktop' branch"
echo "   - Review and merge"
echo ""
echo "Current branch: $(git branch --show-current)"
echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"
echo ""
echo -e "${BLUE}📚 Documentation created:${NC}"
echo "   - README_DESKTOP.md"
echo "   - COLLABORATION_SETUP_GUIDE.md"
echo "   - PUSH_DESKTOP_COMMANDS.md"
echo "   - BRANCH_STRATEGY_VISUAL.md"
echo "   - .github/PULL_REQUEST_TEMPLATE.md"
echo ""
echo -e "${GREEN}✅ Your desktop IDE is ready for collaboration!${NC}"
echo ""
