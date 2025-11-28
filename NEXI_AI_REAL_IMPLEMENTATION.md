# 🤖 NEXI AI - Real OpenAI Implementation

NEXI AI now uses real OpenAI GPT models for intelligent Sui Move assistance!

## What Changed

### Backend Implementation (`backend/src/routes/ai.ts`)

**Before:** Hardcoded pattern matching responses
**Now:** Real OpenAI GPT-4 integration with:

✅ **OpenAI API Integration**
- Uses GPT-4 Turbo for intelligent responses
- Specialized system prompt for Sui ecosystem expertise
- Conversation history for context-aware responses

✅ **Expert Knowledge Areas**
- Sui Move smart contract development
- Walrus decentralized storage
- zkLogin authentication
- Gas optimization strategies
- Sui SDK usage
- Debugging and error resolution

✅ **Context-Aware Responses**
- Includes code context in prompts
- Maintains conversation history (last 10 messages)
- File name and language context
- Proper error handling

✅ **Professional Error Handling**
- Clear error messages for users
- Quota exceeded handling
- API key validation
- Service unavailability fallback

## Setup Instructions

### 1. Install OpenAI SDK

```bash
cd backend
npm install openai
```

### 2. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 3. Configure Environment Variables

Add to `backend/.env.local`:

```bash
# AI Configuration (OpenAI API)
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MAX_TOKENS=2000
```

**Model Options:**
- `gpt-4-turbo-preview` - Most capable (recommended)
- `gpt-4` - Stable GPT-4
- `gpt-3.5-turbo` - Faster, cheaper (for testing)

### 4. Start Backend

```bash
cd backend
npm run dev
```

## Features

### 1. Intelligent Code Generation

Ask NEXI AI to generate Sui Move code:
- "Create an NFT collection contract"
- "Generate a token swap module"
- "Build a staking contract"

### 2. Code Explanation

Get detailed explanations:
- "Explain this code" (with code context)
- "What does this function do?"
- "How does this pattern work?"

### 3. Optimization Advice

Get gas optimization tips:
- "How can I optimize this for gas?"
- "Suggest improvements for this code"
- "What are best practices for this?"

### 4. Debugging Help

Get help with errors:
- "I'm getting this error: [error message]"
- "Why isn't this working?"
- "Debug this code"

### 5. Conversation Memory

NEXI AI remembers your conversation:
- Maintains context across messages
- References previous code
- Builds on earlier discussions

## API Endpoints

### POST `/api/ai/chat`
Send a message to NEXI AI

**Request:**
```json
{
  "message": "Create an NFT contract",
  "conversationId": "optional-conversation-id",
  "context": {
    "code": "optional-code-context",
    "language": "move",
    "fileName": "nft.move"
  }
}
```

**Response:**
```json
{
  "conversationId": "conv-123",
  "message": {
    "id": "msg-456",
    "role": "assistant",
    "content": "Here's an NFT contract...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### GET `/api/ai/conversations`
Get all conversations

### GET `/api/ai/conversations/:id`
Get specific conversation with messages

### DELETE `/api/ai/conversations/:id`
Delete a conversation

## Cost Considerations

### Token Usage
- Average query: 500-1000 tokens
- With code context: 1000-2000 tokens
- Conversation history: +100 tokens per message

### Pricing (as of 2024)
- GPT-4 Turbo: $0.01/1K input, $0.03/1K output
- GPT-3.5 Turbo: $0.0005/1K input, $0.0015/1K output

### Cost Optimization
1. Use `gpt-3.5-turbo` for development
2. Limit conversation history (currently 10 messages)
3. Set reasonable `max_tokens` (currently 2000)
4. Implement rate limiting per user

## Testing

### Without OpenAI Key
If `OPENAI_API_KEY` is not set, NEXI AI will show:
```
AI service not configured. Please set OPENAI_API_KEY in environment variables.
```

### With OpenAI Key
1. Start backend: `cd backend && npm run dev`
2. Open IDE and click NEXI AI
3. Ask: "What can you help me with?"
4. Should get intelligent, context-aware response

## System Prompt

NEXI AI uses this specialized prompt:

```
You are Nexi AI, an expert AI assistant specialized in the Sui blockchain ecosystem.
You have deep knowledge of:
- Sui Move: Smart contract development, syntax, best practices
- Walrus: Decentralized storage protocol integration
- zkLogin: Zero-knowledge authentication implementation
- Gas Optimization: Strategies to reduce transaction costs
- Sui SDK: TypeScript/JavaScript SDK usage
- Debugging: Common errors and solutions

Provide clear, concise, and actionable responses with proper code examples.
```

## Comparison: Before vs After

### Before (Hardcoded)
```typescript
if (message.includes('nft')) {
  return "Here's a basic NFT...";
}
```
- ❌ Limited responses
- ❌ No context awareness
- ❌ Can't learn or adapt
- ❌ Pattern matching only

### After (OpenAI)
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [...history, userMessage],
  ...
});
```
- ✅ Unlimited knowledge
- ✅ Context-aware
- ✅ Learns from conversation
- ✅ Natural language understanding

## Next Steps

1. **Install OpenAI SDK**: `cd backend && npm install`
2. **Get API Key**: https://platform.openai.com/api-keys
3. **Configure**: Add key to `backend/.env.local`
4. **Test**: Start backend and try NEXI AI

## Alternative: Local AI Models

For privacy or cost concerns, you can use local models:

### Option 1: Ollama
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Run local model
ollama run codellama
```

### Option 2: LM Studio
Download from https://lmstudio.ai/

Then modify `ai.ts` to use local endpoint instead of OpenAI.

---

**Status:** NEXI AI now powered by real GPT-4! 🚀
