# Real-Time Collaboration Guide

## Overview

Sui Studio IDE now supports real-time collaboration, allowing multiple developers to work on the same project simultaneously with live cursor tracking, synchronized edits, and presence awareness.

## Features

### ✅ Real-Time Editing
- **Synchronized Code Changes** - See edits from other users instantly
- **Operational Transformation** - Conflict-free collaborative editing
- **Version Control** - Automatic version tracking and sync

### ✅ Presence Awareness
- **Active Users List** - See who's online in your project
- **Cursor Tracking** - View other users' cursor positions in real-time
- **Selection Highlighting** - See what code others are selecting
- **User Colors** - Each user gets a unique color for identification

### ✅ Connection Management
- **Auto-Reconnect** - Automatically reconnects if connection drops
- **Connection Status** - Visual indicator of connection state
- **Graceful Degradation** - Works offline, syncs when reconnected

## How It Works

### Architecture

```
Frontend (React)
    ↓
WebSocket Connection
    ↓
Collaboration Server (Node.js)
    ↓
Project Rooms (In-Memory)
```

### Message Flow

1. **User Joins**
   ```typescript
   Client → Server: { type: 'join', projectId: '...' }
   Server → Client: { type: 'init', documentState, version, clients }
   Server → Others: { type: 'user-joined', userId, userName }
   ```

2. **User Edits**
   ```typescript
   Client → Server: { type: 'edit', changes: [...], version }
   Server → Others: { type: 'edit', changes, version, userId }
   ```

3. **Cursor Movement**
   ```typescript
   Client → Server: { type: 'cursor', position: { line, column } }
   Server → Others: { type: 'cursor', userId, position }
   ```

## Usage

### Enable Collaboration

1. Open a project in the IDE
2. Click the collaboration icon in the toolbar
3. The collaboration panel opens showing active users
4. Share the project URL with team members

### Collaborative Editing

```typescript
// In your component
import { useCollaboration } from '../hooks/useCollaboration';

const MyEditor = () => {
  const { isConnected, activeUsers, sendEdit, sendCursor } = useCollaboration({
    projectId: 'project-123',
    enabled: true,
    onRemoteEdit: (changes) => {
      // Apply remote changes to editor
      applyChanges(changes);
    },
  });

  // Send local edits
  const handleEdit = (changes) => {
    sendEdit(changes);
  };

  // Send cursor position
  const handleCursorMove = (position) => {
    sendCursor(position);
  };

  return (
    <div>
      <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
      <div>Active Users: {activeUsers.length}</div>
    </div>
  );
};
```

## API Reference

### Backend WebSocket API

#### Connect
```
ws://localhost:3001/ws?token=JWT_TOKEN
```

#### Messages

**Join Project**
```json
{
  "type": "join",
  "projectId": "project-123"
}
```

**Send Edit**
```json
{
  "type": "edit",
  "changes": [
    { "type": "insert", "offset": 10, "text": "hello" },
    { "type": "delete", "offset": 20, "length": 5 }
  ],
  "version": 42
}
```

**Send Cursor**
```json
{
  "type": "cursor",
  "position": { "line": 10, "column": 5 }
}
```

**Send Selection**
```json
{
  "type": "selection",
  "selection": {
    "start": { "line": 10, "column": 0 },
    "end": { "line": 15, "column": 10 }
  }
}
```

### Frontend Service API

```typescript
import { collaborationService } from './services/collaborationService';

// Connect to project
collaborationService.connect(projectId, authToken);

// Send edit
collaborationService.sendEdit(changes, version);

// Send cursor
collaborationService.sendCursor({ line: 10, column: 5 });

// Send selection
collaborationService.sendSelection({ start, end });

// Listen for events
collaborationService.on('edit', (message) => {
  console.log('Remote edit:', message);
});

// Disconnect
collaborationService.disconnect();
```

## Conflict Resolution

### Operational Transformation (OT)

The system uses a simple OT algorithm to handle concurrent edits:

