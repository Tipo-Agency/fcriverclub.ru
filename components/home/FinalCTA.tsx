
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { useFeedback } from '../../contexts/FeedbackContext';
import { sendLeadTo1C, type LeadData } from '../../services/leadService';
import { handlePhoneChange } from '../../utils/phoneMask';

export const FinalCTA: React.FC = () => {
  const { openModal } = useFeedback();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      subject: 'Индивидуальная презентация клуба',
    };

    const result = await sendLeadTo1C(leadData);

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setName('');
      setPhone('');
      // Скрываем успешное сообщение через 5 секунд
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } else {
      setError(result.message || 'Ошибка отправки заявки. Попробуйте позже.');
    }
  };
  
  return (
    <section className="bg-river text-white overflow-hidden min-h-fit md:min-h-[600px] flex items-center">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row">
        {/* Левая часть с формой */}
        <div className="flex-1 p-6 sm:p-12 md:p-24 space-y-8 md:space-y-12">
          <div className="space-y-6">
            <h2 className="text-[clamp(1.75rem,8vw,4.5rem)] font-extrabold tracking-tighter leading-[0.95] uppercase break-words">
              ИНДИВИДУАЛЬНАЯ <br className="hidden sm:block" /> ПРЕЗЕНТАЦИЯ КЛУБА!
            </h2>
            <div className="space-y-2">
              <p className="text-white/70 text-base md:text-xl font-medium leading-tight">
                Узнайте о всех уникальных возможностях клуба уже сейчас.
              </p>
              <p className="text-white/70 text-base md:text-xl font-medium leading-tight">
                Получите выгоду до -30% на премиум-фитнес!
              </p>
            </div>
            <div className="flex items-center gap-3 text-white/90 font-bold">
               <AlertCircle size={18} className="text-red-500 fill-red-500/20 shrink-0" />
               <span className="uppercase tracking-[0.1em] text-[10px] md:text-xs">Количество карт ограничено.</span>
            </div>
          </div>

          <form className="flex flex-col gap-4 max-w-2xl" onSubmit={handleSubmit}>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-white px-6 py-4 rounded-2xl text-center"
              >
                <CheckCircle size={32} className="mx-auto mb-2 text-green-400" />
                <h4 className="text-lg font-extrabold mb-1">Спасибо!</h4>
                <p className="text-sm font-medium">Заявка отправлена. Мы свяжемся с вами в ближайшее время.</p>
              </motion.div>
            )}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 focus-within:border-river-accent/50 transition-all">
                <input 
                  type="text" 
                  placeholder="Ваше имя" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/30 font-bold text-sm md:text-base"
                  required
                />
              </div>
              
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 focus-within:border-river-accent/50 transition-all">
                <div className="flex items-center gap-2 border-r border-white/20 pr-4 mr-4 shrink-0">
                  <div className="w-5 h-3.5 bg-white relative overflow-hidden rounded-[2px] shadow-sm">
                    <div className="absolute top-0 w-full h-1/3 bg-white"></div>
                    <div className="absolute top-1/3 w-full h-1/3 bg-blue-600"></div>
                    <div className="absolute bottom-0 w-full h-1/3 bg-red-600"></div>
                  </div>
                  <span className="text-sm font-black">+7</span>
                </div>
                <input 
                  type="tel" 
                  placeholder="(000) 000-00-00" 
                  value={phone}
                  onChange={(e) => handlePhoneChange(e, setPhone)}
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/30 font-bold text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-river w-full h-16 md:h-20 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-river-accent hover:text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Отправка...' : 'Записаться'} <ChevronRight size={18} />
            </button>
          </form>

          <p className="text-[9px] md:text-[10px] text-white/30 font-bold uppercase tracking-widest max-w-xl leading-relaxed">
            Оставляя заявку, я соглашаюсь с <a href="#" className="underline hover:text-white transition-colors">условиями обработки данных</a>.
          </p>
        </div>

        {/* Правая часть с изображением (скрыта на совсем маленьких экранах для компактности) */}
        <div className="hidden lg:block w-1/3 relative">
          <img 
            src="/orig.jpeg" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Trainer" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-river to-transparent"></div>
        </div>
      </div>
    </section>
  );
};
