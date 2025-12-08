# Claude AI Setup for Nexi AI

## Overview

Nexi AI now supports **Claude AI by Anthropic** as the AI provider. Claude offers excellent code understanding, longer context windows, and competitive pricing.

---

## ✅ Why Claude?

### Advantages
- **Longer Context**: Up to 200K tokens (vs GPT-4's 128K)
- **Better Code Understanding**: Excellent at understanding and generating code
- **Cost Effective**: Competitive pricing with high quality
- **Latest Model**: Claude 3.5 Sonnet (October 2024)
- **Reliable**: Consistent performance and availability

### Claude vs OpenAI

| Feature | Claude 3.5 Sonnet | GPT-4 Turbo |
|---------|-------------------|-------------|
| Context Window | 200K tokens | 128K tokens |
| Max Output | 8K tokens | 4K tokens |
| Code Quality | Excellent | Excellent |
| Speed | Fast | Fast |
| Cost (Input) | $3/1M tokens | $10/1M tokens |
| Cost (Output) | $15/1M tokens | $30/1M tokens |

---

## 🚀 Quick Setup

### 1. Get Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy your API key (starts with `sk-ant-`)

### 2. Configure Backend

Edit `backend/.env.local`:

```env
# AI Configuration
AI_PROVIDER=claude

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096
```

### 3. Restart Backend

```bash
cd backend
npm run dev
```

### 4. Test Nexi AI

Open the IDE and ask Nexi AI a question!

---

## 📋 Configuration Options

### Environment Variables

**Required:**
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Optional:**
```env
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_MAX_TOKENS=4096
```

### Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `claude-3-5-sonnet-20241022` | Latest, most capable | Production (Recommended) |
| `claude-3-5-sonnet-20240620` | Previous version | Stable alternative |
| `claude-3-opus-20240229` | Most powerful | Complex tasks |
| `claude-3-sonnet-20240229` | Balanced | General use |
| `claude-3-haiku-20240307` | Fastest, cheapest | Simple queries |

**Recommendation**: Use `claude-3-5-sonnet-20241022` for best results.

---

## 💰 Pricing

### Claude 3.5 Sonnet (Recommended)

- **Input**: $3 per 1M tokens
- **Output**: $15 per 1M tokens

### Example Costs

| Usage | Estimated Cost |
|-------|----------------|
| 100 queries/day | ~$5-10/month |
| 500 queries/day | ~$25-50/month |
| 1000 queries/day | ~$50-100/month |

**Note**: Actual costs depend on query length and response size.

---

## 🔄 Switching Between Providers

### Use Claude (Default)

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Use OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Switch Anytime

Just change `AI_PROVIDER` and restart the backend. No code changes needed!

---

## 🧪 Testing

### Test API Key

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude!"}
    ]
  }'
```

### Test Nexi AI

1. Start backend: `cd backend && npm run dev`
2. Open IDE
3. Click Nexi AI panel
4. Ask: "Explain Sui Move modules"
5. Verify response

---

## 📊 Features

### What Nexi AI Can Do

✅ **Code Generation**
- Generate Sui Move smart contracts
- Create TypeScript/JavaScript code
- Write test cases

✅ **Code Explanation**
- Explain complex code
- Document functions
- Clarify concepts

✅ **Debugging**
- Identify errors
- Suggest fixes
- Explain error messages

✅ **Optimization**
- Improve gas efficiency
- Suggest best practices
- Refactor code

✅ **Learning**
- Answer Sui blockchain questions
- Explain Walrus integration
- Guide zkLogin implementation

---

## 🎯 Best Practices

### Effective Prompts

**Good:**
```
"Generate a Sui Move module for an NFT marketplace with minting and trading functions"
```

**Better:**
```
"Generate a Sui Move module for an NFT marketplace. Include:
- Minting function with royalties
- Trading with escrow
- Gas-optimized storage
- Proper error handling"
```

### Context Sharing

When asking about code:
1. Select the code in editor
2. Right-click → "Ask Nexi AI"
3. Code context is automatically included

### Conversation History

Nexi AI remembers your conversation:
- Ask follow-up questions
- Reference previous responses
- Build on earlier code

---

## 🔒 Security

### API Key Safety

✅ **Do:**
- Store API key in `.env.local`
- Add `.env.local` to `.gitignore`
- Use environment variables
- Rotate keys regularly

❌ **Don't:**
- Commit API keys to git
- Share keys publicly
- Hardcode in source code
- Use same key across projects

### Rate Limiting

Claude has rate limits:
- **Tier 1**: 50 requests/min
- **Tier 2**: 1000 requests/min
- **Tier 3**: 2000 requests/min

Backend automatically handles rate limit errors.

---

## 🐛 Troubleshooting

### Error: "Claude AI not configured"

**Solution**: Set `ANTHROPIC_API_KEY` in `backend/.env.local`

### Error: "Invalid API key"

**Solution**: 
1. Check API key format (starts with `sk-ant-`)
2. Verify key is active in Anthropic Console
3. Ensure no extra spaces in `.env.local`

### Error: "Rate limit exceeded"

**Solution**: 
1. Wait a moment and retry
2. Upgrade Anthropic tier
3. Implement request queuing

### Slow Responses

**Solution**:
1. Reduce `ANTHROPIC_MAX_TOKENS`
2. Use shorter prompts
3. Clear conversation history

### No Response

**Solution**:
1. Check backend logs
2. Verify API key is valid
3. Test API key with curl
4. Check internet connection

---

## 📈 Monitoring

### Check Usage

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Navigate to **Usage**
3. View token consumption
4. Monitor costs

### Backend Logs

```bash
cd backend
npm run dev

