# Complete One-Click Workflow Setup Guide

## ✅ Implementation Complete

The one-click Build, Test, and Deploy workflow is now fully implemented and integrated into Sui Studio.

## What's Been Implemented

### 1. **Enhanced Terminal Component** ✓
- Real command execution via backend API
- Command history with arrow key navigation
- Auto-scrolling output
- Syntax highlighting for errors/success
- Support for all Sui CLI commands

**Location**: `src/components/ide/Terminal.tsx`

### 2. **Enhanced Toolbar Component** ✓
- One-click Build button with real `sui move build` execution
- One-click Test button with real `sui move test` execution
- One-click Deploy button with deployment panel integration
- Real-time status indicators (loading, success, error)
- Terminal integration for command output

**Location**: `src/components/ide/Toolbar.tsx`

### 3. **Backend Terminal Route** ✓
- Secure command execution with whitelist
- User-isolated workspaces
- Timeout protection
- File saving to workspace
- Support for Sui CLI commands

**Location**: `backend/src/routes/terminal.ts`

### 4. **API Service Integration** ✓
- `executeCommand()` method for terminal commands
- Proper error handling
- Response streaming

**Location**: `src/services/apiService.ts`

### 5. **IDE Store Enhancement** ✓
- `clearTerminal()` function
- Terminal output management
- State synchronization

**Location**: `src/store/ideStore.ts`

### 6. **Workflow Integration Component** ✓
- Discover → Explore → Test cycle visualization
- Interactive phase navigation
- Template selection (DeFi, NFT, Gaming)
- Feature showcases for each phase

**Location**: `components/WorkflowIntegration.tsx`

## How It Works

### Build Workflow (One Click)

```
User clicks "Build" button
    ↓
Toolbar saves current file to workspace
    ↓
Terminal panel opens automatically
    ↓
Command displayed: $ sui move build
    ↓
Backend executes: sui move build
    ↓
Output streams to terminal in real-time
    ↓
Success/Error status shown on button
    ↓
✓ Build complete!
```

### Test Workflow (One Click)

```
User clicks "Test" button
    ↓
Terminal panel opens automatically
    ↓
Command displayed: $ sui move test
    ↓
Backend executes: sui move test
    ↓
Test results stream to terminal
    ↓
Pass/Fail status shown on button
    ↓
✓ Tests complete!
```

### Deploy Workflow (One Click)

```
User clicks "Deploy" button
    ↓
Deployment panel opens
    ↓
User selects network (Testnet/Devnet/Mainnet)
    ↓
User clicks "Deploy to [network]"
    ↓
System compiles code
    ↓
System deploys to network
    ↓
Transaction details displayed
    ↓
Explorer link provided
    ↓
✓ Deployment complete!
```

## Features

### Terminal Features
- ✅ Real command execution
- ✅ Command history (↑/↓ arrows)
- ✅ Auto-scrolling
- ✅ Syntax highlighting
- ✅ Error/success indicators
- ✅ Clear command support
- ✅ Help command

### Build Features
- ✅ One-click compilation
- ✅ Real-time output
- ✅ Error reporting
- ✅ Success indicators
- ✅ Automatic terminal display

### Test Features
- ✅ One-click test execution
- ✅ Test result streaming
- ✅ Pass/fail indicators
- ✅ Test summary display

### Deploy Features
- ✅ Multi-network support
- ✅ Gas budget configuration
- ✅ Transaction tracking
- ✅ Explorer integration
- ✅ Deployment history

## Security Features

### Command Whitelist
Only these commands are allowed:
- `sui move build`
- `sui move test`
- `sui client`
- `sui move`
- `help`
- `clear`

### User Isolation
- Each user gets isolated workspace: `/tmp/sui-workspace-{userId}`
- Commands execute in user's workspace only
- No cross-user access

### Timeout Protection
- 60-second timeout for all commands
- Prevents hanging processes
- Automatic cleanup

## Usage Instructions

### For Developers

#### 1. Build Your Code
```
1. Write your Move code in the editor
2. Click the "Build" button in the toolbar
3. Watch the terminal for build output
4. Fix any errors and rebuild
```

#### 2. Test Your Code
```
1. Ensure code builds successfully
2. Click the "Test" button in the toolbar
3. Review test results in terminal
4. Fix failing tests and retest
```

#### 3. Deploy Your Code
```
1. Ensure all tests pass
2. Click the "Deploy" button
3. Select your target network
4. Click "Deploy to [network]"
5. View transaction on explorer
```

