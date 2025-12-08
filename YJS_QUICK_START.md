# Yjs Collaboration - Quick Start

## 🚀 Start in 3 Steps

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Enable Collaboration
In `src/components/ide/CodeEditor.tsx` (line ~10):
```typescript
const [enableYjs, setEnableYjs] = useState(true); // Change to true
```

### 3. Test It
- Open two browser windows
- Open same file in both
- Type in one → See in other ✨

---

## 📡 WebSocket URL
```
ws://localhost:3001/yjs?doc=<documentId>&userId=<userId>
```

---

## 🧪 Test Connection
```bash
node test-yjs-connection.js
```

---

## 📊 Check Stats
```bash
curl http://localhost:3001/api/yjs/stats
```

---

## 🎯 What You Get

✅ Real-time collaboration  
✅ Conflict-free editing (CRDT)  
✅ User cursors & presence  
✅ Automatic sync  
✅ Connection indicator  

---

## 📚 Full Documentation

- `YJS_COLLABORATION_GUIDE.md` - Complete guide
- `YJS_IMPLEMENTATION_COMPLETE.md` - Implementation details
- `SESSION_YJS_COMPLETE.md` - Session summary

---

**Status**: ✅ Production Ready
