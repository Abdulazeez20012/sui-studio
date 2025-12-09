# Yjs Collaboration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    CodeEditor.tsx                        │  │
│  │                                                          │  │
│  │  • Monaco Editor                                         │  │
│  │  • Yjs Integration (optional)                           │  │
│  │  • CollaborationIndicator                               │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │           useYjsCollaboration Hook                       │  │
│  │                                                          │  │
│  │  • Y.Doc (CRDT document)                                │  │
│  │  • WebSocket connection                                 │  │
│  │  • User awareness                                       │  │
│  │  • Content sync                                         │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        │ WebSocket
                        │ ws://localhost:3001/yjs
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│                         BACKEND                                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  WebSocket Server                        │  │
│  │                  (Port 3001, Path: /yjs)                 │  │
│  │                                                          │  │
│  │  • Connection handling                                   │  │
│  │  • Message routing                                       │  │
│  │  • CORS enabled                                          │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │            YjsCollaborationServer                        │  │
│  │                                                          │  │
│  │  • Document management                                   │  │
│  │  • Update broadcasting                                   │  │
│  │  • Automatic cleanup                                     │  │
│  │  • Stats tracking                                        │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │                                         │
│  ┌────────────────────▼─────────────────────────────────────┐  │
│  │              Document Storage                            │  │
│  │                                                          │  │
│  │  Map<docId, YjsDocument>                                │  │
│  │  • Y.Doc (CRDT)                                         │  │
│  │  • WebSocket connections                                │  │
│  │  • Last accessed timestamp                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Message Flow

### 1. Connection Establishment

```
Client                          Server
  │                               │
  ├──── WebSocket Connect ───────>│
  │     ?doc=file-123             │
  │     &userId=user-1            │
  │                               │
  │<──── Initial Sync ────────────┤
  │     { type: 'sync',           │
  │       data: [1,2,3...] }      │
  │                               │
```

### 2. Content Update

```
Client A          Server          Client B
  │                 │                │
  ├─ Edit text ────>│                │
  │                 │                │
  │                 ├─ Broadcast ───>│
  │                 │                │
  │                 │<─ Apply update─┤
  │                 │                │
```

### 3. User Awareness

```
Client A          Server          Client B
  │                 │                │
  ├─ Cursor move ──>│                │
  │                 │                │
  │                 ├─ Broadcast ───>│
  │                 │                │
  │                 │  Show cursor   │
  │                 │  at position   │
  │                 │                │
```

---

## Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                    User Action                          │
│                  (Types in editor)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Monaco Editor onChange                     │
│              handleEditorChange(value)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├──────────────────┬─────────────────┐
                     ▼                  ▼                 ▼
         ┌───────────────────┐  ┌──────────────┐  ┌──────────┐
         │ Update IDE Store │  │ Update Yjs   │  │ Send to  │
         │ (Local state)     │  │ Document     │  │ Server   │
         └───────────────────┘  └──────┬───────┘  └────┬─────┘
                                       │               │
                                       ▼               ▼
                              ┌─────────────────────────────┐
                              │   Y.Doc.transact()          │
                              │   • Calculate diff          │
                              │   • Apply locally           │
                              │   • Encode update           │
                              └──────────┬──────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────────────┐
                              │   WebSocket.send()          │
                              │   { type: 'update',         │
                              │     data: [encoded] }       │
                              └──────────┬──────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────────────┐
                              │   Server broadcasts         │
                              │   to all other clients      │
                              └──────────┬──────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────────────┐
                              │   Other clients apply       │
                              │   update to their Y.Doc     │
                              └──────────┬──────────────────┘
                                         │
                                         ▼
                              ┌─────────────────────────────┐
                              │   UI updates automatically  │
                              │   (React state sync)        │
                              └─────────────────────────────┘
```

---

## Data Flow

### Document Synchronization

```
┌──────────────┐
│  Client A    │
│  Y.Doc       │
│  "Hello"     │
└──────┬───────┘
       │
       │ User types " World"
       │
       ▼
┌──────────────┐
│  Client A    │
│  Y.Doc       │
│  "Hello      │
│   World"     │
└──────┬───────┘
       │
       │ Encode diff: [insert " World" at pos 5]
       │
       ▼
