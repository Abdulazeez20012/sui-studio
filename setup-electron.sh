#!/bin/bash

# Sui Studio - Electron Desktop Setup Script
# This script sets up the desktop build environment

set -e

echo "🚀 Setting up Sui Studio Desktop Build Environment..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js
echo -e "${BLUE}[1/6]${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION found"
echo ""

# Step 2: Install Electron dependencies
echo -e "${BLUE}[2/6]${NC} Installing Electron dependencies..."
npm install --save-dev electron electron-builder electron-updater
npm install --save-dev concurrently wait-on cross-env
echo -e "${GREEN}✓${NC} Electron dependencies installed"
echo ""

# Step 3: Create electron directory
echo -e "${BLUE}[3/6]${NC} Creating electron directory..."
mkdir -p electron
echo -e "${GREEN}✓${NC} Electron directory created"
echo ""

# Step 4: Check for icon
echo -e "${BLUE}[4/6]${NC} Checking for app icon..."
if [ ! -f "electron/icon.png" ]; then
    echo -e "${YELLOW}⚠${NC}  No icon found at electron/icon.png"
    echo "   Please add a 512x512 PNG icon to electron/icon.png"
    echo "   You can use a placeholder for now."
else
    echo -e "${GREEN}✓${NC} App icon found"
fi
echo ""

# Step 5: Update package.json
echo -e "${BLUE}[5/6]${NC} Updating package.json..."
if [ -f "package.electron.json" ]; then
    cp package.json package.json.backup
    cp package.electron.json package.json
    echo -e "${GREEN}✓${NC} package.json updated (backup saved as package.json.backup)"
else
    echo -e "${YELLOW}⚠${NC}  package.electron.json not found, skipping..."
fi
echo ""

# Step 6: Install system dependencies (Linux)
echo -e "${BLUE}[6/6]${NC} Checking system dependencies..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Detected Linux system"
    echo "You may need to install these packages:"
    echo "  sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils"
    echo ""
    read -p "Install now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo apt-get update
        sudo apt-get install -y libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils \
          libatspi2.0-0 libdrm2 libgbm1 libxcb-dri3-0
        echo -e "${GREEN}✓${NC} System dependencies installed"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo "Detected Windows system"
    echo -e "${GREEN}✓${NC} No additional system dependencies needed"
fi
echo ""

# Done
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Add an app icon (512x512 PNG):"
echo "   ${BLUE}electron/icon.png${NC}"
echo ""
echo "2. Test in development mode:"
echo "   ${BLUE}npm run electron:dev${NC}"
echo ""
echo "3. Build for your platform:"
echo "   ${BLUE}npm run electron:build${NC}          # Current platform"
echo "   ${BLUE}npm run electron:build:linux${NC}    # Linux only"
echo "   ${BLUE}npm run electron:build:windows${NC}  # Windows only"
echo "   ${BLUE}npm run electron:build:all${NC}      # Both platforms"
echo ""
echo "4. Find built apps in:"
echo "   ${BLUE}dist-electron/${NC}"
echo ""
echo "📚 Read DESKTOP_BUILD_GUIDE.md for detailed instructions"
echo ""
