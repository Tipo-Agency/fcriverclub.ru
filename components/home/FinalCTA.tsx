
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useFeedback } from '../../contexts/FeedbackContext';

export const FinalCTA: React.FC = () => {
  const { openModal } = useFeedback();
  
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

          <form className="flex flex-col gap-4 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 focus-within:border-river-accent/50 transition-all">
                <input 
                  type="text" 
                  placeholder="Ваше имя" 
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/30 font-bold text-sm md:text-base"
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
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/30 font-bold text-sm md:text-base"
                />
              </div>
            </div>

            <button onClick={(e) => { e.preventDefault(); openModal("Индивидуальная презентация клуба"); }} className="bg-white text-river w-full h-16 md:h-20 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-river-accent hover:text-white transition-all duration-500 flex items-center justify-center gap-3 shadow-xl">
              Записаться <ChevronRight size={18} />
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