┌──────────────────────────────────────┐
│           WebSocket                  │
│  { type: 'update',                   │
│    data: [5, 32, 87, 111, 114...] }  │
└──────┬───────────────────────────────┘
       │
       │ Broadcast
       │
       ▼
┌──────────────┐
│  Client B    │
│  Y.Doc       │
│  "Hello"     │
└──────┬───────┘
       │
       │ Apply update
       │
       ▼
┌──────────────┐
│  Client B    │
│  Y.Doc       │
│  "Hello      │
│   World"     │
└──────────────┘
```

---

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend State                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  IDE Store (Zustand)                                    │
│  ├─ tabs[]                                              │
│  ├─ activeTab                                           │
│  └─ files[]                                             │
│                                                         │
│  Yjs State (useYjsCollaboration)                        │
│  ├─ doc: Y.Doc                                          │
│  ├─ connected: boolean                                  │
│  ├─ users: CollaborationUser[]                          │
│  └─ text: string                                        │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend State                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  YjsCollaborationServer                                 │
│  └─ documents: Map<string, YjsDocument>                 │
│      └─ YjsDocument                                     │
│          ├─ doc: Y.Doc                                  │
│          ├─ connections: Set<WebSocket>                 │
│          └─ lastAccessed: number                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Lifecycle

### Document Lifecycle

```
1. First User Connects
   ├─ Create new Y.Doc
   ├─ Add to documents Map
   └─ Send initial state (empty)

2. More Users Join
   ├─ Get existing Y.Doc
   ├─ Add connection to Set
   └─ Send current state

3. Users Edit
   ├─ Receive updates
   ├─ Apply to Y.Doc
   └─ Broadcast to others

4. Users Disconnect
   ├─ Remove from connections Set
   └─ If last user:
       └─ Schedule cleanup (5 min)

5. Cleanup
   ├─ Check if still empty
   ├─ Check timeout (30 min)
   └─ Remove from Map
```

### Connection Lifecycle

```
1. Connect
   ├─ WebSocket handshake
   ├─ Parse query params (doc, userId)
   └─ Call handleConnection()

2. Active
   ├─ Receive messages
   ├─ Send updates
   └─ Track awareness

3. Disconnect
   ├─ Remove from connections
   ├─ Notify other users
   └─ Cleanup if needed
```

---

## Performance Optimization

### Efficient Updates

```
Traditional Approach:
  Send entire document (1MB)
  ↓
  Network: 1MB per update
  ↓
  Slow & expensive

Yjs Approach:
  Send only diff (1KB)
  ↓
  Network: 1KB per update
  ↓
  Fast & efficient
```

### Memory Management

```
Active Documents
  ├─ In-memory Y.Doc
  ├─ Active connections
  └─ Recent updates

Inactive Documents (5 min)
  ├─ Keep in memory
  └─ Wait for reconnection

Old Documents (30 min)
  ├─ Remove from memory
  └─ Garbage collected
```

---

## Error Handling

```
┌─────────────────────────────────────────┐
│         Connection Error                │
├─────────────────────────────────────────┤
│                                         │
│  1. WebSocket fails                     │
│     ├─ Show offline indicator           │
│     ├─ Keep local changes               │
│     └─ Attempt reconnection             │
│                                         │
│  2. Reconnection                        │
│     ├─ Establish new connection         │
│     ├─ Request full sync                │
│     └─ Show online indicator            │
│                                         │
│  3. Sync conflicts                      │
│     ├─ CRDT resolves automatically      │
│     └─ No user intervention needed      │
│                                         │
└─────────────────────────────────────────┘
```

---

## Security Layers (Future)

```
┌─────────────────────────────────────────┐
│         Security Stack                  │
├─────────────────────────────────────────┤
│                                         │
│  1. Authentication                      │
│     └─ JWT token validation             │
│                                         │
│  2. Authorization                       │
│     └─ Document access control          │
│                                         │
│  3. Rate Limiting                       │
│     └─ Per-user connection limits       │
│                                         │
│  4. Encryption                          │
│     └─ End-to-end for sensitive docs    │
│                                         │
│  5. Audit Logging                       │
│     └─ Track all document access        │
│                                         │
└─────────────────────────────────────────┘
```

---

**Status**: ✅ Production Ready  
**Last Updated**: December 2024
