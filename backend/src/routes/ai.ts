import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();
const prisma = new PrismaClient();

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
      });
    }

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId: req.userId!,
          title: message.substring(0, 50),
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

    // Generate AI response (in production, integrate with actual AI service)
    const aiResponse = await generateAIResponse(message, context);

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

// Helper function to generate AI response
async function generateAIResponse(message: string, context?: any): Promise<string> {
  const lowerMessage = message.toLowerCase();

  // Code generation
  if (lowerMessage.includes('create') || lowerMessage.includes('generate')) {
    if (lowerMessage.includes('nft') || lowerMessage.includes('collection')) {
      return `Here's a basic NFT collection structure in Sui Move:

\`\`\`move
module nft_collection::collection {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::{Self, String};

    struct NFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: String,
    }

    struct Collection has key {
        id: UID,
        name: String,
        total_supply: u64,
    }

    public entry fun mint_nft(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = NFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: string::utf8(url),
        };
        transfer::transfer(nft, tx_context::sender(ctx));
    }
}
\`\`\`

This creates a basic NFT with metadata. Would you like me to add more features?`;
    }

    if (lowerMessage.includes('token') || lowerMessage.includes('swap')) {
      return `Here's a simple token swap implementation:

\`\`\`move
module token_swap::swap {
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::tx_context::TxContext;

    struct Pool<phantom X, phantom Y> has key {
        id: UID,
        reserve_x: Balance<X>,
        reserve_y: Balance<Y>,
        lp_supply: u64,
    }

    public fun swap_x_to_y<X, Y>(
        pool: &mut Pool<X, Y>,
        coin_x: Coin<X>,
        ctx: &mut TxContext
    ): Coin<Y> {
        let amount_in = coin::value(&coin_x);
        let reserve_x = balance::value(&pool.reserve_x);
        let reserve_y = balance::value(&pool.reserve_y);
        
        // Calculate output using constant product formula
        let amount_out = (amount_in * reserve_y) / (reserve_x + amount_in);
        
        balance::join(&mut pool.reserve_x, coin::into_balance(coin_x));
        coin::from_balance(balance::split(&mut pool.reserve_y, amount_out), ctx)
    }
}
\`\`\`

This implements a basic AMM swap. Need help with liquidity pools?`;
    }
  }

  // Optimization
  if (lowerMessage.includes('optimize') || lowerMessage.includes('gas')) {
    return `**Gas Optimization Tips for Sui Move:**

1. **Use References**: Pass objects by reference (&Object) instead of by value
2. **Batch Operations**: Combine multiple operations in a single transaction
3. **Efficient Storage**: Use vector<T> for lists, Table for key-value pairs
4. **Avoid Cloning**: Use borrow instead of copy when possible
5. **Minimize Object Creation**: Reuse objects when feasible

Example optimization:
\`\`\`move
// ❌ Inefficient
public fun process(obj: MyObject) { ... }

// ✅ Efficient
public fun process(obj: &MyObject) { ... }
\`\`\`

Would you like me to analyze your specific code?`;
  }

  // Debugging
  if (lowerMessage.includes('error') || lowerMessage.includes('debug')) {
    return `I can help debug your code! Common Sui Move errors:

**1. Ability Errors**: Objects need correct abilities (key, store, copy, drop)
**2. Ownership Issues**: Ensure proper transfer/share semantics
**3. Type Mismatches**: Check generic type parameters
**4. Borrow Errors**: Mutable vs immutable references

Share your error message and I'll provide specific guidance!`;
  }

  // Default response
  return `I'm Nexi AI, your Sui ecosystem expert! I can help with:

• **Sui Move** - Smart contract development
• **Walrus** - Decentralized storage integration
• **zkLogin** - Zero-knowledge authentication
• **Gas Optimization** - Cost reduction strategies
• **Debugging** - Error resolution

What would you like to work on?`;
}

export default router;
