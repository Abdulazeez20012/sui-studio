# Compilation Error Reporting System

## Overview

This document describes the comprehensive error reporting system implemented for Move code compilation in Sui Studio. The system provides detailed, actionable error information to help developers quickly identify and fix issues.

## Features Implemented

### 1. Enhanced BuildStatus Component

**Location:** `src/components/ide/BuildStatus.tsx`

The BuildStatus component now displays:
- ✅ Expandable error details
- ✅ Individual error messages with file locations
- ✅ Error context (surrounding code lines)
- ✅ Full compilation output viewer
- ✅ Collapsible sections for better UX

**Usage:**
```tsx
<BuildStatus
  status="error"
  message="Compilation failed"
  errors={[
    {
      message: "Expected ';' after statement",
      file: "sources/main.move",
      line: 42,
      column: 15,
      context: ["  let x = 5", "  return x"]
    }
  ]}
  fullOutput="Full compiler output..."
  onClose={() => {}}
/>
```

### 2. Toolbar Integration

**Location:** `src/components/ide/Toolbar.tsx`

Three compilation modes are now available:

#### a) **Compile & Check Button** (NEW)
- Uses the `/api/compile` endpoint
- Provides detailed error analysis
- Shows structured error information
- Keyboard shortcut: `Ctrl+Shift+B`
- Color: Purple theme

#### b) **Build Button** (Enhanced)
- Runs `sui move build` command
- Shows terminal output
- Displays BuildStatus notifications
- Keyboard shortcut: `Ctrl+B`
- Color: Blue theme

#### c) **Test Button** (Existing)
- Runs `sui move test` command
- Shows test results in terminal
- Keyboard shortcut: `Ctrl+T`
- Color: Green theme

### 3. Backend Compilation Route

**Location:** `backend/src/routes/compile.ts`

Enhanced features:
- ✅ Increased buffer size (10MB) for large outputs
- ✅ Full stdout + stderr capture
- ✅ Structured error parsing with context
- ✅ File location extraction (file:line:column)
- ✅ Compilation result caching
- ✅ `fullOutput` field in responses

**Error Response Format:**
```json
{
  "success": false,
  "errors": [
    {
      "message": "Error message",
      "file": "sources/main.move",
      "line": 42,
      "column": 15,
      "severity": "error",
      "context": ["line 40", "line 41", "line 42", "line 43", "line 44"]
    }
  ],
  "fullOutput": "Complete compiler output...",
  "message": "Compilation failed"
}
```

### 4. Deployment Panel Integration

**Location:** `src/components/ide/DeploymentPanel.tsx`

Enhanced error display:
- ✅ Detailed compilation errors before deployment
- ✅ Error context and file locations
- ✅ Full output viewer
- ✅ Expandable error sections
- ✅ Better visual hierarchy

### 5. Deployment Service

**Location:** `src/services/deploymentService.ts`

Improvements:
- ✅ Captures compilation errors with full details
- ✅ Passes structured error information to UI
- ✅ Includes error context and locations
- ✅ Provides actionable error messages

## User Experience Flow

### Scenario 1: Quick Syntax Check
1. User writes Move code
2. Clicks "Check" button (purple)
3. Compilation API analyzes code
4. BuildStatus popup shows:
   - Success: Green notification with bytecode info
   - Error: Red notification with expandable errors

### Scenario 2: Full Build
1. User clicks "Build" button (blue)
2. Terminal opens showing build process
3. BuildStatus notification appears
4. Errors shown in both terminal and popup

### Scenario 3: Deployment
1. User clicks "Deploy" button
2. Code is compiled first
3. If compilation fails:
   - Detailed errors shown in deployment panel
   - Error context and locations displayed
   - Full output available in expandable section
4. If compilation succeeds:
   - Transaction is created and signed
   - Deployment proceeds normally

## Error Information Hierarchy

```
BuildStatus Notification (Top Level)
├── Status Icon & Title
├── Brief Error Message
└── Expandable Details
    ├── Individual Errors
    │   ├── Error Message
    │   ├── File Location (file:line:column)
    │   └── Code Context (expandable)
    └── Full Output (expandable)
```

## API Endpoints

### POST /api/compile
Compiles Move code and returns detailed results.

**Request:**
```json
{
  "code": "module test::example { ... }",
  "packageName": "test"
}
```

**Success Response:**
```json
{
  "success": true,
  "bytecode": "base64-encoded-bytecode",
  "modules": ["module1", "module2"],
  "dependencies": ["0x1", "0x2"],
  "message": "Compilation successful",
  "cached": false,
  "simulated": false
}
```

**Error Response:**
```json
{
  "success": false,
  "errors": [...],
  "fullOutput": "...",
  "message": "Compilation failed",
  "cached": false
}
```

### POST /api/compile/estimate-gas
Estimates gas costs for Move code.

**Request:**
```json
{
  "code": "module test::example { ... }"
}
```

**Response:**
```json
{
  "estimatedGas": 5000,
  "gasBudget": 6000,
  "breakdown": {
    "baseGas": 1000,
    "linesGas": 2000,
    "complexityFactor": 50
  }
}
```

## Testing

### Frontend Tests
**Location:** `src/services/__tests__/apiService.test.ts`

Run tests:
```bash
npm test -- --run src/services/__tests__/apiService.test.ts
```

### Backend Tests
**Location:** `backend/src/routes/__tests__/compile.test.ts`

Tests cover:
- ✅ Successful compilation
- ✅ Error handling with detailed output
- ✅ Caching behavior
- ✅ Gas estimation
- ✅ Invalid code handling
- ✅ Empty code validation

## Benefits

1. **Faster Debugging**: Developers see exactly where errors occur
2. **Better Context**: Surrounding code lines help understand issues
3. **Multiple Views**: Errors shown in terminal, popups, and panels
4. **Progressive Disclosure**: Expandable sections prevent information overload
5. **Actionable Information**: File locations are clickable/copyable
6. **Caching**: Repeated compilations are faster
7. **Graceful Degradation**: Works with or without Sui CLI installed

## Future Enhancements

- [ ] Click error to jump to line in editor
- [ ] Inline error markers in code editor
- [ ] Error severity levels (error, warning, info)
- [ ] Quick fixes and suggestions
- [ ] Error history and comparison
- [ ] Export error reports
- [ ] Integration with Nexi AI for error explanations

## Configuration

No additional configuration required. The system works out of the box with:
- Sui CLI installed: Real compilation with detailed errors
- No Sui CLI: Simulated compilation for development

## Troubleshooting

### Errors not showing details
- Check browser console for API errors
- Verify backend is running
- Check network tab for API responses

### Compilation timeout
- Increase timeout in `backend/src/routes/compile.ts`
- Current: 30 seconds
- Adjust `maxBuffer` for larger projects

### Cache issues
- Cache expires after 24 hours (success) or 1 hour (failure)
- Clear cache by restarting backend
- Or modify code to force recompilation

## Related Files

- `src/components/ide/BuildStatus.tsx` - Error display component
- `src/components/ide/Toolbar.tsx` - Build/compile buttons
- `src/components/ide/DeploymentPanel.tsx` - Deployment errors
- `backend/src/routes/compile.ts` - Compilation API
- `src/services/deploymentService.ts` - Deployment logic
- `src/services/apiService.ts` - API client

## Summary

The compilation error reporting system provides a comprehensive, user-friendly way to identify and fix Move code issues. With multiple views, detailed context, and progressive disclosure, developers can quickly understand and resolve compilation errors.
