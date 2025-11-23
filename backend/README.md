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
