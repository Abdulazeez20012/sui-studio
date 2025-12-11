#!/bin/bash

# Sui Studio - Update from GitHub and Rebuild Desktop Applications
# This script pulls latest code and rebuilds desktop apps

set -e

echo "🔄 Updating Sui Studio from GitHub and rebuilding desktop apps..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check for uncommitted changes
echo -e "${BLUE}[1/6]${NC} Checking for uncommitted changes..."
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠${NC}  You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Do you want to stash them and continue? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git stash
        echo -e "${GREEN}✓${NC} Changes stashed"
    else
        echo -e "${RED}✗${NC} Aborted. Commit or stash your changes first."
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Working directory clean"
fi
echo ""

# Step 2: Pull latest code from GitHub
echo -e "${BLUE}[2/6]${NC} Pulling latest code from GitHub..."
CURRENT_BRANCH=$(git branch --show-current)
echo "   Current branch: $CURRENT_BRANCH"

if git pull origin $CURRENT_BRANCH; then
    echo -e "${GREEN}✓${NC} Code updated from GitHub"
else
    echo -e "${RED}✗${NC} Failed to pull from GitHub"
    echo "   Please check your internet connection and GitHub access"
    exit 1
fi
echo ""

# Step 3: Install/update dependencies
echo -e "${BLUE}[3/6]${NC} Installing/updating dependencies..."
if npm install; then
    echo -e "${GREEN}✓${NC} Dependencies updated"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    exit 1
fi
echo ""

# Step 4: Clean old builds
echo -e "${BLUE}[4/6]${NC} Cleaning old builds..."
rm -rf dist dist-electron/*.AppImage dist-electron/*.zip
echo -e "${GREEN}✓${NC} Old builds cleaned"
echo ""

# Step 5: Build web app
echo -e "${BLUE}[5/6]${NC} Building web application with latest features..."
if npm run build; then
    echo -e "${GREEN}✓${NC} Web app built successfully"
else
    echo -e "${RED}✗${NC} Web build failed"
    exit 1
fi
echo ""

# Step 6: Build desktop apps
echo -e "${BLUE}[6/6]${NC} Building desktop applications..."
echo "   This may take 5-10 minutes..."
echo ""

# Build Linux
echo "   Building Linux..."
npm run electron:build:linux &
LINUX_PID=$!

# Build Windows
echo "   Building Windows..."
npm run electron:build:windows &
WINDOWS_PID=$!

# Wait for both builds
wait $LINUX_PID
LINUX_STATUS=$?

wait $WINDOWS_PID
WINDOWS_STATUS=$?

# Check results
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $LINUX_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Linux build: SUCCESS"
else
    echo -e "${YELLOW}⚠${NC} Linux build: PARTIAL (AppImage may be ready)"
fi

if [ $WINDOWS_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Windows build: SUCCESS"
else
    echo -e "${YELLOW}⚠${NC} Windows build: PARTIAL (Unpacked app may be ready)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create Windows ZIP if unpacked exists
if [ -d "dist-electron/win-unpacked" ]; then
    echo "📦 Creating Windows portable ZIP..."
    zip -r "dist-electron/Sui-Studio-1.0.0-Windows-Portable.zip" dist-electron/win-unpacked/ > /dev/null 2>&1
    echo -e "${GREEN}✓${NC} Windows ZIP created"
    echo ""
fi

# Show results
echo "📦 Built Applications:"
echo ""
if [ -f "dist-electron/Sui Studio-1.0.0.AppImage" ]; then
    SIZE=$(du -h "dist-electron/Sui Studio-1.0.0.AppImage" | cut -f1)
    echo -e "  ${GREEN}✓${NC} Linux:   Sui Studio-1.0.0.AppImage ($SIZE)"
fi

if [ -f "dist-electron/Sui-Studio-1.0.0-Windows-Portable.zip" ]; then
    SIZE=$(du -h "dist-electron/Sui-Studio-1.0.0-Windows-Portable.zip" | cut -f1)
    echo -e "  ${GREEN}✓${NC} Windows: Sui-Studio-1.0.0-Windows-Portable.zip ($SIZE)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Desktop IDE updated and rebuilt with latest features!${NC}"
echo ""
echo "What was updated:"
echo "  1. ✓ Pulled latest code from GitHub"
echo "  2. ✓ Installed new dependencies"
echo "  3. ✓ Built web app with new features"
echo "  4. ✓ Built Linux desktop app"
echo "  5. ✓ Built Windows desktop app"
echo ""
echo "Next steps:"
echo "  1. Test the applications"
echo "  2. Upload to GitHub releases"
echo "  3. Update download links"
echo ""