1. **Version Tracking** - Each edit increments the document version
2. **Change Ordering** - Changes are sorted by offset (reverse order)
3. **Conflict Detection** - If versions don't match, sync is required
4. **Automatic Sync** - Client requests current state if out of sync

### Example

```typescript
// User A and User B both at version 10
// User A inserts "hello" at position 5
// User B deletes 3 chars at position 10

// Server receives A's change first:
// - Apply change, version becomes 11
// - Broadcast to B

// Server receives B's change:
// - Version mismatch (B sent v10, server is v11)
// - Request sync from B
// - B receives current state and retries
```

## Security

### Authentication
- WebSocket connections require JWT token
- Token validated on connection
- Invalid tokens are rejected immediately

### Authorization
- Users can only join projects they have access to
- Project ownership verified via database
- Unauthorized access attempts are logged

### Rate Limiting
- Maximum 100 messages per minute per user
- Prevents spam and abuse
- Automatic throttling

## Performance

### Optimization Strategies

1. **Message Batching**
   - Cursor updates throttled to 100ms
   - Edit changes batched when possible

2. **Selective Broadcasting**
   - Only send to users in same project room
   - Exclude sender from broadcasts

3. **Memory Management**
   - Empty rooms automatically cleaned up
   - Old cursor positions garbage collected

4. **Connection Pooling**
   - Reuse WebSocket connections
   - Automatic reconnection with backoff

## Monitoring

### Room Status Endpoint

```bash
GET /api/collaboration/room/:projectId

Response:
{
  "projectId": "project-123",
  "clientCount": 3,
  "version": 42,
  "clients": [
    { "userId": "user-1", "userName": "Alice" },
    { "userId": "user-2", "userName": "Bob" }
  ]
}
```

### Metrics to Track

- Active connections
- Messages per second
- Average latency
- Reconnection rate
- Error rate

## Troubleshooting

### Connection Issues

**Problem**: WebSocket won't connect

**Solutions**:
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify WebSocket port is open
3. Check firewall settings
4. Ensure JWT token is valid

### Sync Issues

**Problem**: Edits not syncing

**Solutions**:
1. Check connection status in UI
2. Look for version mismatch errors
3. Refresh page to force resync
4. Check browser console for errors

### Performance Issues

**Problem**: Lag when many users

**Solutions**:
1. Implement message batching
2. Increase server resources
3. Add Redis for scaling
4. Use WebSocket load balancer

## Scaling

### Horizontal Scaling

For production with many users:

1. **Use Redis for Pub/Sub**
   ```typescript
   // Replace in-memory rooms with Redis
   const redis = new Redis();
   redis.publish('room:project-123', message);
   ```

2. **Load Balancer**
   ```nginx
   upstream websocket {
     server backend1:3001;
     server backend2:3001;
     server backend3:3001;
   }
   ```

3. **Sticky Sessions**
   - Use IP hash or cookie-based routing
   - Ensures user stays on same server

### Vertical Scaling

- Increase Node.js memory: `--max-old-space-size=4096`
- Use clustering: `pm2 start app.js -i max`
- Optimize message serialization

## Future Enhancements

- [ ] Voice/Video chat integration
- [ ] Code review comments
- [ ] Shared terminal sessions
- [ ] Collaborative debugging
- [ ] Presence indicators in editor
- [ ] Conflict resolution UI
- [ ] Edit history and replay
- [ ] Offline mode with sync

## Best Practices

### For Users

1. **Save Frequently** - Auto-save is enabled but manual saves are good
2. **Communicate** - Use comments or chat when making big changes
3. **Check Active Users** - See who's online before major refactors
4. **Handle Conflicts** - If sync fails, refresh and try again

### For Developers

1. **Throttle Updates** - Don't send every keystroke
2. **Batch Changes** - Group related edits together
3. **Handle Disconnects** - Implement graceful degradation
4. **Test Offline** - Ensure app works without collaboration
5. **Monitor Performance** - Track latency and message rates

## License

MIT
