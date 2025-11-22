# Sui Studio IDE - Complete Setup Guide

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Google OAuth credentials

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

## 🔐 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

### Step 2: Create OAuth Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - Your production domain
6. Copy the **Client ID**

### Step 3: Configure Environment

Edit `.env.local`:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

## 📦 Features Implemented

### ✅ Authentication
- [x] Google OAuth integration
- [x] Email/Password authentication (mock)
- [x] Persistent sessions (localStorage)
- [x] Protected routes
- [x] User profile display

### ✅ IDE Core
- [x] Monaco Editor with syntax highlighting
- [x] File explorer with tree navigation
- [x] Multi-tab support
- [x] Integrated terminal
- [x] Keyboard shortcuts

### ✅ Sui Integration
- [x] Gas estimation
- [x] Contract compilation (simulated)
- [x] Deployment panel
- [x] Network selection (Testnet/Devnet/Mainnet)
- [x] Transaction tracking

### ✅ Developer Tools
- [x] Gas Analyzer with optimization tips
- [x] Function-level cost breakdown
- [x] Real-time gas estimation
- [x] Deployment status tracking

### ✅ UI/UX
- [x] Dark theme
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Success notifications

## 🎯 Usage Flow

### 1. Landing Page
- User visits `/`
- Sees marketing content
- Clicks "Start Building Free"

### 2. Authentication
- Auth modal appears
- User signs in with Google or email
- Session is saved

### 3. IDE Access
- User is redirected to `/ide`
- Welcome screen shows project templates
- User selects a template

### 4. Development
- Files load in explorer
- Click file to open in editor
- Edit code with Monaco Editor
- View gas estimates in real-time

### 5. Deployment
- Open right panel (Deployment)
- Select network (Testnet/Devnet/Mainnet)
- Click "Deploy"
- View deployment status and transaction

## 🛠️ Development

### Project Structure

```
sui-studio/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   │   ├── AuthModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── ide/               # IDE components
│   │       ├── CodeEditor.tsx
│   │       ├── FileExplorer.tsx
│   │       ├── Terminal.tsx
│   │       ├── DeploymentPanel.tsx
│   │       ├── GasAnalyzer.tsx
│   │       └── ...
│   ├── services/
│   │   └── suiService.ts      # Sui blockchain integration
│   ├── store/
│   │   ├── authStore.ts       # Auth state management
│   │   └── ideStore.ts        # IDE state management
│   └── types/
│       ├── auth.ts
│       └── ide.ts
├── components/                 # Landing page components
└── .env.local                 # Environment variables
```

### Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Monaco Editor** - Code editor
- **Zustand** - State management
- **@react-oauth/google** - Google authentication
- **React Router** - Navigation
- **Tailwind CSS** - Styling

## 🔧 Configuration

### Environment Variables

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Sui Network
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# API (for future backend)
VITE_API_URL=http://localhost:3001
```

### Tailwind Configuration

Custom colors are defined in `index.html`:

```javascript
colors: {
  'dark-bg': '#0B0F14',
  'dark-surface': '#151B23',
  'dark-border': '#1F2937',
  'sui-cyan': '#3CB9FF',
  'sui-blue': '#4DA2FF',
}
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
npx tsc --noEmit     # Check TypeScript errors
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
# Add in Netlify dashboard
```

### Environment Variables for Production

Don't forget to set these in your hosting platform:

- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SUI_NETWORK`
- `VITE_SUI_RPC_URL`

## 🔒 Security Notes

### Google OAuth
- Never commit `.env.local` to git
- Use different OAuth credentials for dev/prod
- Restrict authorized domains in production

### API Keys
- Store sensitive keys in environment variables
- Use backend proxy for API calls in production
- Implement rate limiting

## 🐛 Troubleshooting

### Google OAuth Not Working

**Problem**: "Invalid client ID" error

**Solution**:
1. Check `.env.local` has correct client ID
2. Verify authorized origins in Google Console
3. Restart dev server after changing `.env.local`

### Monaco Editor Not Loading

**Problem**: Editor shows blank screen

**Solution**:
1. Check browser console for errors
2. Verify CDN is accessible
3. Clear browser cache

### Styles Not Applying

**Problem**: Components look unstyled

**Solution**:
1. Check Tailwind CDN is loaded in `index.html`
2. Verify custom colors are defined
3. Hard refresh browser (Ctrl+Shift+R)

## 📚 Next Steps

### Backend Integration
- Set up Express/Fastify backend
- Implement real Sui SDK integration
- Add database for user projects
- Implement file persistence

### Advanced Features
- Real-time collaboration
- Git integration
- Extension marketplace
- Advanced debugging
- Test runner

### Production Readiness
- Add error tracking (Sentry)
- Implement analytics
- Add monitoring
- Set up CI/CD
- Add E2E tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- GitHub Issues: Report bugs
- Documentation: Check docs folder
- Community: Join Discord

---

**Built with ❤️ for the Sui ecosystem**
