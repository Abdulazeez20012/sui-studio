# 🔧 Sui CLI Setup Guide - Real Compilation

## Why You Need This

Currently, your IDE uses **simulated** compilation, which means:
- ❌ Package IDs are fake
- ❌ Won't show up on Suiscan
- ❌ Can't actually deploy to blockchain

With Sui CLI installed:
- ✅ Real Move compilation
- ✅ Real package IDs
- ✅ Shows up on Suiscan
- ✅ Actually deploys to blockchain

---

## 🎯 Installation Options

### Option 1: Local Development (Your Computer)

This is for testing locally before deploying to production.

#### Windows

1. **Install Rust** (required for Sui):
```powershell
# Download and run rustup-init.exe from:
# https://rustup.rs/

# Or use winget:
winget install Rustlang.Rustup
```

2. **Install Sui CLI**:
```powershell
# Open PowerShell as Administrator
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

3. **Verify Installation**:
```powershell
sui --version
# Should show: sui 1.x.x
```

4. **Initialize Sui**:
```powershell
sui client
# Follow prompts to set up
```

#### Linux/Mac

1. **Install Rust**:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

2. **Install Sui CLI**:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

3. **Verify**:
```bash
sui --version
sui client
```

---

### Option 2: Production Backend (Render/Your Server)

This is for your deployed backend to do real compilation.

#### On Render

**Method A: Using Dockerfile** (Recommended)

Create `backend/Dockerfile`:
```dockerfile
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Sui CLI
RUN cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

Update `backend/package.json` build script:
```json
"build": "tsc && npx prisma generate"
```

In Render Dashboard:
- Set **Runtime**: Docker
- Render will automatically use the Dockerfile

**Method B: Using Build Script**

Update `backend/setup.sh`:
```bash
#!/bin/bash
set -e

echo "Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

echo "Installing Sui CLI..."
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

echo "Verifying Sui installation..."
sui --version

echo "Installing Node dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npm run build

echo "Setup complete!"
```

In Render Dashboard:
- Build Command: `bash setup.sh`
- Start Command: `npm start`

---

## 🧪 Testing Real Compilation

### 1. Test Locally

```bash
# Start your backend
cd backend
npm run dev

# In another terminal, test compilation
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -d '{
    "code": "module test::hello { public fun say_hello() {} }",
    "packageName": "test"
  }'
```

**Expected Response** (with Sui CLI):
```json
{
  "success": true,
  "bytecode": "actual-compiled-bytecode-here",
  "modules": ["base64-encoded-module"],
  "dependencies": ["0x1", "0x2"],
  "message": "Compilation successful"
}
```

**Without Sui CLI**:
```json
{
  "success": true,
  "bytecode": "simulated-bytecode-...",
  "simulated": true,
  "message": "Compilation successful (simulated - Sui CLI not installed)"
}
```

### 2. Test Build Command

```bash
# In your IDE terminal
sui move build

# Should see real output:
# BUILDING MovePackage
# INCLUDING DEPENDENCY Sui
# INCLUDING DEPENDENCY MoveStdlib
# BUILDING my_package
```

### 3. Test Real Deployment

1. Connect your wallet
2. Make sure you have SUI for gas (get from faucet if testnet)
3. Write a simple Move module
4. Click "Publish to testnet"
5. Check the transaction digest on Suiscan
6. Should see your package!

---

## 🔍 Verification Checklist

After installation, verify everything works:

### Backend Verification

```bash
# SSH into your server or use Render shell
sui --version
# Should show version number

sui client
# Should show client info

# Test compilation
cd /tmp
mkdir test-compile
cd test-compile

# Create Move.toml
cat > Move.toml << EOF
[package]
name = "test"
version = "0.0.1"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/mainnet" }

[addresses]
test = "0x0"
EOF

# Create source file
mkdir sources
cat > sources/test.move << EOF
module test::hello {
    public fun say_hello() {}
}
EOF

# Try to build
sui move build
# Should compile successfully
```