# Watch for:
# ✅ "Claude API response received"
# ❌ "Claude API error: ..."
```

---

## 🔄 Migration from OpenAI

### Step 1: Install Dependencies

Already done! `@anthropic-ai/sdk` is installed.

### Step 2: Update Environment

```env
# Change from:
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# To:
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

### Step 4: Test

Everything should work the same, but with Claude!

---

## 💡 Tips

### Cost Optimization

1. **Use Haiku for Simple Queries**: Switch to `claude-3-haiku` for basic questions
2. **Limit Max Tokens**: Reduce `ANTHROPIC_MAX_TOKENS` if responses are too long
3. **Clear Old Conversations**: Delete unused conversation history
4. **Cache System Prompts**: Claude caches system prompts automatically

### Performance Optimization

1. **Shorter Prompts**: Be concise but clear
2. **Relevant Context**: Only include necessary code
3. **Conversation Limits**: Keep conversations under 10 messages
4. **Parallel Requests**: Backend handles multiple users efficiently

---

## 📚 Resources

### Official Documentation
- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude Models](https://docs.anthropic.com/claude/docs/models-overview)
- [API Reference](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

### Pricing
- [Anthropic Pricing](https://www.anthropic.com/pricing)

### Support
- [Anthropic Support](https://support.anthropic.com/)
- [Discord Community](https://discord.gg/anthropic)

---

## 🎉 Benefits

### For You
- ✅ Use existing Claude subscription
- ✅ Better code understanding
- ✅ Longer context window
- ✅ Cost-effective
- ✅ High-quality responses

### For Users
- ✅ Faster responses
- ✅ Better code generation
- ✅ More accurate explanations
- ✅ Improved debugging help
- ✅ Consistent quality

---

## 📝 Example Usage

### Generate Smart Contract

**Prompt:**
```
Generate a Sui Move module for a token staking contract with:
- Stake tokens
- Unstake with cooldown
- Claim rewards
- Admin functions
```

**Response:**
Claude will generate a complete, well-documented Sui Move module with all requested features.

### Debug Error

**Prompt:**
```
I'm getting this error: "Invalid object reference"
[Include your code]
```

**Response:**
Claude will identify the issue and suggest fixes.

### Optimize Gas

**Prompt:**
```
How can I optimize this code for gas efficiency?
[Include your code]
```

**Response:**
Claude will suggest specific optimizations.

---

## ✅ Setup Checklist

- [ ] Get Claude API key from Anthropic Console
- [ ] Add `ANTHROPIC_API_KEY` to `backend/.env.local`
- [ ] Set `AI_PROVIDER=claude`
- [ ] Restart backend server
- [ ] Test Nexi AI in IDE
- [ ] Monitor usage in Anthropic Console
- [ ] Set up billing alerts (optional)

---

**Status**: ✅ Ready to Use  
**Last Updated**: December 2024  
**Recommended Model**: claude-3-5-sonnet-20241022
