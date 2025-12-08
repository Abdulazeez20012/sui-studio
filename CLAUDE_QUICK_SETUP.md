# Claude AI - Quick Setup (2 Minutes)

## Step 1: Get API Key

Visit: https://console.anthropic.com/

- Sign in
- Go to **API Keys**
- Click **Create Key**
- Copy key (starts with `sk-ant-`)

## Step 2: Configure

Edit `backend/.env.local`:

```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-api03-paste-your-key-here
```

## Step 3: Restart

```bash
cd backend
npm run dev
```

## Step 4: Test

Open IDE → Nexi AI → Ask anything!

---

## ✅ Done!

Nexi AI now uses Claude 3.5 Sonnet

---

## 💰 Pricing

- **Input**: $3 per 1M tokens
- **Output**: $15 per 1M tokens
- **~58% cheaper than GPT-4**

---

## 🔄 Switch Back to OpenAI?

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key
```

---

## 📚 Full Guide

See `CLAUDE_AI_SETUP.md` for complete documentation

---

**Status**: ✅ Ready  
**Time**: 2 minutes  
**Cost**: ~$10/month for typical usage