### Keyboard Shortcuts
- `Ctrl+B` - Build
- `Ctrl+T` - Test
- `Ctrl+D` - Deploy
- `Ctrl+J` - Toggle terminal

## Environment Setup

### Backend Requirements

1. **Sui CLI must be installed** on the backend server:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
```

2. **Environment variables** in `backend/.env`:
```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SUI_NETWORK=testnet
```

3. **Start backend**:
```bash
cd backend
npm install
npm run dev
```

### Frontend Requirements

1. **Environment variables** in `.env.local`:
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

2. **Start frontend**:
```bash
npm install
npm run dev
```

## Testing the Workflow

### Test Build
1. Open IDE
2. Create a new Move file
3. Add sample code:
```move
module my_project::hello {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::TxContext;

    struct Hello has key {
        id: UID,
        message: vector<u8>
    }

    public entry fun create(ctx: &mut TxContext) {
        let hello = Hello {
            id: object::new(ctx),
            message: b"Hello, Sui!"
        };
        transfer::transfer(hello, tx_context::sender(ctx));
    }
}
```
4. Click "Build"
5. Verify success

### Test Tests
1. Add test to your module:
```move
#[test]
fun test_create() {
    use sui::test_scenario;
    let user = @0x1;
    let scenario = test_scenario::begin(user);
    {
        create(test_scenario::ctx(&mut scenario));
    };
    test_scenario::end(scenario);
}
```
2. Click "Test"
3. Verify tests pass

### Test Deploy
1. Ensure build succeeds
2. Click "Deploy"
3. Select "Testnet"
4. Click "Deploy to testnet"
5. Verify deployment success

## Troubleshooting

### Build Fails
**Problem**: Build button shows error
**Solution**: 
- Check terminal output for errors
- Verify Move syntax
- Ensure Move.toml is correct

### Terminal Not Responding
**Problem**: Commands don't execute
**Solution**:
- Check backend is running
- Verify API_URL in .env.local
- Check browser console for errors

### Deploy Fails
**Problem**: Deployment shows error
**Solution**:
- Ensure code builds successfully
- Check network selection
- Verify sufficient gas budget
- Check backend logs

## API Endpoints

### Terminal Execution
```
POST /api/terminal/execute
Authorization: Bearer {token}
Content-Type: application/json

{
  "command": "sui move build",
  "workingDir": "/optional/path"
}

Response:
{
  "success": true,
  "output": "BUILDING my_project...",
  "workingDir": "/tmp/sui-workspace-user123"
}
```

### Save File to Workspace
```
POST /api/terminal/save-file
Authorization: Bearer {token}
Content-Type: application/json

{
  "filename": "hello.move",
  "content": "module my_project::hello { ... }"
}

Response:
{
  "success": true,
  "filePath": "/tmp/sui-workspace-user123/sources/hello.move",
  "message": "File saved successfully"
}
```

### Get Workspace Info
```
GET /api/terminal/workspace
Authorization: Bearer {token}

Response:
{
  "workspaceDir": "/tmp/sui-workspace-user123",
  "exists": true,
  "files": ["Move.toml", "sources"]
}
```

## Next Steps

### Immediate
- [x] Terminal command execution
- [x] One-click build
- [x] One-click test
- [x] One-click deploy
- [x] Workflow integration component

### Future Enhancements
- [ ] Parallel test execution
- [ ] Custom gas optimization
- [ ] Automated security audits
- [ ] CI/CD integration
- [ ] Multi-contract deployment
- [ ] Deployment rollback
- [ ] Performance profiling
- [ ] Code coverage reports

## Documentation

- **Workflow Integration**: `WORKFLOW_INTEGRATION.md`
- **One-Click Workflow**: `ONE_CLICK_WORKFLOW.md`
- **Build/Test/Deploy Guide**: `BUILD_TEST_DEPLOY_GUIDE.md`
- **Backend Integration**: `BACKEND_INTEGRATION.md`

## Support

For issues or questions:
1. Check terminal output for errors
2. Review backend logs
3. Verify environment setup
4. Check API connectivity

---

**Status**: ✅ FULLY IMPLEMENTED AND READY TO USE

The one-click workflow is now complete and integrated into Sui Studio. Users can build, test, and deploy Move smart contracts with a single click, following the Discover → Explore → Test cycle.
