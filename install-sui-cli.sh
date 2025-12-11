#!/bin/bash

# Sui CLI Installation Script for Linux
# This script installs the Sui CLI for Sui Studio IDE

set -e

echo "=================================="
echo "  Sui CLI Installation Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Rust is installed
echo "Checking for Rust installation..."
if ! command -v cargo &> /dev/null; then
    echo -e "${YELLOW}Rust is not installed.${NC}"
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo -e "${GREEN}✓ Rust installed successfully${NC}"
else
    echo -e "${GREEN}✓ Rust is already installed${NC}"
    cargo --version
fi

echo ""
echo "Installing Sui CLI..."
echo "This may take 10-20 minutes to compile..."
echo ""

# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

echo ""
echo -e "${GREEN}✓ Sui CLI installed successfully!${NC}"
echo ""

# Verify installation
if command -v sui &> /dev/null; then
    echo "Sui CLI version:"
    sui --version
    echo ""
    echo -e "${GREEN}Installation complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart your terminal (or run: source ~/.bashrc)"
    echo "2. Restart Sui Studio IDE"
    echo "3. Click 'Create' to create a new Sui Move project"
    echo ""
    echo "To initialize Sui client, run:"
    echo "  sui client"
    echo ""
else
    echo -e "${RED}Warning: sui command not found in PATH${NC}"
    echo "You may need to add ~/.cargo/bin to your PATH"
    echo "Run: echo 'export PATH=\"\$HOME/.cargo/bin:\$PATH\"' >> ~/.bashrc"
    echo "Then: source ~/.bashrc"
fi

echo "=================================="
