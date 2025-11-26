#!/bin/bash
set -e

echo "🚀 Setting up Sui Studio Backend with Sui CLI..."

# Install Rust if not present
if ! command -v cargo &> /dev/null; then
    echo "📦 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    export PATH="$HOME/.cargo/bin:$PATH"
else
    echo "✅ Rust found: $(cargo --version)"
fi

# Install Sui CLI
echo "📦 Installing Sui CLI (this may take 5-10 minutes)..."
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Verify Sui installation
if command -v sui &> /dev/null; then
    echo "✅ Sui CLI installed: $(sui --version)"
else
    echo "❌ Sui CLI installation failed"
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || echo "DATABASE_URL=file:./dev.db" > .env
    echo "⚠️  Please update .env with your configuration"
fi

# Install Node dependencies
echo "📦 Installing Node dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run prisma:generate

# Run migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️  Running database migrations..."
    npm run prisma:migrate
fi

echo ""
echo "✅ Setup complete with Sui CLI!"
echo ""
echo "Sui CLI version: $(sui --version)"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your database URL"
echo "2. Run 'npm run dev' to start the server"
echo "3. Backend will compile Move code with REAL Sui CLI!"
