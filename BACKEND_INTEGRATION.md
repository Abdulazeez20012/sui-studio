# Backend Integration Guide

## Overview
Complete backend integration for Sui Studio IDE with enhanced APIs, analytics, AI services, and extension management.

---

## 🚀 New Backend APIs

### 1. Analytics API (`/api/analytics`)

#### Get User Analytics
```typescript
GET /api/analytics/user
Authorization: Bearer <token>

Response:
{
  projects: number,
  deployments: {
    total: number,
    successful: number,
    failed: number,
    successRate: number
  },
  gas: {
    totalUsed: number,
    averagePerDeployment: number
  },
  compilations: {
    last30Days: number
  },
  activity: Record<string, number>
}
```

#### Get Project Analytics
```typescript
GET /api/analytics/project/:projectId
Authorization: Bearer <token>

Response:
{
  project: { id, name, createdAt },
  deployments: { total, successful, failed, successRate },
  gas: { total, average },
  networks: Record<string, number>,
  recentDeployments: Deployment[]
}
```

#### Track Event
```typescript
POST /api/analytics/track
Authorization: Bearer <token>
Body: {
  event: string,
  metadata?: any
}
```

---

### 2. AI API (`/api/ai`)

#### Send Message to Nexi AI
```typescript
POST /api/ai/chat
Authorization: Bearer <token>
Body: {
  message: string,
  conversationId?: string,
  context?: {
    code?: string,
    language?: string,
    fileName?: string
  }
}

Response:
{
  conversationId: string,
  message: {
    id: string,
    role: 'assistant',
    content: string,
    createdAt: Date
  }
}
```

#### Get Conversations
```typescript
GET /api/ai/conversations
Authorization: Bearer <token>

Response:
{
  conversations: AIConversation[]
}
```

#### Get Conversation Messages
```typescript
GET /api/ai/conversations/:id
Authorization: Bearer <token>

Response:
{
  conversation: {
    id: string,
    title: string,
    messages: AIMessage[],
    createdAt: Date,
    updatedAt: Date
  }
}
```

#### Delete Conversation
```typescript
DELETE /api/ai/conversations/:id
Authorization: Bearer <token>
```

---

### 3. Extensions API (`/api/extensions`)

#### Get Installed Extensions
```typescript
GET /api/extensions/installed
Authorization: Bearer <token>

Response:
{
  extensions: UserExtension[]
}
```

#### Install Extension
```typescript
POST /api/extensions/install
Authorization: Bearer <token>
Body: {
  extensionId: string
}

Response:
{
  message: string,
  extension: UserExtension
}
```

#### Uninstall Extension
```typescript
DELETE /api/extensions/uninstall/:extensionId
Authorization: Bearer <token>
```

#### Toggle Extension
```typescript
PATCH /api/extensions/toggle/:extensionId
Authorization: Bearer <token>
Body: {
  enabled: boolean
}
```

---

## 📊 Database Schema Updates

### New Models

#### Extension
```prisma
model Extension {
  id            String    @id @default(cuid())
  name          String
  publisher     String
  description   String
  version       String
  category      String
  icon          String
  marketplaceUrl String
  featured      Boolean   @default(false)
  downloads     Int       @default(0)
  rating        Float     @default(0.0)
  
  userExtensions UserExtension[]
}
```

#### UserExtension
```prisma
model UserExtension {
  id            String    @id @default(cuid())
  userId        String
  extensionId   String
  extension     Extension @relation(...)
  enabled       Boolean   @default(true)
  installedAt   DateTime  @default(now())
  
  @@unique([userId, extensionId])
}
```

#### AIConversation
```prisma
model AIConversation {
  id            String    @id @default(cuid())
  userId        String
  title         String
  messages      AIMessage[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

#### AIMessage
```prisma
model AIMessage {
  id              String    @id @default(cuid())
  conversationId  String
  conversation    AIConversation @relation(...)
  role            String    // user, assistant
  content         String    @db.Text
  context         String?   @db.Text
  createdAt       DateTime  @default(now())
}
```

---

## 🔧 Frontend Services

### Analytics Service

```typescript
import { analyticsService } from './services/analyticsService';

// Get user analytics
const analytics = await analyticsService.getUserAnalytics();

// Get project analytics
const projectAnalytics = await analyticsService.getProjectAnalytics(projectId);

// Track events
analyticsService.trackFileOpen('main.move', 'move');
analyticsService.trackCodeCompile(true, 1500);
analyticsService.trackDeployment('testnet', true);
analyticsService.trackExtensionInstall('core-analyzer', 'Core Analyzer');
analyticsService.trackAIQuery('How to create NFT?', 2000);
```

### AI Service

```typescript
import { aiService } from './services/aiService';

