# Code Formatting - Quick Start

## ✅ Status: Ready to Use

---

## 🚀 Quick Usage

### 1. Open Format Panel
Click Format icon in IDE sidebar

### 2. Format Code
Click "Format" button

### 3. Auto-Fix Issues
Click "Auto-Fix" button

### 4. Enable Format on Save
Click settings icon to toggle

---

## 📊 Features

| Feature | Available |
|---------|-----------|
| Auto-Format | ✅ |
| Linting | ✅ |
| Auto-Fix | ✅ |
| Suggestions | ✅ |
| Format on Save | ✅ |

---

## 💻 API Example

```typescript
import { formatterService } from '@/services/formatterService';

// Format
const formatted = await formatterService.format(code);

// Lint
const issues = await formatterService.lint(code);

// Auto-fix
const fixed = await formatterService.autoFix(code);
```

---

## 🎨 Style Rules

- **Functions**: snake_case
- **Structs**: PascalCase
- **Constants**: UPPER_CASE
- **Indent**: 4 spaces
- **Max Line**: 100 chars

---

## 📚 Full Documentation

See `CODE_FORMATTING_COMPLETE.md`

---

**Status**: ✅ Production Ready
