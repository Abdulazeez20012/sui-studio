import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Book, Zap, Loader, Copy, Check, Bot, Trash2, ArrowUp } from 'lucide-react';
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
    { icon: <Code size={16} />, label: 'Generate Move Code', prompt: 'Help me create a Sui Move smart contract for...', color: 'text-walrus-cyan border-walrus-cyan/20 bg-walrus-cyan/5 hover:bg-walrus-cyan/10' },
    { icon: <Zap size={16} />, label: 'Optimize Gas', prompt: 'How can I optimize gas costs in my Move contract?', color: 'text-green-400 border-green-500/20 bg-green-500/5 hover:bg-green-500/10' },
    { icon: <Book size={16} />, label: 'Explain Concept', prompt: 'Explain how zkLogin works in Sui', color: 'text-purple-400 border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10' },
    { icon: <Sparkles size={16} />, label: 'Debug Error', prompt: 'I\'m getting this error in my Move code:', color: 'text-pink-400 border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10' },
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
    <div className="h-full bg-walrus-dark-900/40 backdrop-blur-xl flex flex-col font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-walrus-cyan/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-walrus-purple/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-walrus-cyan/20 to-walrus-purple/20 border border-white/10 rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <Bot size={20} className="text-walrus-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                NEXI AI
                <span className="px-1.5 py-0.5 bg-walrus-cyan/10 text-walrus-cyan text-[9px] font-bold rounded-md border border-walrus-cyan/20">
                  BETA
                </span>
              </h3>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">Sui Ecosystem Expert</p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Clear conversation"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 space-y-6 relative z-0">
        {messages.map((message, idx) => (
          <div
            key={message.id}
            className={`flex gap-3 animate-fade-in-up ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-walrus-dark-800 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-gray-400" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${message.role === 'user'
                ? 'bg-walrus-cyan/10 border border-walrus-cyan/20 text-white rounded-br-none'
                : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none backdrop-blur-sm'
                }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="text-xs leading-5 whitespace-pre-wrap font-sans">
                  {message.content.split('```').map((part, i) => {
                    if (i % 2 === 1) {
                      const [lang, ...code] = part.split('\n');
                      return (
                        <div key={i} className="relative my-3 rounded-lg overflow-hidden border border-white/10 bg-black/40 group">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5">
                            <span className="text-[10px] text-gray-500 font-mono lowercase">{lang || 'code'}</span>
                            <button
                              onClick={() => handleCopy(code.join('\n'), message.id + i)}
                              className="text-gray-500 hover:text-white transition-colors"
                            >
                              {copiedId === message.id + i ? (
                                <Check size={12} className="text-green-400" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                          <div className="p-3 overflow-x-auto custom-scrollbar">
                            <code className="text-[11px] font-mono text-gray-300">{code.join('\n')}</code>
                          </div>
                        </div>
                      );
                    }
                    return <span key={i} dangerouslySetInnerHTML={{
                      __html: part
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-walrus-cyan font-bold">$1</strong>')
                        .replace(/•/g, '<span class="text-walrus-purple mr-1">•</span>')
                        .replace(/\n/g, '<br/>')
                    }} />;
                  })}
                </div>
              </div>
              <div className="text-[9px] text-gray-500 mt-2 font-medium opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 bg-walrus-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-walrus-cyan/30">
                <div className="w-2 h-2 bg-walrus-cyan rounded-full animate-pulse" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-walrus-dark-800 border border-white/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles size={14} className="text-walrus-cyan animate-pulse" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-none p-3 backdrop-blur-sm flex items-center gap-2">
              <Loader size={14} className="text-walrus-cyan animate-spin" />
              <span className="text-xs text-gray-400 font-medium">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions & Suggestions - Only show when simple conversation */}
      {messages.length === 1 && (
        <div className="px-4 pb-0 z-10 transition-all duration-500">
          <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left group hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
                >
                  <div className="mt-0.5">{action.icon}</div>
                  <div>
                    <span className="text-xs font-bold text-gray-200 block mb-0.5 group-hover:text-white">
                      {action.label}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight block">
                      {action.prompt.substring(0, 30)}...
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Popular Topics</h4>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => setInput(chip)}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-gray-400 hover:bg-walrus-cyan/10 hover:border-walrus-cyan/30 hover:text-walrus-cyan transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Input Area */}
      <div className="p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-walrus-cyan/30 to-walrus-purple/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 ${input ? 'opacity-100' : ''}`} />
          <div className="relative flex gap-2 bg-walrus-dark-900/90 rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Nexi about Sui Move..."
              className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none resize-none font-medium custom-scrollbar"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-300 ${input.trim() && !isLoading
                  ? 'bg-walrus-cyan text-black shadow-[0_0_15px_-3px_rgba(60,185,255,0.5)] hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-[9px] text-gray-600 font-medium">
          Powered by Nexi AI • Sui Ecosystem Intelligence
        </div>
      </div>
    </div>
  );
};

export default NexiAI;
