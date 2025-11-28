# ⚡ Setup NEXI AI (2 Minutes)

## Quick Setup

```bash
# 1. Install OpenAI SDK
cd backend
npm install openai

# 2. Get API key from: https://platform.openai.com/api-keys

# 3. Add to backend/.env.local:
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000

# 4. Start backend
npm run dev
```

## Test It

1. Open IDE → Click "NEXI AI"
2. Ask: "Create an NFT contract"
3. Get real AI response! 🎉

## Models

**GPT-4 Turbo** (Best quality)
```bash
OPENAI_MODEL=gpt-4-turbo-preview
```

**GPT-3.5 Turbo** (Faster/cheaper)
```bash
OPENAI_MODEL=gpt-3.5-turbo
```

## Troubleshooting

**"AI service not configured"**
→ Add `OPENAI_API_KEY` to `backend/.env.local`

**"Invalid API key"**
→ Get new key from https://platform.openai.com/api-keys

**"Quota exceeded"**
→ Add credits or use `gpt-3.5-turbo`

## Free Alternative

Use Ollama for free local AI:
```bash
curl https://ollama.ai/install.sh | sh
ollama run codellama
```

---

**Full docs:** See `NEXI_AI_REAL_IMPLEMENTATION.md`
