# 🚀 Developer Quick Reference

## Essential Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run test            # Run tests
npm run lint            # Check code quality

# Backend
cd backend
npm run dev             # Start backend
npm run seed            # Seed database
```

## New Utilities

### Logger
```typescript
import { logger } from '@/utils/logger';

logger.debug('Debug');  // Dev only
logger.info('Info');    // Dev only
logger.warn('Warning'); // Always
logger.error('Error');  // Always
```

### Icons
```typescript
import { Icon } from '@/utils/iconMapper';

<Icon name="bug" size={20} />
```

### Config
```typescript
import { config } from '@/config';

config.api.baseUrl
config.features.ai
config.sui.network
```

### Error Boundary
```typescript
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## File Structure

```
src/
├── components/     # React components
├── config/        # Configuration
├── hooks/         # Custom hooks
├── pages/         # Page components
├── services/      # API services
├── store/         # State management
├── utils/         # Utilities
└── App.tsx        # Main app
```

## Key Features

- ✅ Code Editor with Move syntax
- ✅ Real-time compilation
- ✅ Wallet integration
- ✅ AI Assistant
- ✅ Collaboration tools
- ✅ Subscription system

## Environment Variables

```env
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your-client-id
VITE_SUI_NETWORK=testnet
VITE_ENABLE_AI=true
```

## Common Tasks

### Add New Component
```typescript
// src/components/MyComponent.tsx
import React from 'react';

export const MyComponent: React.FC = () => {
  return <div>My Component</div>;
};
```

### Add New Service
```typescript
// src/services/myService.ts
import { apiService } from './apiService';
import { logger } from '@/utils/logger';

class MyService {
  async getData() {
    try {
      return await apiService.get('/endpoint');
    } catch (error) {
      logger.error('Failed:', error);
      return null;
    }
  }
}

export const myService = new MyService();
```

### Add New Hook
```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react';

export const useMyHook = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Logic here
  }, []);
  
  return { data };
};
```

## Troubleshooting

### Backend Not Connected
```bash
cd backend
npm run dev
```

### TypeScript Errors
```bash
npm run type-check
```

### Build Fails
```bash
rm -rf node_modules
npm install
npm run build
```

## Resources

- 📖 Full Docs: See all MD files
- 🐛 Issues: GitHub Issues
- 💬 Support: Discord/Email
- 🌐 Demo: https://demo.suistudio.dev

---

**Quick Start**: `npm install && npm run dev`  
**Status**: ✅ Production Ready