// Send message
const response = await aiService.sendMessage('Help me create an NFT', {
  code: currentCode,
  language: 'move',
  fileName: 'nft.move'
});

// Helper methods
await aiService.generateCode('NFT collection with minting', 'move');
await aiService.explainCode(code, 'move');
await aiService.optimizeCode(code, 'move');
await aiService.debugError(errorMessage, code);
await aiService.suggestImprovements(code, 'move');

// Conversation management
const conversations = await aiService.getConversations();
await aiService.loadConversation(conversationId);
await aiService.deleteConversation(conversationId);
aiService.startNewConversation();
```

### API Service (Enhanced)

```typescript
import { apiService } from './services/apiService';

// Analytics
await apiService.getUserAnalytics();
await apiService.getProjectAnalytics(projectId);
await apiService.trackEvent('custom_event', { data: 'value' });

// AI
await apiService.sendAIMessage(message, conversationId, context);
await apiService.getAIConversations();
await apiService.getAIConversation(id);
await apiService.deleteAIConversation(id);

// Extensions
await apiService.getInstalledExtensions();
await apiService.installExtension(extensionId);
await apiService.uninstallExtension(extensionId);
await apiService.toggleExtension(extensionId, enabled);
```

---

## 🔐 Authentication

All API endpoints require authentication via JWT token:

```typescript
Authorization: Bearer <token>
```

Token is automatically included by `apiService.getHeaders()` method.

---

## 🚦 Setup Instructions

### 1. Database Migration

```bash
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 2. Environment Variables

Update `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/sui_studio"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
SUI_NETWORK="testnet"
PORT=3001
```

### 3. Start Backend

```bash
cd backend
npm run dev
```

### 4. Frontend Configuration

Update `.env.local`:

```env
VITE_API_URL=http://localhost:3001
VITE_SUI_NETWORK=testnet
```

---

## 📈 Usage Examples

### Track User Activity

```typescript
// In Toolbar.tsx
const handleBuild = async () => {
  const startTime = Date.now();
  setIsBuilding(true);
  
  try {
    const result = await apiService.compileCode(code);
    const duration = Date.now() - startTime;
    
    // Track compilation
    analyticsService.trackCodeCompile(result.success, duration);
    
    if (result.success) {
      setBuildStatus('success');
    }
  } catch (error) {
    analyticsService.trackCodeCompile(false, Date.now() - startTime);
    setBuildStatus('error');
  }
};
```

### Integrate AI Assistant

```typescript
// In NexiAI.tsx
const handleSend = async () => {
  const userMessage = { id: Date.now().toString(), role: 'user', content: input };
  setMessages(prev => [...prev, userMessage]);
  
  setIsLoading(true);
  const startTime = Date.now();
  
  try {
    const response = await aiService.sendMessage(input, {
      code: currentCode,
      language: 'move',
      fileName: currentFile
    });
    
    if (response) {
      setMessages(prev => [...prev, response]);
      analyticsService.trackAIQuery(input, Date.now() - startTime);
    }
  } finally {
    setIsLoading(false);
  }
};
```

### Manage Extensions

```typescript
// In ExtensionsMarketplace.tsx
const handleInstall = async (extensionId: string, extensionName: string) => {
  try {
    await apiService.installExtension(extensionId);
    setInstalledExtensions(prev => new Set([...prev, extensionId]));
    
    // Track installation
    analyticsService.trackExtensionInstall(extensionId, extensionName);
  } catch (error) {
    console.error('Failed to install extension:', error);
  }
};
```

---

## 🔄 Data Flow

```
Frontend Component
    ↓
Service Layer (analyticsService, aiService)
    ↓
API Service (apiService)
    ↓
Backend API Routes
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

---

## 🎯 Benefits

1. **Analytics**: Track user behavior and system performance
2. **AI Integration**: Persistent conversation history
3. **Extension Management**: Track installations and usage
4. **Caching**: Reduce API calls with intelligent caching
5. **Error Handling**: Comprehensive error tracking
6. **Type Safety**: Full TypeScript support
7. **Scalability**: Ready for production deployment

---

## 🔮 Future Enhancements

1. **Real-time Analytics**: WebSocket-based live updates
2. **AI Model Integration**: Connect to OpenAI/Anthropic APIs
3. **Extension Marketplace**: Public extension repository
4. **Collaboration**: Real-time code sharing (already implemented)
5. **Cloud Storage**: Sync projects across devices
6. **Performance Monitoring**: APM integration

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Rate limiting: 100 requests per 15 minutes per IP
- Cache duration: 5 minutes for analytics data
- AI conversations are persisted in database
- Extension downloads are tracked automatically

---

*Backend integration complete and ready for production deployment.*
