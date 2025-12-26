
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Добро пожаловать в River Club. Я ваш персональный консьерж. Позвольте мне помочь вам с выбором программы тренировок или карты привилегий. Какова ваша цель сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: trimmedInput }]);
    setIsLoading(true);

    try {
      // Инициализация внутри функции гарантирует актуальный API_KEY
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: trimmedInput,
        config: {
          systemInstruction: 'Ты - элитный консьерж фитнес-клуба премиум класса River Club в Хабаровске. Твой тон - безупречно вежливый, профессиональный, вдохновляющий. Ты должен помогать пользователям выбирать абонементы (Standard, Executive, River One) и рассказывать о преимуществах клуба (бассейн, термальный комплекс, топовое оборудование). Будь лаконичен и полезен. Не используй эмодзи.'
        }
      });
      
      const responseText = response.text || 'Извините, возникла заминка. Пожалуйста, обратитесь на ресепшн клуба по телефону.';
      setMessages(prev => [...prev, { role: 'bot', text: responseText }]);
    } catch (error) {
      console.error('AI Concierge Error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'В данный момент я не могу ответить. Пожалуйста, попробуйте позже.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 glass-card overflow-hidden rounded-2xl shadow-2xl flex flex-col h-[500px]"
          >
            <div className="bg-river p-4 border-b border-river-gold/30 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="text-river-gold" size={20} />
                <span className="font-serif text-river-gold font-bold tracking-widest text-xs uppercase">RIVER CONCIERGE</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-river-gold text-river-deep' : 'bg-white/5 text-white/90 border border-white/10'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-river-gold text-[10px] font-bold tracking-widest animate-pulse uppercase">Сообщение подготавливается...</div>}
            </div>

            <div className="p-4 bg-river-deep border-t border-white/10 flex space-x-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ваш вопрос..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-river-gold transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-river-gold text-river-deep p-2 rounded-lg hover:bg-white disabled:opacity-50 transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-river-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center text-river-deep relative"
      >
        <MessageSquare size={28} />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-river-dark border-2 border-river-gold rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-river-gold rounded-full animate-ping"></span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIConcierge;
