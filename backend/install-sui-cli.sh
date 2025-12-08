#!/bin/bash

# Sui CLI Installation Script for Backend
# This script installs Sui CLI for real compilation support

set -e

echo "🚀 Installing Sui CLI..."
echo ""

# Check if Sui CLI is already installed
if command -v sui &> /dev/null; then
    echo "✅ Sui CLI is already installed!"
    sui --version
    exit 0
fi

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "📦 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo "✅ Rust installed successfully"
fi

# Install Sui CLI from source
echo "📦 Installing Sui CLI (this may take 10-15 minutes)..."
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Verify installation
if command -v sui &> /dev/null; then
    echo ""
    echo "✅ Sui CLI installed successfully!"
    echo "📋 Version:"
    sui --version
    echo ""
    echo "🎉 You can now use real Sui compilation!"
else
    echo "❌ Sui CLI installation failed"
    exit 1
fi
