# Build, Test, Deploy - Quick Guide

## 🎯 Primary Action Buttons

The IDE now features **three prominent, well-designed buttons** in the toolbar for the most important actions:

### 1. 🔨 Build Button (Blue)
**Location**: Center of toolbar
**Color**: Blue gradient (from-blue-500 to-blue-600)
**Shortcut**: `Ctrl/Cmd + Shift + B`

**What it does:**
- Compiles your Sui Move code using the backend compiler
- Validates syntax and type checking
- Shows compilation errors if any
- Caches successful builds for faster subsequent builds

**Usage:**
```typescript
// Click the Build button or press Ctrl+Shift+B
// Status appears in bottom-right corner
// ✅ Build Successful - Code is ready to test
// ❌ Build Failed - Check errors in console
```

**Visual Feedback:**
- Button shows "Building..." with spinner during compilation
- Success: Green toast notification
- Error: Red toast notification with error details
- Status bar shows "Build: Ready" or "Build: Failed"

---

### 2. 🧪 Test Button (Green)
**Location**: Center of toolbar (between Build and Deploy)
**Color**: Green gradient (from-green-500 to-green-600)
**Shortcut**: `Ctrl/Cmd + Shift + T`

**What it does:**
- Runs unit tests for your Move code
- Validates contract behavior
- Shows test results and coverage
- Identifies failing tests

**Usage:**
```typescript
// Click the Test button or press Ctrl+Shift+T
// Tests run automatically
// ✅ All tests passed (X/X)
// ❌ Tests failed (X/Y passed)
```

**Visual Feedback:**
- Button shows "Testing..." with spinner during test execution
- Success: Green toast with test count
- Error: Red toast with failed test details
- Status bar shows "Tests: Passed" or "Tests: Failed (X/Y)"

---

### 3. 🚀 Deploy Button (Cyan)
**Location**: Center of toolbar (rightmost of the three)
**Color**: Sui cyan gradient (from-sui-cyan to-blue-500)
**Shortcut**: `Ctrl/Cmd + Shift + D`

**What it does:**
- Opens the deployment panel
- Allows network selection (Testnet/Devnet/Mainnet)
- Deploys compiled contract to Sui blockchain
- Tracks deployment status and transaction

**Usage:**
```typescript
// Click the Deploy button or press Ctrl+Shift+D
// Deployment panel opens on the right
// Select network (Testnet/Devnet/Mainnet)
// Click "Deploy to [network]"
// View transaction on Sui Explorer
```

**Visual Feedback:**
- Opens right panel with deployment options
- Shows deployment progress
- Displays package ID and transaction digest
- Status bar shows "Deploy: [Network]"

---

## 🎨 Button Design

### Visual Hierarchy
```
┌─────────────────────────────────────────────┐
│  Logo    [🔨 Build] [🧪 Test] [🚀 Deploy]  │
└─────────────────────────────────────────────┘
```

