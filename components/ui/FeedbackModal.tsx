
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, User } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, subject = "Заявка в клуб" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-river/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="bg-river-light p-8 md:p-12">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-river-dark/20 hover:text-river transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="space-y-2 mb-10">
                <span className="text-river-accent font-bold uppercase tracking-widest text-[10px]">{subject}</span>
                <h3 className="text-3xl font-extrabold text-river-dark tracking-tighter leading-none">ОСТАВЬТЕ ЗАЯВКУ</h3>
                <p className="text-river-gray text-sm font-medium">Мы свяжемся с вами в течение 15 минут для консультации.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Спасибо! Заявка отправлена.'); onClose(); }}>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-river/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ваше имя" 
                    className="w-full bg-white border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:border-river outline-none transition-all font-bold text-river-dark"
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-river/30" size={18} />
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__" 
                    className="w-full bg-white border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:border-river outline-none transition-all font-bold text-river-dark"
                  />
                </div>

                <button className="w-full bg-river text-white py-6 rounded-2xl font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-river-dark transition-all shadow-xl mt-4">
                  Отправить данные <Send size={16} />
                </button>
              </form>
              
              <p className="text-[10px] text-river-gray/50 font-bold uppercase tracking-widest mt-8 text-center leading-relaxed px-6">
                Нажимая кнопку, вы соглашаетесь с условиями <br/> обработки персональных данных.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
