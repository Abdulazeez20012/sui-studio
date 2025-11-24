# Sui Studio Backend

Production-ready backend API for Sui Studio IDE with real Sui blockchain integration.

## Features

- ✅ User authentication with JWT
- ✅ Project management (CRUD)
- ✅ Real Move code compilation
- ✅ Blockchain deployment
- ✅ Gas estimation
- ✅ Transaction tracking
- ✅ Compilation caching
- ✅ Rate limiting
- ✅ PostgreSQL database

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Sui CLI installed (`cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui`)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb sui_studio

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

### 3. Run Migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3001`

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sui_studio"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secret-key

# Sui Network
SUI_NETWORK=testnet
SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# CORS
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Compilation
- `POST /api/compile` - Compile Move code
- `POST /api/compile/estimate-gas` - Estimate gas

### Deployment
- `POST /api/deploy` - Deploy contract
- `GET /api/deploy/:id` - Get deployment status
- `GET /api/deploy/project/:projectId` - Get project deployments

### Sui Network
- `GET /api/sui/network/:network` - Get network info
- `GET /api/sui/transaction/:digest` - Get transaction
- `GET /api/sui/object/:objectId` - Get object
- `GET /api/sui/gas-price/:network` - Get gas price

## Database Schema

```prisma
User
├── id: String
├── email: String (unique)
├── name: String
├── picture: String?
├── googleId: String? (unique)
└── projects: Project[]

Project
├── id: String
├── name: String
├── description: String?
├── userId: String
├── files: Json
├── isPublic: Boolean
└── deployments: Deployment[]

Deployment
├── id: String
├── projectId: String
├── userId: String
├── network: String
├── packageId: String?
├── transactionDigest: String?
├── status: String
├── gasUsed: Int?
└── gasBudget: Int?
```

## Production Deployment

### Using Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add

# Deploy
railway up
```

### Using Render

1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && npm install && npx prisma generate`
4. Set start command: `cd backend && npm start`
5. Add PostgreSQL database
6. Set environment variables

### Using Docker

```bash
# Build image
docker build -t sui-studio-backend .

# Run container
docker run -p 3001:3001 --env-file .env sui-studio-backend
```

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run prisma:studio
```

## Testing

```bash
# Test compilation endpoint
curl -X POST http://localhost:3001/api/compile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"code": "module test::hello { }"}'

# Test health check
curl http://localhost:3001/health
```

## Troubleshooting

### Sui CLI not found
```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui

# Verify installation
sui --version
```

### Database connection error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
DATABASE_URL="postgresql://user:password@localhost:5432/sui_studio"
```

### Compilation timeout
- Increase timeout in compile.ts
- Check Sui CLI is working: `sui move build --help`

## Security

- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 minutes
- CORS restricted to frontend URL
- SQL injection protected by Prisma
- Input validation with Zod

## License

MIT


---

## 🆕 New Features (Backend Integration)

### Analytics System ✨
Track user activity, deployments, and gas usage with comprehensive analytics.

**Endpoints:**
- `GET /api/analytics/user` - User statistics
- `GET /api/analytics/project/:projectId` - Project analytics
- `POST /api/analytics/track` - Track custom events

**Features:**
- Deployment success rates
- Gas usage tracking
- Activity timeline (7 days)
- Compilation statistics
- Network distribution

### AI Integration (Nexi) ✨
Persistent AI conversations with code context awareness.

**Endpoints:**
- `POST /api/ai/chat` - Send message to AI
- `GET /api/ai/conversations` - List conversations
- `GET /api/ai/conversations/:id` - Get conversation details
- `DELETE /api/ai/conversations/:id` - Delete conversation

**Features:**
- Context-aware responses (includes code, language, filename)
- Persistent conversation history
- Code generation and optimization
- Debugging assistance
- Sui ecosystem expertise

### Extension Management ✨
Track and manage user-installed extensions.

**Endpoints:**
- `GET /api/extensions/installed` - Get user's extensions
- `POST /api/extensions/install` - Install extension
- `DELETE /api/extensions/uninstall/:extensionId` - Uninstall
- `PATCH /api/extensions/toggle/:extensionId` - Enable/disable

**Features:**
- Installation tracking
- Download counting
- Enable/disable without uninstalling
- User-specific extension lists

---

## 📊 Updated Database Schema

### New Models

```prisma
Extension
├── id: String
├── name: String
├── publisher: String
├── description: String
├── version: String
├── category: String
├── icon: String
├── marketplaceUrl: String
├── featured: Boolean
├── downloads: Int
└── rating: Float

UserExtension
├── id: String
├── userId: String
├── extensionId: String
├── enabled: Boolean
└── installedAt: DateTime

AIConversation
├── id: String
├── userId: String
├── title: String
└── messages: AIMessage[]

AIMessage
├── id: String
├── conversationId: String
├── role: String (user/assistant)
├── content: Text
├── context: Text?
└── createdAt: DateTime
```

---

## 🚀 Quick Start (Updated)

### Automated Setup
```bash
npm run setup      # Install deps, generate Prisma, run migrations
npm run seed       # Seed extensions data
npm run dev        # Start development server
```

### Manual Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

---

## 📚 Additional Documentation

- **BACKEND_INTEGRATION.md** - Complete API reference
- **INTEGRATION_EXAMPLES.md** - Real-world usage examples
- **QUICK_REFERENCE.md** - Quick command reference
- **BACKEND_INTEGRATION_SUMMARY.md** - Feature summary

---

## 🔄 Migration from Old Version

If upgrading from previous version:

```bash
# Pull latest changes
git pull

# Install new dependencies
npm install

# Run new migrations
npx prisma migrate dev

# Seed extensions
npm run seed

# Restart server
npm run dev
```

---

## 📈 Performance Optimizations

- **Compilation Caching**: 24 hours for successful builds
- **Database Indexing**: Optimized queries on frequently accessed fields
- **Frontend Caching**: 5-minute cache for analytics
- **Rate Limiting**: Configurable per-IP limits

---

## 🎯 Usage Examples

### Track Code Compilation
```typescript
// Frontend
const result = await apiService.compileCode(code);
analyticsService.trackCodeCompile(result.success, duration);
```

### Send AI Message with Context
```typescript
const response = await aiService.sendMessage('Help me', {
  code: currentCode,
  language: 'move',
  fileName: 'main.move'
});
```

### Install Extension
```typescript
await apiService.installExtension('core-analyzer');
analyticsService.trackExtensionInstall('core-analyzer', 'Core Analyzer');
```

---

**Backend now includes comprehensive analytics, AI integration, and extension management!** 🎉
