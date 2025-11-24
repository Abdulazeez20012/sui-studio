# Quick Reference Card

## 🚀 Start Development

```bash
# Backend
cd backend
npm run setup      # First time only
npm run seed       # Seed extensions
npm run dev        # Start server (port 3001)

# Frontend
npm run dev        # Start dev server (port 3000)
```

---

## 📡 API Endpoints

### Analytics
```typescript
GET    /api/analytics/user              // User stats
GET    /api/analytics/project/:id       // Project stats
POST   /api/analytics/track             // Track event
```

### AI (Nexi)
```typescript
POST   /api/ai/chat                     // Send message
GET    /api/ai/conversations            // List chats
GET    /api/ai/conversations/:id        // Get chat
DELETE /api/ai/conversations/:id        // Delete chat
```

### Extensions
```typescript
GET    /api/extensions/installed        // User's extensions
POST   /api/extensions/install          // Install
DELETE /api/extensions/uninstall/:id    // Uninstall
PATCH  /api/extensions/toggle/:id       // Enable/disable
```

---

## 💻 Frontend Services

### Analytics
```typescript
import { analyticsService } from './services/analyticsService';

// Get data
await analyticsService.getUserAnalytics();
await analyticsService.getProjectAnalytics(projectId);

// Track events
analyticsService.trackFileOpen('main.move', 'move');
analyticsService.trackCodeCompile(true, 1500);
analyticsService.trackDeployment('testnet', true);
analyticsService.trackExtensionInstall(id, name);
analyticsService.trackAIQuery(query, 2000);
```

### AI
```typescript
import { aiService } from './services/aiService';

// Send message
await aiService.sendMessage('Help me', { code, language, fileName });

// Helpers
await aiService.generateCode('NFT collection', 'move');
await aiService.explainCode(code, 'move');
await aiService.optimizeCode(code, 'move');
await aiService.debugError(error, code);
await aiService.suggestImprovements(code, 'move');

// Conversations
await aiService.getConversations();
await aiService.loadConversation(id);
await aiService.deleteConversation(id);
aiService.startNewConversation();
```

### API
```typescript
import { apiService } from './services/apiService';

// Compile
await apiService.compileCode(code, packageName);
await apiService.estimateGas(code);

// Deploy
await apiService.deployContract({ projectId, network, bytecode });
await apiService.getDeployment(id);

// Extensions
await apiService.getInstalledExtensions();
await apiService.installExtension(id);
await apiService.uninstallExtension(id);
```

---

## 🗄️ Database Models

```prisma
User              // Users with Google auth
Project           // User projects
Deployment        // Deployment history
CompilationCache  // Compiled code cache
Extension         // Available extensions
UserExtension     // User's installed extensions
AIConversation    // AI chat conversations
AIMessage         // Individual messages
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/sui_studio"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
SUI_NETWORK="testnet"
PORT=3001
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:3001
VITE_SUI_NETWORK=testnet
```

---

## 🎯 Common Tasks

### Track Build
```typescript
const startTime = Date.now();
const result = await apiService.compileCode(code);
analyticsService.trackCodeCompile(result.success, Date.now() - startTime);
```

### Send AI Message with Context
```typescript
const response = await aiService.sendMessage(input, {
  code: currentTab?.content,
  language: 'move',
  fileName: currentTab?.name
});
```

### Install Extension
```typescript
await apiService.installExtension(extensionId);
analyticsService.trackExtensionInstall(extensionId, extensionName);
```

---

## 🔧 Useful Commands

```bash
# Backend
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run migrations
npm run prisma:studio      # Open Prisma Studio
npm run seed               # Seed database

# Database
psql -U postgres           # Connect to PostgreSQL
\l                         # List databases
\c sui_studio              # Connect to database
\dt                        # List tables
```

---

## 📊 Response Formats

### User Analytics
```json
{
  "projects": 5,
  "deployments": { "total": 12, "successful": 10, "successRate": 83 },
  "gas": { "totalUsed": 1200000, "averagePerDeployment": 100000 },
  "compilations": { "last30Days": 45 },
  "activity": { "2024-01-15": 3, "2024-01-16": 5 }
}
```

### AI Response
```json
{
  "conversationId": "clx123...",
  "message": {
    "id": "clx456...",
    "role": "assistant",
    "content": "Here's how to create an NFT...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 🐛 Debugging

### Check Backend Health
```bash
curl http://localhost:3001/health
```

### Test with Auth
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/analytics/user
```

### View Logs
```bash
# Backend logs
cd backend && npm run dev

# Check database
npm run prisma:studio
```

---

## 📁 File Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── analytics.ts    ✨ NEW
│   │   ├── ai.ts          ✨ NEW
│   │   ├── extensions.ts  ✨ NEW
│   │   ├── compile.ts
│   │   ├── deploy.ts
│   │   └── sui.ts
│   └── index.ts           ✨ UPDATED
├── prisma/
│   └── schema.prisma      ✨ UPDATED
├── setup.sh               ✨ NEW
└── seed.ts                ✨ NEW

src/
└── services/
    ├── analyticsService.ts  ✨ NEW
    ├── aiService.ts         ✨ NEW
    └── apiService.ts        ✨ UPDATED
```

---

## ⚡ Performance Tips

1. **Caching**: Analytics cached for 5 minutes
2. **Indexing**: Database indexes on frequently queried fields
3. **Pagination**: Use `take` parameter for large lists
4. **Rate Limiting**: 100 requests per 15 minutes
5. **Compilation Cache**: 24 hours for successful builds

---

## 🔒 Security Notes

- All endpoints require JWT authentication
- Tokens stored in localStorage
- CORS configured for frontend URL
- Input validation with Zod
- SQL injection protection via Prisma
- Rate limiting enabled

---

## 📞 Support

- **Documentation**: See BACKEND_INTEGRATION.md
- **Examples**: See INTEGRATION_EXAMPLES.md
- **Issues**: Check console logs and network tab
- **Database**: Use Prisma Studio for inspection

---

*Quick reference for Sui Studio backend integration*