### Color Scheme
- **Build**: Blue (#3B82F6) - Represents foundation/structure
- **Test**: Green (#10B981) - Represents validation/success
- **Deploy**: Cyan (#3CB9FF) - Represents Sui brand/launch

### States
1. **Normal**: Gradient background with shadow
2. **Hover**: Darker gradient with enhanced shadow glow
3. **Active**: Spinner animation with "...ing" text
4. **Disabled**: 50% opacity, cursor not-allowed

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut | Description |
|--------|----------|-------------|
| Build | `Ctrl/Cmd + Shift + B` | Compile current file |
| Test | `Ctrl/Cmd + Shift + T` | Run tests |
| Deploy | `Ctrl/Cmd + Shift + D` | Open deployment panel |
| Save | `Ctrl/Cmd + S` | Save current file |
| Toggle Sidebar | `Ctrl/Cmd + B` | Show/hide file explorer |
| Toggle Terminal | `Ctrl/Cmd + J` | Show/hide terminal |

---

## 📊 Status Bar Integration

The status bar (bottom of IDE) shows real-time status:

```
┌──────────────────────────────────────────────────────────┐
│ 🌿 main ✓ Ready │ 🔨 Build: Ready │ 🧪 Tests: Passed │ 🚀 Deploy: Testnet │
└──────────────────────────────────────────────────────────┘
```

**Status Indicators:**
- **Build**: Ready / Building / Success / Failed
- **Tests**: Passed / Running / Failed (X/Y)
- **Deploy**: Network name / Deploying / Success / Failed

---

## 🔄 Workflow

### Typical Development Flow

1. **Write Code** ✍️
   - Edit your Move files in Monaco Editor
   - Auto-save enabled (every 30 seconds)

2. **Build** 🔨
   - Click Build button or `Ctrl+Shift+B`
   - Wait for compilation (2-5 seconds)
   - Fix any errors shown

3. **Test** 🧪
   - Click Test button or `Ctrl+Shift+T`
   - Review test results
   - Fix failing tests

4. **Deploy** 🚀
   - Click Deploy button or `Ctrl+Shift+D`
   - Select network (Testnet recommended)
   - Confirm deployment
   - View on Sui Explorer

---

## 🎯 Button Behavior

### Build Button
```typescript
// Disabled when:
- No file is open
- Already building

// Enabled when:
- File is open and not building

// On Click:
1. Show "Building..." state
2. Call backend compile API
3. Show result toast
4. Update status bar
```

### Test Button
```typescript
// Disabled when:
- No file is open
- Already testing
- Build failed

// Enabled when:
- File is open and built successfully

// On Click:
1. Show "Testing..." state
2. Run test suite
3. Show results toast
4. Update status bar
```

### Deploy Button
```typescript
// Disabled when:
- No file is open
- Build failed
- Tests failed

// Enabled when:
- File is open
- Build successful
- Tests passed (optional)

// On Click:
1. Open deployment panel
2. Show network options
3. Allow user to deploy
```

---

## 🎨 Toast Notifications

### Success Toast (Green)
```
┌─────────────────────────────┐
│ ✓ Build Successful          │
│ Compiled in 2.3s            │
└─────────────────────────────┘
```

### Error Toast (Red)
```
┌─────────────────────────────┐
│ ✗ Build Failed              │
│ Syntax error on line 42     │
└─────────────────────────────┘
```

### Progress Toast (Blue)
```
┌─────────────────────────────┐
│ ⟳ Building...               │
│ Compiling Move modules      │
└─────────────────────────────┘
```

---

## 🔧 Customization

### Change Button Colors
Edit `src/components/ide/Toolbar.tsx`:

```typescript
// Build button
className="bg-gradient-to-r from-blue-500 to-blue-600"

// Test button
className="bg-gradient-to-r from-green-500 to-green-600"

// Deploy button
className="bg-gradient-to-r from-sui-cyan to-blue-500"
```

### Change Button Order
Reorder buttons in the toolbar JSX:

```typescript
<button>Build</button>
<button>Test</button>
<button>Deploy</button>
```

### Add More Buttons
Follow the same pattern:

```typescript
<button
  onClick={handleAction}
  disabled={isLoading}
  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg"
>
  <Icon size={18} />
  <span>Action</span>
</button>
```

---

## 📱 Responsive Design

### Desktop (>1024px)
- All three buttons visible with full text
- Buttons have padding and shadows
- Hover effects enabled

### Tablet (768px-1024px)
- Buttons slightly smaller
- Text remains visible
- Touch-friendly sizing

### Mobile (<768px)
- Buttons show icons only
- Text hidden on small screens
- Larger touch targets

---

## 🎓 Best Practices

### For Users
1. **Always build before testing** - Ensures latest code is tested
2. **Test before deploying** - Catch bugs early
3. **Use keyboard shortcuts** - Faster workflow
4. **Check status bar** - Quick status overview
5. **Read error messages** - Helpful debugging info

### For Developers
1. **Provide clear feedback** - Users should know what's happening
2. **Disable during operations** - Prevent double-clicks
3. **Show progress** - Spinner for long operations
4. **Handle errors gracefully** - Show helpful error messages
5. **Update status bar** - Keep status in sync

---

## 🐛 Troubleshooting

### Build Button Not Working
- Check if file is open
- Verify backend is running
- Check console for errors
- Ensure Sui CLI is installed

### Test Button Disabled
- Build the project first
- Check if build was successful
- Verify test files exist

### Deploy Button Not Opening Panel
- Check if right panel is already open
- Try closing and reopening
- Refresh the page

---

## 🚀 Future Enhancements

- [ ] Build progress bar
- [ ] Test coverage visualization
- [ ] Deployment history
- [ ] One-click build+test+deploy
- [ ] Custom build configurations
- [ ] Parallel test execution
- [ ] Deployment rollback
- [ ] Build artifacts download

---

## 📝 Summary

The **Build, Test, Deploy** buttons are now:
- ✅ Prominently displayed in the toolbar
- ✅ Well-designed with gradients and shadows
- ✅ Fully functional with backend integration
- ✅ Keyboard shortcut enabled
- ✅ Status bar integrated
- ✅ Toast notifications for feedback
- ✅ Disabled states for safety
- ✅ Loading states with spinners

**Ready to use!** 🎉
