
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Send, Phone, User } from 'lucide-react';
import { sendLeadTo1C, type LeadData } from '../../services/leadService';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, subject = "Заявка в клуб" }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Пожалуйста, укажите ваше имя');
      return;
    }
    
    if (!phone.trim()) {
      setError('Пожалуйста, укажите номер телефона');
      return;
    }

    setIsSubmitting(true);

    const leadData: LeadData = {
      name: name.trim(),
      phone: phone.trim(),
      subject,
    };

    const result = await sendLeadTo1C(leadData);

    setIsSubmitting(false);

    if (result.success) {
      alert('Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
      setName('');
      setPhone('');
      onClose();
    } else {
      setError(result.message || 'Ошибка отправки заявки. Попробуйте позже.');
    }
  };

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
            onClick={(e) => e.stopPropagation()}
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

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-river/30" size={18} />
                  <input 
                    type="text" 
                    placeholder="Ваше имя" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:border-river outline-none transition-all font-bold text-river-dark"
                    required
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-river/30" size={18} />
                  <input 
                    type="tel" 
                    placeholder="+7 (___) ___-__-__" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-black/5 rounded-2xl py-5 pl-14 pr-6 focus:border-river outline-none transition-all font-bold text-river-dark"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-river text-white py-6 rounded-2xl font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-river-dark transition-all shadow-xl mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить данные'} <Send size={16} />
                </button>
              </form>
              
              <p className="text-[10px] text-river-gray/50 font-bold uppercase tracking-widest mt-8 text-center leading-relaxed px-6">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link 
                  to="/privacy" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-river hover:text-river-dark underline underline-offset-2 transition-colors"
                >
                  политикой конфиденциальности
                </Link>
                {' '}и условиями обработки персональных данных.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
