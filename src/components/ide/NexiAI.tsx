import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Book, Zap, Loader, Copy, Check, Bot, Trash2, TrendingUp } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { analyticsService } from '../../services/analyticsService';
import { useIDEStore } from '../../store/ideStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: string;
}

const NexiAI: React.FC = () => {
  const { tabs, activeTab } = useIDEStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm **Nexi AI**, your Sui ecosystem expert. I can help you with:\n\n• **Sui Move** - Smart contract development\n• **Seal** - Privacy and encryption\n• **Walrus** - Decentralized storage\n• **zkLogin** - Zero-knowledge authentication\n• **Suiet Wallet** - Wallet integration\n• **Sui SDK** - TypeScript/JavaScript SDK\n• **Gas Optimization** - Cost reduction\n• **Debugging** - Error resolution\n\nWhat would you like to build today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const currentTab = tabs.find(t => t.id === activeTab);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { icon: <Code size={16} />, label: 'Generate Move Code', prompt: 'Help me create a Sui Move smart contract for...', color: 'sui-cyan' },
    { icon: <Zap size={16} />, label: 'Optimize Gas', prompt: 'How can I optimize gas costs in my Move contract?', color: 'neon-green' },
    { icon: <Book size={16} />, label: 'Explain Concept', prompt: 'Explain how zkLogin works in Sui', color: 'neon-purple' },
    { icon: <Sparkles size={16} />, label: 'Debug Error', prompt: 'I\'m getting this error in my Move code:', color: 'neon-pink' },
  ];

  const suggestionChips = [
    'Create NFT collection',
    'Implement token swap',
    'Add access control',
    'Setup Walrus storage',
    'Integrate zkLogin',
    'Deploy to testnet',
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setIsLoading(true);

    const startTime = Date.now();

    try {
      // Try to use backend AI service first
      const response = await aiService.sendMessage(query, {
        code: currentTab?.content,
        language: currentTab?.language || 'move',
        fileName: currentTab?.name,
      });

      if (response) {
        setMessages(prev => [...prev, {
          id: response.id,
          role: 'assistant',
          content: response.content,
          timestamp: new Date(response.createdAt),
        }]);
        
        // Track AI query
        const duration = Date.now() - startTime;
        analyticsService.trackAIQuery(query, duration);
      } else {
        throw new Error('No response from AI service');
      }
    } catch (error) {
      // Fallback to local response generation
      console.log('Using fallback AI response');
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(query),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('move') || lowerQuery.includes('smart contract')) {
      return `Here's a basic Sui Move smart contract structure:\n\n\`\`\`move\nmodule my_package::my_module {\n    use sui::object::{Self, UID};\n    use sui::transfer;\n    use sui::tx_context::{Self, TxContext};\n\n    struct MyObject has key {\n        id: UID,\n        value: u64,\n    }\n\n    public entry fun create(value: u64, ctx: &mut TxContext) {\n        let obj = MyObject {\n            id: object::new(ctx),\n            value,\n        };\n        transfer::transfer(obj, tx_context::sender(ctx));\n    }\n}\n\`\`\`\n\nThis creates a basic object with a value. Would you like me to explain any specific part?`;
    }

    if (lowerQuery.includes('walrus')) {
      return `**Walrus Storage Integration:**\n\nWalrus provides decentralized storage for Sui. Here's how to upload:\n\n\`\`\`typescript\nimport { WalrusClient } from '@mysten/walrus';\n\nconst client = new WalrusClient({\n  network: 'testnet'\n});\n\nconst blob = await client.upload(fileData);\nconsole.log('Blob ID:', blob.id);\n\`\`\`\n\nYou can then reference this blob ID in your Move contracts!`;
    }

    if (lowerQuery.includes('zklogin')) {
      return `**zkLogin Implementation:**\n\nzkLogin enables Web2 authentication for Web3:\n\n\`\`\`typescript\nimport { zkLogin } from '@mysten/zklogin';\n\n// 1. Get JWT from OAuth provider (Google, Facebook, etc.)\nconst jwt = await getJWTFromProvider();\n\n// 2. Generate zkLogin proof\nconst proof = await zkLogin.generateProof(jwt);\n\n// 3. Create Sui address\nconst address = zkLogin.getAddress(proof);\n\n// 4. Sign transactions\nconst signature = await zkLogin.sign(transaction, proof);\n\`\`\`\n\nNo seed phrases needed!`;
    }

    if (lowerQuery.includes('gas') || lowerQuery.includes('optimize')) {
      return `**Gas Optimization Tips:**\n\n1. **Use references** instead of copying:\n   \`&Object\` vs \`Object\`\n\n2. **Batch operations** when possible\n\n3. **Avoid unnecessary storage** operations\n\n4. **Use efficient data structures**:\n   - \`vector\` for lists\n   - \`Table\` for key-value pairs\n\n5. **Minimize object creation**\n\nWould you like me to analyze your specific code?`;
    }

    if (lowerQuery.includes('suiet') || lowerQuery.includes('wallet')) {
      return `**Suiet Wallet Integration:**\n\n\`\`\`typescript\nimport { SuietWallet } from '@suiet/wallet-kit';\n\n// Connect wallet\nconst wallet = new SuietWallet();\nawait wallet.connect();\n\n// Get account\nconst account = wallet.getAccount();\n\n// Sign transaction\nconst signedTx = await wallet.signTransaction({\n  transaction: txBytes,\n  account: account.address\n});\n\n// Execute\nconst result = await wallet.executeTransaction(signedTx);\n\`\`\`\n\nSupports all major Sui wallets!`;
    }

    if (lowerQuery.includes('sdk')) {
      return `**Sui SDK Usage:**\n\n\`\`\`typescript\nimport { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';\nimport { TransactionBlock } from '@mysten/sui.js/transactions';\n\nconst client = new SuiClient({ url: getFullnodeUrl('testnet') });\n\n// Create transaction\nconst tx = new TransactionBlock();\ntx.moveCall({\n  target: '0x2::coin::split',\n  arguments: [tx.object(coinId), tx.pure(1000)],\n});\n\n// Execute\nconst result = await client.signAndExecuteTransactionBlock({\n  transactionBlock: tx,\n  signer: keypair,\n});\n\`\`\``;
    }

    return `I can help you with that! Could you provide more details about:\n\n• What you're trying to build\n• Any specific errors you're encountering\n• Which Sui technology you're using (Move, Walrus, zkLogin, etc.)\n\nThe more context you provide, the better I can assist you!`;
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-dark-surface via-dark-bg to-dark-surface flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sui-cyan rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-purple rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative p-4 border-b border-sui-cyan/20 bg-dark-header/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-sui-cyan via-neon-purple to-neon-pink rounded-xl flex items-center justify-center shadow-neon animate-pulse">
                <Bot size={26} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-green rounded-full border-2 border-dark-header animate-pulse"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sui-cyan via-neon-purple to-neon-pink uppercase tracking-wider font-tech">
                  NEXI AI
                </h3>
                <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green text-xs font-bold rounded-full border border-neon-green/30 animate-pulse">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-tech mt-0.5">
                🚀 Sui Ecosystem Expert • {messages.length - 1} {messages.length === 2 ? 'message' : 'messages'}
              </p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2.5 text-slate-400 hover:text-neon-pink hover:bg-neon-pink/10 rounded-lg border border-transparent hover:border-neon-pink/30 transition-all hover:scale-110"
              title="Clear conversation"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fadeIn ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {message.role === 'assistant' && (
              <div className="w-9 h-9 bg-gradient-to-br from-sui-cyan via-neon-purple to-neon-pink rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon animate-pulse">
                <Bot size={20} className="text-white" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-2xl p-4 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-sui-cyan/20 to-neon-purple/20 border border-sui-cyan/40 shadow-lg shadow-sui-cyan/10'
                  : 'bg-dark-panel/80 border border-sui-cyan/20 shadow-lg shadow-black/20'
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-sm text-slate-100 whitespace-pre-wrap font-tech leading-relaxed">
                  {message.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      const [lang, ...code] = part.split('\n');
                      return (
                        <div key={i} className="relative my-3 group">
                          <div className="absolute top-2 right-2 flex gap-2 z-10">
                            <span className="px-2 py-1 bg-dark-bg/90 backdrop-blur-sm rounded text-xs text-slate-400 font-mono border border-sui-cyan/20">
                              {lang}
                            </span>
                            <button
                              onClick={() => handleCopy(code.join('\n'), message.id + i)}
                              className="px-2 py-1 bg-dark-bg/90 backdrop-blur-sm rounded text-slate-400 hover:text-sui-cyan hover:bg-sui-cyan/10 transition-all border border-sui-cyan/20 hover:border-sui-cyan/50"
                            >
                              {copiedId === message.id + i ? (
                                <Check size={14} className="text-neon-green" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          <pre className="bg-black/70 backdrop-blur-sm rounded-xl p-4 overflow-x-auto border border-sui-cyan/10 group-hover:border-sui-cyan/30 transition-all">
                            <code className="text-xs text-slate-200">{code.join('\n')}</code>
                          </pre>
                        </div>
                      );
                    }
                    return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, '<strong class="text-sui-cyan font-bold">$1</strong>').replace(/•/g, '<span class="text-neon-green">•</span>').replace(/\n/g, '<br/>') }} />;
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-tech">
                <div className="w-1.5 h-1.5 bg-sui-cyan rounded-full animate-pulse"></div>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-9 h-9 bg-gradient-to-br from-sui-cyan/30 to-neon-purple/30 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-sui-cyan/50 shadow-lg shadow-sui-cyan/20">
                <span className="text-sui-cyan font-black text-sm">U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 animate-fadeIn">
            <div className="w-9 h-9 bg-gradient-to-br from-sui-cyan via-neon-purple to-neon-pink rounded-xl flex items-center justify-center flex-shrink-0 shadow-neon animate-pulse">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-dark-panel/80 backdrop-blur-sm border border-sui-cyan/20 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-sui-cyan rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm font-tech text-transparent bg-clip-text bg-gradient-to-r from-sui-cyan to-neon-purple">
                  Nexi is thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Suggestions */}
      {messages.length === 1 && (
        <div className="relative px-4 pb-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-sui-cyan" />
              <h4 className="text-xs text-slate-400 uppercase tracking-wider font-tech font-bold">Quick Actions</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`flex items-center gap-2 p-3 bg-dark-panel/50 backdrop-blur-sm border rounded-xl hover:shadow-neon transition-all text-left group hover:scale-105 ${
                    action.color === 'sui-cyan' ? 'border-sui-cyan/20 hover:border-sui-cyan/50 hover:bg-sui-cyan/5' :
                    action.color === 'neon-green' ? 'border-neon-green/20 hover:border-neon-green/50 hover:bg-neon-green/5' :
                    action.color === 'neon-purple' ? 'border-neon-purple/20 hover:border-neon-purple/50 hover:bg-neon-purple/5' :
                    'border-neon-pink/20 hover:border-neon-pink/50 hover:bg-neon-pink/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                    action.color === 'sui-cyan' ? 'text-sui-cyan bg-sui-cyan/10' :
                    action.color === 'neon-green' ? 'text-neon-green bg-neon-green/10' :
                    action.color === 'neon-purple' ? 'text-neon-purple bg-neon-purple/10' :
                    'text-neon-pink bg-neon-pink/10'
                  }`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white font-tech">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-neon-purple" />
              <h4 className="text-xs text-slate-400 uppercase tracking-wider font-tech font-bold">Popular Topics</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 bg-gradient-to-r from-sui-cyan/10 to-neon-purple/10 border border-sui-cyan/30 rounded-full text-xs font-bold text-sui-cyan hover:from-sui-cyan/20 hover:to-neon-purple/20 hover:border-sui-cyan/50 hover:shadow-neon transition-all font-tech hover:scale-105"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative p-4 border-t border-sui-cyan/20 bg-dark-header/80 backdrop-blur-sm">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Nexi about Sui Move, Walrus, zkLogin, or anything Sui..."
              className="w-full px-4 py-3 bg-dark-panel/50 backdrop-blur-sm border border-sui-cyan/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan/50 focus:shadow-neon transition-all resize-none font-tech hover:border-sui-cyan/30"
              rows={2}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${input.trim() ? 'bg-neon-green animate-pulse' : 'bg-slate-600'}`}></div>
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-sui-cyan via-neon-purple to-neon-pink hover:shadow-neon-lg text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 disabled:hover:scale-100"
          >
            <Send size={18} className={isLoading ? 'animate-pulse' : ''} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 font-tech">
          <span>💡 Press <kbd className="px-1.5 py-0.5 bg-dark-panel rounded border border-sui-cyan/20">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-dark-panel rounded border border-sui-cyan/20">Shift+Enter</kbd> for new line</span>
          <span className="text-sui-cyan">{input.length} chars</span>
        </div>
      </div>
    </div>
  );
};

export default NexiAI;
