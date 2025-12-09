import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const prisma = new PrismaClient();

// Determine which AI provider to use
const AI_PROVIDER = process.env.AI_PROVIDER || 'claude'; // 'openai' or 'claude'

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Initialize Claude client
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

router.use(authenticateToken);

const chatSchema = z.object({
  message: z.string(),
  conversationId: z.string().optional(),
  context: z.object({
    code: z.string().optional(),
    language: z.string().optional(),
    fileName: z.string().optional(),
  }).optional(),
});

// Send message to Nexi AI
router.post('/chat', async (req: AuthRequest, res) => {
  try {
    const { message, conversationId, context } = chatSchema.parse(req.body);

    // Create or get conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findFirst({
        where: {
          id: conversationId,
          userId: req.userId!,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10, // Last 10 messages for context
          },
        },
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: req.userId!,
          title: message.substring(0, 50),
        },
        include: {
          messages: true,
        },
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
        context: context ? JSON.stringify(context) : null,
      },
    });

    // Generate AI response with conversation history
    const aiResponse = await generateAIResponse(message, context, conversation.messages);

    // Save AI message
    const aiMessage = await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
      },
    });

    res.json({
      conversationId: conversation.id,
      message: aiMessage,
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get conversation history
router.get('/conversations', async (req: AuthRequest, res) => {
  try {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId: req.userId! },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Just get first message for preview
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    res.json({ conversations });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation messages
router.get('/conversations/:id', async (req: AuthRequest, res) => {
  try {
    const conversation = await prisma.aIConversation.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/conversations/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.aIConversation.delete({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to generate AI response using configured provider
async function generateAIResponse(message: string, context?: any, conversationHistory?: any[]): Promise<string> {
  // Route to appropriate AI provider
  if (AI_PROVIDER === 'claude') {
    return generateClaudeResponse(message, context, conversationHistory);
  } else {
    return generateOpenAIResponse(message, context, conversationHistory);
  }
}

// Generate response using Claude AI
async function generateClaudeResponse(message: string, context?: any, conversationHistory?: any[]): Promise<string> {
  if (!anthropic) {
    throw new Error('Claude AI not configured. Please set ANTHROPIC_API_KEY in environment variables.');
  }

  try {
    // Build system prompt for Sui Move expertise
    const systemPrompt = `You are Nexi AI, an expert AI assistant specialized in the Sui blockchain ecosystem. You have deep knowledge of:

- **Sui Move**: Smart contract development, syntax, best practices, and patterns
- **Walrus**: Decentralized storage protocol integration
- **zkLogin**: Zero-knowledge authentication implementation
- **Gas Optimization**: Strategies to reduce transaction costs
- **Sui SDK**: TypeScript/JavaScript SDK usage
- **Debugging**: Common errors and solutions

Provide clear, concise, and actionable responses. When showing code:
- Use proper Sui Move syntax
- Include comments for clarity
- Follow best practices
- Explain key concepts

Be helpful, professional, and encouraging.`;

    // Build messages array with conversation history
    const messages: Anthropic.MessageParam[] = [];

    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }

    // Build user message with context
    let userMessage = message;
    if (context) {
      if (context.code) {
        userMessage += `\n\nCode context:\n\`\`\`${context.language || 'move'}\n${context.code}\n\`\`\``;
      }
      if (context.fileName) {
        userMessage += `\n\nFile: ${context.fileName}`;
      }
    }

    messages.push({ role: 'user', content: userMessage });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '4096'),
      system: systemPrompt,
      messages,
      temperature: 0.7,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    return 'I apologize, but I could not generate a response. Please try again.';
  } catch (error: any) {
    console.error('Claude API error:', error);
    
    // Provide helpful error messages
    if (error.status === 429) {
      throw new Error('AI service rate limit exceeded. Please try again in a moment.');
    }
    if (error.status === 401) {
      throw new Error('AI service configuration error. Please contact support.');
    }
    
    throw new Error('AI service temporarily unavailable. Please try again later.');
  }
}

// Generate response using OpenAI
async function generateOpenAIResponse(message: string, context?: any, conversationHistory?: any[]): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI not configured. Please set OPENAI_API_KEY in environment variables.');
  }

  try {
    // Build system prompt for Sui Move expertise
    const systemPrompt = `You are Nexi AI, an expert AI assistant specialized in the Sui blockchain ecosystem. You have deep knowledge of:

- **Sui Move**: Smart contract development, syntax, best practices, and patterns
- **Walrus**: Decentralized storage protocol integration
- **zkLogin**: Zero-knowledge authentication implementation
- **Gas Optimization**: Strategies to reduce transaction costs
- **Sui SDK**: TypeScript/JavaScript SDK usage
- **Debugging**: Common errors and solutions

Provide clear, concise, and actionable responses. When showing code:
- Use proper Sui Move syntax
- Include comments for clarity
- Follow best practices
- Explain key concepts

Be helpful, professional, and encouraging.`;

    // Build messages array with conversation history
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Build user message with context
    let userMessage = message;
    if (context) {
      if (context.code) {
        userMessage += `\n\nCode context:\n\`\`\`${context.language || 'move'}\n${context.code}\n\`\`\``;
      }
      if (context.fileName) {
        userMessage += `\n\nFile: ${context.fileName}`;
      }
    }

    messages.push({ role: 'user', content: userMessage });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    // Provide helpful error messages
    if (error.code === 'insufficient_quota') {
      throw new Error('AI service quota exceeded. Please contact support.');
    }
    if (error.code === 'invalid_api_key') {
      throw new Error('AI service configuration error. Please contact support.');
    }
    
    throw new Error('AI service temporarily unavailable. Please try again later.');
  }
}

export default router;
