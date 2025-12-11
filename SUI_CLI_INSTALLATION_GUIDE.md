# Sui CLI Installation Guide

## ⚠️ Sui CLI Not Found

The Sui Studio IDE requires the Sui CLI to be installed for creating projects, building, testing, and publishing Move packages.

---

## 🚀 Quick Installation (Recommended)

### Option 1: Install via Cargo (Rust)

**Prerequisites:**
- Rust and Cargo must be installed

**Check if Rust is installed:**
```bash
rustc --version
cargo --version
```

**If Rust is not installed, install it first:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

**Install Sui CLI:**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

This will take 10-20 minutes to compile.

---

### Option 2: Download Pre-built Binary (Faster)

**For Linux:**
```bash
# Download the latest release
wget https://github.com/MystenLabs/sui/releases/latest/download/sui-mainnet-v1.0.0-ubuntu-x86_64.tgz

# Extract
tar -xzf sui-mainnet-v1.0.0-ubuntu-x86_64.tgz

# Move to PATH
sudo mv sui /usr/local/bin/

# Verify installation
sui --version
```

**For macOS:**
```bash
# Using Homebrew
brew install sui

# Or download binary
wget https://github.com/MystenLabs/sui/releases/latest/download/sui-mainnet-v1.0.0-macos-x86_64.tgz
tar -xzf sui-mainnet-v1.0.0-macos-x86_64.tgz
sudo mv sui /usr/local/bin/
```

**For Windows:**
1. Download from: https://github.com/MystenLabs/sui/releases
2. Extract the ZIP file
3. Add the `sui.exe` location to your PATH

---

## ✅ Verify Installation

After installation, verify it works:

```bash
# Check version
sui --version

# Should output something like:
# sui 1.0.0-xxxxx
```

---

## 🔧 Configure Sui Client

After installing, initialize the Sui client:

```bash
# Initialize client
sui client

# Create a new address
sui client new-address ed25519

# Check active address
sui client active-address

# Get testnet tokens (for testing)
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
--header 'Content-Type: application/json' \
--data-raw '{
  "FixedAmountRequest": {
    "recipient": "YOUR_ADDRESS_HERE"
  }
}'
```

---

## 🎯 Test Your Installation

Create a test project to verify everything works:

```bash
# Create a new project
sui move new hello_world

# Navigate to project
cd hello_world

# Build the project
sui move build

# Run tests
sui move test
```

If all commands work, you're ready to use Sui Studio IDE!

---

## 🐛 Troubleshooting

### "sui: command not found" after installation

**Solution 1: Restart your terminal**
```bash
# Close and reopen your terminal
# Or source your profile
source ~/.bashrc  # or ~/.zshrc for zsh
```

**Solution 2: Check PATH**
```bash
# Check if cargo bin is in PATH
echo $PATH | grep cargo

# If not, add it
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**Solution 3: Verify installation location**
```bash
# Find where sui was installed
find ~ -name sui -type f 2>/dev/null

# If found, add that directory to PATH
```

### Compilation errors during cargo install

**Solution: Update Rust**
```bash
rustup update stable
rustup default stable
```

### Permission denied errors

**Solution: Use sudo or fix permissions**
```bash
# If moving to /usr/local/bin
sudo mv sui /usr/local/bin/

# Or use a user directory
mkdir -p ~/.local/bin
mv sui ~/.local/bin/
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## 📚 Additional Resources

- **Official Sui Documentation:** https://docs.sui.io
- **Sui GitHub:** https://github.com/MystenLabs/sui
- **Sui Discord:** https://discord.gg/sui
- **Move Language Book:** https://move-book.com

---

## 🔄 After Installation

Once Sui CLI is installed:

1. **Restart Sui Studio IDE** (close and reopen)
2. **Click "Create"** to create a new project
3. **Select a folder** where you want to create the project
4. **Enter project name** and click "Create Project"

The IDE will now use the Sui CLI to create, build, test, and publish your Move projects!

---

**Need Help?**
- Check the Sui documentation: https://docs.sui.io/guides/developer/getting-started/sui-install
- Join Sui Discord for community support
- Open an issue on GitHub

---

**Status:** 📝 Installation Required  
**Estimated Time:** 10-20 minutes (cargo) or 2-5 minutes (binary)
