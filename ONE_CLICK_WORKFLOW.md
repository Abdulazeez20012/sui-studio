# One-Click Workflow Implementation

## Overview
Sui Studio implements a true one-click workflow for building, testing, and deploying Move smart contracts. This document explains how the system works and how to use it.

## Architecture

### Frontend Components

#### 1. Toolbar (src/components/ide/Toolbar.tsx)
The main control center with three primary action buttons:

- **Build Button**: Compiles the current Move package
- **Test Button**: Runs all Move tests
- **Deploy Button**: Deploys to selected network (Testnet/Devnet/Mainnet)

Each button provides real-time feedback with status indicators:
- Loading state (spinning icon)
- Success state (green checkmark with glow)
- Error state (red X with glow)

#### 2. Terminal (src/components/ide/Terminal.tsx)
Enhanced terminal with:
- Real command execution via backend API
- Command history (↑/↓ arrow keys)
- Auto-scrolling output
- Syntax highlighting for errors/success messages
- Support for Sui CLI commands:
  - `sui move build`
  - `sui move test`
  - `sui client`
  - `clear`
  - `help`

#### 3. Deployment Panel (src/components/ide/DeploymentPanel.tsx)
One-click deployment interface with:
- Network selection (Testnet/Devnet/Mainnet)
- Gas budget configuration
- Real-time deployment status
- Transaction explorer links
- Deployment history

### Backend Routes

#### 1. Terminal Execution (backend/src/routes/terminal.ts)
Handles real command execution:

```typescript
POST /api/terminal/execute
{
  "command": "sui move build",
  "workingDir": "/path/to/workspace"
}
```

**Security Features**:
- Whitelist of allowed commands
- Command validation
- Timeout protection (60 seconds)
- User-isolated workspaces

**Supported Commands**:
- `sui move build` - Build Move package
- `sui move test` - Run Move tests
- `sui client` - Sui client operations
- `help` - Show available commands
- `clear` - Clear terminal

#### 2. Compilation (backend/src/routes/compile.ts)
Handles Move code compilation:

```typescript
POST /api/compile
{
  "code": "module my_module { ... }",
  "packageName": "my_project"
}
```

**Features**:
- Caching for faster repeated builds
- Detailed error reporting
- Bytecode generation
- Gas estimation

#### 3. Deployment (backend/src/routes/deploy.ts)
Handles contract deployment:

```typescript
POST /api/deploy
{
  "projectId": "project-id",
  "network": "testnet",
  "bytecode": "base64-encoded-bytecode",
  "gasBudget": 100000000
}
```

**Features**:
- Multi-network support
- Transaction tracking
- Gas usage reporting
- Explorer integration

## One-Click Workflow

### 1. Build (One Click)

**User Action**: Click "Build" button in toolbar

**System Flow**:
1. Save current file to workspace
2. Show terminal panel
3. Display command: `$ sui move build`
4. Execute build via backend API
5. Stream output to terminal
6. Show success/error status
7. Update button state with visual feedback

**Terminal Output Example**:
```
$ sui move build
BUILDING my_project
INCLUDING DEPENDENCY Sui
INCLUDING DEPENDENCY MoveStdlib
BUILDING my_project
✓ Build successful!
```

### 2. Test (One Click)

**User Action**: Click "Test" button in toolbar

**System Flow**:
1. Show terminal panel
2. Display command: `$ sui move test`
3. Execute tests via backend API
4. Stream test results to terminal
5. Parse test outcomes
6. Show pass/fail status
7. Update button state

**Terminal Output Example**:
```
$ sui move test
Running Move unit tests
[ PASS    ] 0x0::my_module::test_transfer
[ PASS    ] 0x0::my_module::test_mint
Test result: OK. Total tests: 2; passed: 2; failed: 0
✓ All tests passed!
```

### 3. Deploy (One Click)

**User Action**: Click "Deploy" button in toolbar

**System Flow**:
1. Open deployment panel
2. User selects network (if not already selected)
3. Click "Deploy to [network]" button
4. System compiles code
5. Validates compilation
6. Deploys to selected network
7. Shows transaction details
8. Provides explorer link

**Deployment Panel Output**:
```
✓ Deployment Successful

Package ID: 0x1234...5678
Transaction: abc123...def456
Gas Used: 0.0234 SUI

[View on Explorer]
```

## Workflow Integration Features

### Discover Phase
- **Project Templates**: Pre-configured DeFi, NFT, and Gaming templates
- **Environment Setup**: Automatic workspace initialization
- **Dependency Management**: Auto-generated Move.toml

### Explore Phase
- **Rapid Prototyping**: Edit and build instantly
- **Gas Analysis**: Real-time gas cost estimation
- **Collaborative Editing**: Real-time sync with team members

### Test Phase
- **Automated Testing**: One-click test execution
- **CI/CD Integration**: Automated deployment pipelines
- **Performance Metrics**: Gas profiling and optimization suggestions

## Usage Examples

### Example 1: Build and Test a New Module

1. Write your Move code in the editor
2. Click "Build" button
3. Wait for success indicator
4. Click "Test" button
5. Review test results in terminal

### Example 2: Deploy to Testnet

1. Ensure code is built successfully
2. Click "Deploy" button
3. Select "Testnet" from dropdown
4. Click "Deploy to testnet"
5. Wait for deployment confirmation
6. Click explorer link to view on-chain

### Example 3: Iterative Development

1. Write initial code
2. Build → Fix errors → Build again
3. Test → Fix failing tests → Test again
4. Deploy to Testnet → Test on-chain
5. Deploy to Mainnet when ready

## Keyboard Shortcuts

- `Ctrl+B` - Build project
- `Ctrl+T` - Run tests
- `Ctrl+D` - Open deployment panel
- `Ctrl+J` - Toggle terminal panel
- `Ctrl+\`` - Focus terminal input

## Terminal Commands

### Available Commands

```bash
# Build the Move package
sui move build

# Run all tests
sui move test

# Run specific test
sui move test --filter test_name

# Check Sui client status
sui client

# Show help
help

# Clear terminal
clear
```

### Command History

- Press `↑` to navigate to previous commands
- Press `↓` to navigate to next commands
- Press `Enter` to execute command

## Error Handling

### Build Errors
- Displayed in terminal with line numbers
- Syntax highlighting for error messages
- Button shows red error state

### Test Failures
- Failed tests highlighted in red
- Success tests shown in green
- Summary shows pass/fail count

### Deployment Errors
- Error message displayed in deployment panel
- Suggestions for common issues
- Retry option available

## Best Practices

1. **Always Build Before Testing**: Ensure code compiles before running tests
2. **Test Before Deploying**: Verify all tests pass before deployment
3. **Start with Testnet**: Deploy to Testnet first, then Mainnet
4. **Monitor Gas Usage**: Check gas costs in deployment panel
5. **Use Version Control**: Save your work frequently

## Troubleshooting

### Build Fails
- Check Move syntax
- Verify dependencies in Move.toml
- Review error messages in terminal

### Tests Fail
- Review test assertions
- Check test data
- Verify module logic

### Deployment Fails
- Ensure sufficient gas budget
- Verify network connectivity
- Check wallet balance

## Future Enhancements

- [ ] Parallel test execution
- [ ] Custom gas optimization suggestions
- [ ] Automated security audits
- [ ] One-click rollback for failed deployments
- [ ] Integration with CI/CD platforms
- [ ] Multi-contract deployment orchestration