### Frontend Verification

1. Open your IDE
2. Create new project
3. Write Move code
4. Click "Build" - should see real compilation
5. Click "Publish" - should create real transaction
6. Copy package ID
7. Check on Suiscan - should exist!

---

## 🐛 Troubleshooting

### Issue: "sui: command not found"

**Solution**:
```bash
# Add Cargo bin to PATH
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Or for Render, add to setup.sh:
export PATH="$HOME/.cargo/bin:$PATH"
```

### Issue: Compilation takes too long

**Solution**: Increase timeout in `backend/src/routes/compile.ts`:
```typescript
const { stdout, stderr } = await execAsync(
  `sui move build --path ${tempDir}`,
  { timeout: 120000 } // Increase to 2 minutes
);
```

### Issue: "error: linker `cc` not found"

**Solution**: Install build tools:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# Alpine (Docker)
apk add build-base
```

### Issue: Out of memory during compilation

**Solution**: Upgrade Render instance or use Docker with more memory.

---

## 📊 Performance Considerations

### Compilation Time

- **First compile**: 30-60 seconds (downloads dependencies)
- **Subsequent compiles**: 5-15 seconds (cached dependencies)
- **With caching**: < 1 second (if code unchanged)

### Resource Usage

- **Disk**: ~500MB for Sui CLI + dependencies
- **Memory**: ~512MB during compilation
- **CPU**: Moderate usage during build

### Optimization Tips

1. **Enable caching** (already implemented):
   - Caches compiled bytecode for 24 hours
   - Reuses if code unchanged

2. **Use Docker** (recommended for production):
   - Pre-built image with Sui CLI
   - Faster deployments
   - Consistent environment

3. **Upgrade server** if needed:
   - Render: Upgrade from free to $7/month
   - Gets you 512MB RAM (enough for compilation)

---

## 🎯 Quick Start Commands

### Install Locally (Windows)

```powershell
# 1. Install Rust
winget install Rustlang.Rustup

# 2. Install Sui
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# 3. Verify
sui --version

# 4. Start backend
cd backend
npm run dev
```

### Install on Render

1. Create `backend/Dockerfile` (see above)
2. Push to GitHub
3. In Render: Set Runtime to "Docker"
4. Deploy

### Test It Works

```bash
# Test compilation endpoint
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -d '{"code":"module test::hello{}", "packageName":"test"}'

# Should return real bytecode, not simulated
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Backend logs show**:
   ```
   Sui CLI version: 1.x.x
   Compilation successful
   Generated bytecode: 0x...
   ```

2. **Frontend shows**:
   - Build completes with real output
   - Package ID is valid (64 hex characters)
   - Transaction shows on Suiscan

3. **Suiscan shows**:
   - Your package exists
   - Transaction is confirmed
   - Modules are visible

---

## 🚀 Next Steps After Installation

1. **Test locally** - Make sure compilation works
2. **Deploy backend** - Push to Render with Sui CLI
3. **Test in IDE** - Try real deployment
4. **Verify on Suiscan** - Check package exists
5. **Celebrate** 🎉 - You have real compilation!

---

## 📚 Resources

- [Sui CLI Documentation](https://docs.sui.io/references/cli)
- [Sui Move Book](https://move-book.com/)
- [Sui Explorer](https://suiscan.xyz/)
- [Sui Testnet Faucet](https://discord.com/channels/916379725201563759/971488439931392130)

---

## 💡 Pro Tips

1. **Start with testnet** - Test everything before mainnet
2. **Use Docker** - More reliable than build scripts
3. **Monitor logs** - Watch for compilation errors
4. **Cache aggressively** - Saves time and resources
5. **Keep Sui updated** - `cargo install --force` to update

---

**Ready to install? Follow the steps for your platform above!** 🔧

Once installed, your IDE will do REAL compilation and deployment! 🚀
