# Building Offline - Network Issues Workaround

## Problem
`fatal: unable to access 'https://github.com/MystenLabs/sui.git/': Could not resolve host: github.com`

## Solution

Use the `--skip-fetch-latest-git-deps` flag to skip fetching from GitHub:

```bash
sui move build --skip-fetch-latest-git-deps
```

This will use the cached Sui framework dependencies that were previously downloaded.

## Alternative: Remove Explicit Sui Dependency

The warning message suggests removing the explicit Sui dependency since it's automatically added. Update `Move.toml`:

```toml
[package]
name = "subscribtions"
version = "1.0.0"
edition = "2024.beta"

[addresses]
subscribtions = "0x0"
```

Then build normally:
```bash
sui move build
```

## Test Offline

```bash
sui move test --skip-fetch-latest-git-deps
```

## When You Have Internet

Once your network is working, run:
```bash
sui move build
```

This will fetch the latest dependencies from GitHub.

## Quick Commands

```bash
# Build (offline)
sui move build --skip-fetch-latest-git-deps

# Test (offline)
sui move test --skip-fetch-latest-git-deps

# Publish (requires internet)
sui client publish --gas-budget 100000000
```
