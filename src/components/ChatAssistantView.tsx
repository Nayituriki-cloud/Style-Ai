import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  User,
  ArrowRight,
  RotateCcw,
  Shirt,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const QUICK_PROMPTS = [
  'How should I dress for a job interview?',
  'What can I wear with black jeans?',
  'Give me a professional outfit for a client pitch.',
  'Which shoes match my navy single-pleat trousers?',
  'Create an outfit using clothes in my wardrobe.',
  'How do I style an African print blazer for evening?',
];

export const ChatAssistantView: React.FC = () => {
  const { chatMessages, addChatMessage, wardrobe, styleProfile } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || input).trim();
    if (!message || loading) return;

    setInput('');
    addChatMessage({
      role: 'user',
      content: message,
    });

    setLoading(true);

    try {
      const wardrobePayload = wardrobe.map((w) => ({
        name: w.name,
        category: w.category,
        color: w.colorName,
        brand: w.brand,
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: chatMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          userProfile: {
            aesthetic: styleProfile.primaryAesthetic,
            favoriteColors: styleProfile.favoriteColors,
          },
          wardrobeItems: wardrobePayload,
        }),
      });

      const data = await response.json();
      if (data.reply) {
        addChatMessage({
          role: 'assistant',
          content: data.reply,
        });
      }
    } catch (err) {
      console.error(err);
      addChatMessage({
        role: 'assistant',
        content: "I apologize, but I encountered an interruption. When considering outfits, remember that neutral tones and proportional balance always create enduring style!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dedicated Fashion Concierge</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100">
            Ask Style AI
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Shirt className="w-3.5 h-3.5 text-stone-400" />
          <span>Synced with your Wardrobe ({wardrobe.length} items)</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-medium ${
                msg.role === 'user'
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                msg.role === 'user'
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-tr-none'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-none shadow-2xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {/* Quick Prompt Suggestions */}
              {msg.suggestedPrompts && (
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    Suggested Inquiries:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedPrompts.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(p)}
                        className="text-[11px] text-left px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-none p-4 text-xs text-stone-500 shadow-2xs">
              Formulating thoughtful fashion guidance...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-1.5 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors whitespace-nowrap shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about styling, colors, dress codes, or your wardrobe..."
            className="w-full pl-4 pr-12 py-3 text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 shadow-xs focus:outline-none focus:border-stone-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2.5 p-2 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
