# 🚀 NEXI AI Quick Start

Get NEXI AI powered by real GPT-4 in 3 steps!

## Step 1: Install OpenAI SDK

**Windows:**
```bash
cd backend
setup-ai.bat
```

**Mac/Linux:**
```bash
cd backend
chmod +x setup-ai.sh
./setup-ai.sh
```

Or manually:
```bash
cd backend
npm install openai
```

## Step 2: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

## Step 3: Configure Backend

Edit `backend/.env.local` and add:

```bash
# AI Configuration
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```

## Step 4: Start Backend

```bash
cd backend
npm run dev
```

## Test It!

1. Open Sui Studio IDE
2. Click "NEXI AI" in the right panel
3. Ask: "What can you help me with?"
4. Get intelligent, context-aware responses! 🎉

## Example Queries

### Code Generation
- "Create an NFT collection contract"
- "Generate a token swap module"
- "Build a staking system"

### Code Help
- "Explain this code" (select code first)
- "How can I optimize this?"
- "What's wrong with this function?"

### Learning
- "What are Sui Move best practices?"
- "How does gas work on Sui?"
- "Explain zkLogin"

## Model Options

### GPT-4 Turbo (Recommended)
```bash
OPENAI_MODEL=gpt-4-turbo-preview
```
- Most intelligent
- Best for complex code
- ~$0.01 per 1K tokens

### GPT-3.5 Turbo (Budget)
```bash
OPENAI_MODEL=gpt-3.5-turbo
```
- Faster responses
- Good for simple queries
- ~$0.0005 per 1K tokens

## Troubleshooting

### "AI service not configured"
- Check `OPENAI_API_KEY` is set in `backend/.env.local`
- Restart backend after adding key

### "Invalid API key"
- Verify key starts with `sk-`
- Check for extra spaces
- Generate new key if needed

### "Quota exceeded"
- Add credits to OpenAI account
- Or switch to `gpt-3.5-turbo`

## Cost Estimate

Typical usage:
- 100 queries/day × 1000 tokens = 100K tokens
- GPT-4 Turbo: ~$1-3/day
- GPT-3.5 Turbo: ~$0.05-0.15/day

## Alternative: Free Local AI

Don't want to pay? Use local models:

### Ollama (Free)
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Run CodeLlama
ollama run codellama
```

Then modify `backend/src/routes/ai.ts` to use Ollama endpoint.

---

**Ready?** Run `cd backend && setup-ai.bat` to get started! 🚀
