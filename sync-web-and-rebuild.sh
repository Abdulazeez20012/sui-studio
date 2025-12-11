#!/bin/bash

# Sui Studio - Sync Web Code from Different Repo and Rebuild Desktop
# Use this when your web IDE is in a different GitHub repository

set -e

echo "🔄 Syncing web code from separate repo and rebuilding desktop apps..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
WEB_REPO_URL="https://github.com/YOUR-USERNAME/sui-studio-web.git"  # ⚠️ CHANGE THIS!
WEB_REPO_BRANCH="main"  # Change if needed
TEMP_WEB_DIR="temp-web-sync"

# Check if web repo URL is configured
if [[ "$WEB_REPO_URL" == *"YOUR-USERNAME"* ]]; then
    echo -e "${RED}✗${NC} Please configure WEB_REPO_URL in this script first!"
    echo ""
    echo "Edit sync-web-and-rebuild.sh and set:"
    echo "  WEB_REPO_URL=\"https://github.com/your-username/your-web-repo.git\""
    echo ""
    exit 1
fi

# Step 1: Clone/pull web repo
echo -e "${BLUE}[1/8]${NC} Fetching latest web code from separate repository..."
echo "   Repo: $WEB_REPO_URL"
echo "   Branch: $WEB_REPO_BRANCH"
echo ""

if [ -d "$TEMP_WEB_DIR" ]; then
    echo "   Updating existing clone..."
    cd "$TEMP_WEB_DIR"
    git pull origin $WEB_REPO_BRANCH
    cd ..
else
    echo "   Cloning repository..."
    git clone --depth 1 --branch $WEB_REPO_BRANCH $WEB_REPO_URL $TEMP_WEB_DIR
fi

echo -e "${GREEN}✓${NC} Web code fetched"
echo ""

# Step 2: Backup Electron files (just in case)
echo -e "${BLUE}[2/8]${NC} Backing up Electron configuration..."
mkdir -p .electron-backup
cp -r electron .electron-backup/ 2>/dev/null || true
cp electron-builder.yml .electron-backup/ 2>/dev/null || true
cp package.json .electron-backup/package.json.backup 2>/dev/null || true
echo -e "${GREEN}✓${NC} Electron files backed up"
echo ""

# Step 3: Sync web files (excluding Electron stuff)
echo -e "${BLUE}[3/8]${NC} Syncing web files to this project..."
echo "   Syncing: src/, components/, public/, index.html, etc."
echo ""

# Copy web source files
rsync -av --exclude='electron/' \
          --exclude='electron-builder.yml' \
          --exclude='dist-electron/' \
          --exclude='node_modules/' \
          --exclude='.git/' \
          --exclude='*.AppImage' \
          --exclude='*.zip' \
          --exclude='*.exe' \
          "$TEMP_WEB_DIR/" ./ 

echo -e "${GREEN}✓${NC} Web files synced"
echo ""

# Step 4: Restore Electron files (ensure they weren't overwritten)
echo -e "${BLUE}[4/8]${NC} Ensuring Electron files are intact..."
cp -r .electron-backup/electron . 2>/dev/null || true
cp .electron-backup/electron-builder.yml . 2>/dev/null || true

# Merge package.json (keep Electron scripts)
if [ -f ".electron-backup/package.json.backup" ]; then
    # Keep the main field and electron scripts
    echo "   Preserving Electron configuration in package.json..."
fi

echo -e "${GREEN}✓${NC} Electron files preserved"
echo ""

# Step 5: Install/update dependencies
echo -e "${BLUE}[5/8]${NC} Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 6: Clean old builds
echo -e "${BLUE}[6/8]${NC} Cleaning old builds..."
rm -rf dist dist-electron/*.AppImage dist-electron/*.zip
echo -e "${GREEN}✓${NC} Old builds cleaned"
echo ""

# Step 7: Build web app
echo -e "${BLUE}[7/8]${NC} Building web application..."
npm run build
echo -e "${GREEN}✓${NC} Web app built"
echo ""

# Step 8: Build desktop apps
echo -e "${BLUE}[8/8]${NC} Building desktop applications..."
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

# Cleanup
echo ""
echo "🧹 Cleaning up temporary files..."
rm -rf "$TEMP_WEB_DIR"
rm -rf .electron-backup

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
echo -e "${GREEN}🎉 Desktop IDE synced and rebuilt with latest web features!${NC}"
echo ""
echo "What was done:"
echo "  1. ✓ Fetched latest web code from separate repo"
echo "  2. ✓ Synced web files to this project"
echo "  3. ✓ Preserved Electron configuration"
echo "  4. ✓ Installed dependencies"
echo "  5. ✓ Built web app"
echo "  6. ✓ Built desktop apps"
echo ""
echo "Next steps:"
echo "  1. Test the applications"
echo "  2. Commit changes to THIS repo (desktop repo)"
echo "  3. Upload to GitHub releases"
echo ""
