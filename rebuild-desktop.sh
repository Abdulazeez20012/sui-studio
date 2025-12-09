#!/bin/bash

# Sui Studio - Rebuild Desktop Applications
# This script rebuilds desktop apps with latest web features

set -e

echo "🔄 Rebuilding Sui Studio Desktop IDE with latest features..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Clean old builds
echo -e "${BLUE}[1/4]${NC} Cleaning old builds..."
rm -rf dist dist-electron/*.AppImage dist-electron/*.zip
echo -e "${GREEN}✓${NC} Old builds cleaned"
echo ""

# Step 2: Build web app
echo -e "${BLUE}[2/4]${NC} Building web application with latest features..."
npm run build
echo -e "${GREEN}✓${NC} Web app built successfully"
echo ""

# Step 3: Build Linux
echo -e "${BLUE}[3/4]${NC} Building Linux desktop app..."
npm run electron:build:linux &
LINUX_PID=$!

# Step 4: Build Windows (in parallel)
echo -e "${BLUE}[4/4]${NC} Building Windows desktop app..."
npm run electron:build:windows &
WINDOWS_PID=$!

# Wait for both builds
echo ""
echo "⏳ Building both platforms in parallel..."
echo "   This may take 5-10 minutes..."
echo ""

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
echo -e "${GREEN}🎉 Desktop IDE rebuilt with latest features!${NC}"
echo ""
echo "Next steps:"
echo "  1. Test the applications"
echo "  2. Upload to GitHub releases"
echo "  3. Update download links"
echo ""
