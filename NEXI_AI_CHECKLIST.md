# ✅ NEXI AI Setup Checklist

## Pre-Setup

- [ ] Node.js installed (v18+)
- [ ] Backend code downloaded
- [ ] Terminal access

## Installation (5 minutes)

### Step 1: Install OpenAI SDK
```bash
cd backend
npm install openai
```
- [ ] Command runs successfully
- [ ] `openai` appears in `package.json`

### Step 2: Get OpenAI API Key
1. [ ] Visit https://platform.openai.com/api-keys
2. [ ] Sign up or log in
3. [ ] Click "Create new secret key"
4. [ ] Copy key (starts with `sk-`)
5. [ ] Save key somewhere safe

### Step 3: Configure Backend
```bash
# Edit backend/.env.local
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```
- [ ] File edited
- [ ] API key added
- [ ] No extra spaces
- [ ] File saved

### Step 4: Start Backend
```bash
cd backend
npm run dev
```
- [ ] Server starts on port 3001
- [ ] No errors in console
- [ ] "OpenAI client initialized" (optional log)

## Testing (2 minutes)

### Test 1: Backend Health
```bash
curl http://localhost:3001/health
```
- [ ] Returns 200 OK

### Test 2: NEXI AI (with auth)
1. [ ] Open IDE in browser
2. [ ] Log in or sign up
3. [ ] Click "NEXI AI" panel
4. [ ] Type: "What can you help me with?"
5. [ ] Get intelligent response (not error)

### Test 3: Code Context
1. [ ] Open a `.move` file
2. [ ] Select some code
3. [ ] Ask NEXI AI: "Explain this code"
4. [ ] Get code-specific response

### Test 4: Conversation Memory
1. [ ] Ask: "Create an NFT contract"
2. [ ] Then ask: "Add a transfer function"
3. [ ] Verify it remembers the NFT context

## Verification

### Frontend
- [ ] No console errors
- [ ] NEXI AI panel loads
- [ ] Can send messages
- [ ] Gets responses
- [ ] Shows typing indicator
- [ ] Displays formatted code blocks

### Backend
- [ ] Server running
- [ ] No errors in logs
- [ ] Database connected
- [ ] OpenAI API responding
- [ ] Conversations saved

### OpenAI
- [ ] API key valid
- [ ] Quota available
- [ ] Responses under 30s
- [ ] Token usage reasonable

## Troubleshooting

### ❌ "AI service not configured"
**Fix:**
```bash
# Check backend/.env.local has:
OPENAI_API_KEY=sk-...
```
- [ ] API key present
- [ ] No typos
- [ ] Backend restarted

### ❌ "Invalid API key"
**Fix:**
1. [ ] Get new key from OpenAI
2. [ ] Update `.env.local`
3. [ ] Restart backend

### ❌ "Quota exceeded"
**Fix:**
1. [ ] Add credits at platform.openai.com
2. [ ] Or switch to GPT-3.5:
```bash
OPENAI_MODEL=gpt-3.5-turbo
```

### ❌ "Backend not responding"
**Fix:**
1. [ ] Check backend is running
2. [ ] Check port 3001 not in use
3. [ ] Check firewall settings
4. [ ] Check CORS configuration

### ❌ Slow responses
**Fix:**
1. [ ] Switch to GPT-3.5 (faster)
2. [ ] Reduce max_tokens
3. [ ] Check internet connection
4. [ ] Check OpenAI status

## Optional Enhancements

### Use GPT-3.5 (Faster/Cheaper)
```bash
OPENAI_MODEL=gpt-3.5-turbo
```
- [ ] Updated in `.env.local`
- [ ] Backend restarted
- [ ] Tested

### Increase Token Limit
```bash
OPENAI_MAX_TOKENS=4000
```
- [ ] Updated in `.env.local`
- [ ] Backend restarted
- [ ] Tested with long responses

### Add Rate Limiting
```typescript
// In backend/src/routes/ai.ts
import rateLimit from 'express-rate-limit';

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // 50 requests per window
});

router.use(aiLimiter);
```
- [ ] Code added
- [ ] Tested

## Production Deployment

### Environment Variables
- [ ] `OPENAI_API_KEY` set in production
- [ ] `OPENAI_MODEL` configured
- [ ] `DATABASE_URL` set
- [ ] `JWT_SECRET` set
- [ ] `FRONTEND_URL` set

### Security
- [ ] API key not in code
- [ ] Rate limiting enabled
- [ ] Authentication required
- [ ] CORS configured
- [ ] HTTPS enabled

### Monitoring
- [ ] Track token usage
- [ ] Monitor API costs
- [ ] Log errors
- [ ] Track response times
- [ ] Set up alerts

## Cost Management

### Daily Budget
- [ ] Set OpenAI usage limits
- [ ] Monitor daily spend
- [ ] Set up billing alerts

### Optimization
- [ ] Use GPT-3.5 for simple queries
- [ ] Limit conversation history
- [ ] Set reasonable max_tokens
- [ ] Cache common responses (optional)

## Documentation

### Read These Guides
- [ ] `NEXI_AI_REAL_IMPLEMENTATION.md` - Technical details
- [ ] `NEXI_AI_QUICK_START.md` - Quick setup
- [ ] `SETUP_NEXI_AI.md` - 2-minute guide
- [ ] `REAL_AI_VISUAL_GUIDE.md` - Visual guide

### Share With Team
- [ ] Setup instructions
- [ ] API key access
- [ ] Cost estimates
- [ ] Best practices

## Success Criteria

### ✅ All Green
- [ ] Backend starts without errors
- [ ] NEXI AI responds intelligently
- [ ] Conversation history works
- [ ] Code context works
- [ ] No fake responses
- [ ] Clear error messages
- [ ] Token usage reasonable
- [ ] Response time acceptable

## Next Steps

After setup:
1. [ ] Test with real Sui Move questions
2. [ ] Try code generation
3. [ ] Test debugging help
4. [ ] Share with team
5. [ ] Monitor usage and costs

## Support

### Need Help?
- **Documentation**: See `NEXI_AI_REAL_IMPLEMENTATION.md`
- **Quick Start**: See `NEXI_AI_QUICK_START.md`
- **Visual Guide**: See `REAL_AI_VISUAL_GUIDE.md`

### Common Issues
- **API Key**: https://platform.openai.com/api-keys
- **Pricing**: https://openai.com/pricing
- **Status**: https://status.openai.com/

---

**Ready?** Start with Step 1: `cd backend && npm install openai` 🚀
