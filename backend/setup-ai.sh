#!/bin/bash

echo "🤖 Setting up NEXI AI with OpenAI..."
echo ""

# Install OpenAI SDK
echo "📦 Installing OpenAI SDK..."
npm install openai

echo ""
echo "✅ OpenAI SDK installed!"
echo ""
echo "📝 Next steps:"
echo "1. Get your OpenAI API key from: https://platform.openai.com/api-keys"
echo "2. Add to backend/.env.local:"
echo "   OPENAI_API_KEY=sk-your-key-here"
echo "   OPENAI_MODEL=gpt-4-turbo-preview"
echo "   OPENAI_MAX_TOKENS=2000"
echo ""
echo "3. Start the backend: npm run dev"
echo ""
echo "🚀 NEXI AI will be powered by real GPT-4!"
