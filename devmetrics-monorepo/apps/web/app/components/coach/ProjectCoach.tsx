"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "../../lib/api";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "coach";
  content: string;
}

export function ProjectCoach({ repoId, repoName }: { repoId: string; repoName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "coach",
      content: `Hi! I'm your Project Coach AI. I've analyzed ${repoName}'s code structure, dependencies, and metrics. What would you like to know about its architecture, security, or tech debt?`
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.coach.askQuestion(repoId, userMessage.content);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: response.answer
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "coach",
        content: "Sorry, I encountered an error analyzing the repository. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editorial-card flex flex-col h-[500px] bg-black">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <Bot className="text-plum" size={20} />
        <div>
          <h3 className="font-semibold text-white text-sm">Project Coach AI</h3>
          <p className="text-xs text-gray-500">Repository-aware engineering mentor</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'coach' && (
              <div className="w-8 h-8 rounded-full bg-plum/10 border border-plum/30 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-plum" />
              </div>
            )}
            
            <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-plum text-white rounded-br-sm' 
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-sm'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <User size={16} className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-plum/10 border border-plum/30 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-plum" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-bl-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-plum" />
              <span className="text-xs text-gray-400">Analyzing repository context...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Ask about security, tech debt, architecture..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-full bg-plum hover:bg-plum/80 flex items-center justify-center text-white disabled:opacity-50 transition-colors shrink-0"
        >
          <Send size={16} className="ml-[-2px]" />
        </button>
      </div>
    </div>
  );
}
