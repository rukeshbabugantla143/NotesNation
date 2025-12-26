
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, MessageSquare, BookOpen, Lightbulb, Zap } from 'lucide-react';
import { AIService } from '../services/ai';
import { Button } from './Button';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const BRAND_LOGO = "https://yt3.googleusercontent.com/2xTXlSO7Wo-5IuIWw3TfvrnbUjFtUrl8LuSn8YMg5J-3gJp7P8dfUqP8_Kesl58MiA3-zbHNJ0Y=s900-c-k-c0x00ffffff-no-rj";

export const AIAssistant: React.FC<{ isOpen: boolean; onClose: () => void; initialPrompt?: string }> = ({ 
  isOpen, 
  onClose,
  initialPrompt
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: "Namaste! I'm Learn New Things AI. I can help you summarize notes, explain complex concepts, or plan your study schedule. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    const userText = text.trim();
    if (!userText || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: userText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg: Message = { id: aiMsgId, role: 'ai', text: '', timestamp: new Date() };
    setMessages(prev => [...prev, aiMsg]);

    try {
      let fullResponse = '';
      const stream = AIService.streamChat(userText, []);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: fullResponse } : m));
      }
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Connection error. Please try again." } : m));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-[150] flex flex-col animate-slide-in-right border-l border-slate-100">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-lg transform -rotate-3">
            <img src={BRAND_LOGO} alt="Learn New Things" className="w-full h-full object-contain rounded-lg" />
          </div>
          <div>
            <h3 className="font-black text-lg tracking-tight">Learn New Things AI</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">Official Student Companion</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white shadow-sm border border-slate-100'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <img src={BRAND_LOGO} className="w-6 h-6 object-contain" alt="AI" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-100' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.role === 'ai' && !msg.text && (
                  <div className="flex space-x-1 py-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 py-2 flex flex-wrap gap-2">
          <QuickPrompt icon={<BookOpen className="h-3 w-3"/>} label="Study Plan" onClick={() => handleSend("Help me create a 7-day study plan for my exams.")} />
          <QuickPrompt icon={<Lightbulb className="h-3 w-3"/>} label="Explain Concept" onClick={() => handleSend("Explain Fourier Series like I'm 5 years old.")} />
          <QuickPrompt icon={<Zap className="h-3 w-3"/>} label="Career Path" onClick={() => handleSend("What are the career opportunities after B.Tech CSE in India?")} />
        </div>
      )}

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative">
          <input 
            type="text" 
            placeholder="Ask anything about your studies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
        <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
          Powered by Gemini 3 Flash • Built by Learn New Things
        </p>
      </div>
    </div>
  );
};

const QuickPrompt = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm"
  >
    {icon}
    <span>{label}</span>
  </button>
);
