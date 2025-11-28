import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Book, Zap, Loader, Copy, Check, Bot, Trash2 } from 'lucide-react';
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
      content: " Hi! I'm **Nexi AI**, your Sui ecosystem expert. I can help you with:\n\n• **Sui Move** - Smart contract development\n• **Seal** - Privacy and encryption\n• **Walrus** - Decentralized storage\n• **zkLogin** - Zero-knowledge authentication\n• **Suiet Wallet** - Wallet integration\n• **Sui SDK** - TypeScript/JavaScript SDK\n• **Gas Optimization** - Cost reduction\n• **Debugging** - Error resolution\n\nWhat would you like to build today?",
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
      // Use backend AI service
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
    } catch (error: any) {
      // Show error message instead of fallback
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ **AI Service Unavailable**\n\nI'm unable to process your request right now. This could be because:\n\n• Backend server is not running (run \`start-backend.bat\`)\n• AI service is not configured (check backend .env for API keys)\n• Network connection issue\n\n**Error:** ${error.message || 'Unknown error'}\n\nPlease ensure the backend is running and properly configured.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
    <div className="h-full bg-dark-surface flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sui-cyan/20 bg-dark-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-neon rounded-lg flex items-center justify-center shadow-neon">
              <Bot size={24} className="text-black" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-tech flex items-center gap-2">
                NEXI AI
                <span className="px-2 py-0.5 bg-neon-green/20 text-neon-green text-xs font-bold rounded border border-neon-green/30">
                  BETA
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-tech">Sui Ecosystem Expert • {messages.length - 1} messages</p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-slate-400 hover:text-neon-pink hover:bg-neon-pink/10 rounded-lg border border-transparent hover:border-neon-pink/30 transition-all"
              title="Clear conversation"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sui-cyan/30 scrollbar-track-transparent p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center flex-shrink-0 shadow-neon">
                <Bot size={18} className="text-black" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                ? 'bg-sui-cyan/10 border border-sui-cyan/30'
                : 'bg-dark-panel border border-sui-cyan/20'
                }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-sm text-slate-200 whitespace-pre-wrap font-tech">
                  {message.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      const [lang, ...code] = part.split('\n');
                      return (
                        <div key={i} className="relative my-2">
                          <div className="absolute top-2 right-2 flex gap-2">
                            <span className="text-xs text-slate-500 font-mono">{lang}</span>
                            <button
                              onClick={() => handleCopy(code.join('\n'), message.id + i)}
                              className="text-slate-400 hover:text-sui-cyan transition-colors"
                            >
                              {copiedId === message.id + i ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                          </div>
                          <pre className="bg-black/50 rounded p-4 overflow-x-auto">
                            <code className="text-xs">{code.join('\n')}</code>
                          </pre>
                        </div>
                      );
                    }
                    return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.*?)\*\*/g, '<strong class="text-sui-cyan">$1</strong>').replace(/\n/g, '<br/>') }} />;
                  })}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2 font-tech">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-sui-cyan/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-sui-cyan/30">
                <span className="text-sui-cyan font-bold">U</span>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center flex-shrink-0 shadow-neon">
              <Bot size={18} className="text-black" />
            </div>
            <div className="bg-dark-panel border border-sui-cyan/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sui-cyan">
                <Loader size={16} className="animate-spin" />
                <span className="text-sm font-tech">Nexi is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 space-y-4">
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-tech">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`flex items-center gap-2 p-3 bg-dark-panel border rounded-lg hover:shadow-neon transition-all text-left group ${action.color === 'sui-cyan' ? 'border-sui-cyan/20 hover:border-sui-cyan/50' :
                    action.color === 'neon-green' ? 'border-neon-green/20 hover:border-neon-green/50' :
                      action.color === 'neon-purple' ? 'border-neon-purple/20 hover:border-neon-purple/50' :
                        'border-neon-pink/20 hover:border-neon-pink/50'
                    }`}
                >
                  <div className={`group-hover:scale-110 transition-transform ${action.color === 'sui-cyan' ? 'text-sui-cyan' :
                    action.color === 'neon-green' ? 'text-neon-green' :
                      action.color === 'neon-purple' ? 'text-neon-purple' :
                        'text-neon-pink'
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
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-tech">Popular Topics</h4>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 bg-sui-cyan/10 border border-sui-cyan/30 rounded-full text-xs font-bold text-sui-cyan hover:bg-sui-cyan/20 hover:border-sui-cyan/50 transition-all font-tech"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-sui-cyan/20 bg-dark-header">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nexi about Sui Move, Walrus, zkLogin, or anything Sui..."
            className="flex-1 px-4 py-3 bg-dark-panel border border-sui-cyan/20 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sui-cyan/50 focus:shadow-neon transition-all resize-none font-tech"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-neon hover:shadow-neon-lg text-black rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-slate-500 font-tech">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default NexiAI;
