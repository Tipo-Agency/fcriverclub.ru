
import React from 'react';
import { Instagram, Send, Phone, MessageCircle, Share2, Shield } from 'lucide-react';
import { useFeedback } from '../contexts/FeedbackContext';

export const Footer: React.FC = () => {
  const { openModal } = useFeedback();
  
  return (
    <footer className="bg-river text-white pt-24 pb-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        {/* ВЕРХНЯЯ ЧАСТЬ ПОДВАЛА */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-20">
          
          {/* LOGO & DESCRIPTION */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                <path d="M50 5L10 28V72L50 95L90 72V28L50 5Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M50 5V95M10 28L90 72M10 72L90 28" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4"/>
                <path d="M30 20V80M70 20V80" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tighter uppercase leading-none">RIVER CLUB</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-2 text-white/60 leading-tight">
                  ПРЕМИАЛЬНЫЙ ФИТНЕС-КЛУБ <br/> ДЛЯ САМЫХ ТРЕБОВАТЕЛЬНЫХ
                </p>
              </div>
            </div>
          </div>

          {/* CONTACTS COLUMNS */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">НАШ ТЕЛЕФОН:</h4>
                <a href="tel:+74212903081" className="text-xl font-extrabold hover:text-river-accent transition-colors">+7 (421) 290-30-81</a>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">НАШ АДРЕС:</h4>
                <p className="text-lg font-medium leading-tight">680028, г. Хабаровск, <br/> Советская, 1 к4</p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">НАШ E-MAIL:</h4>
                <a href="mailto:river_club@kb.ru" className="text-lg font-bold hover:text-river-accent transition-colors">river_club@kb.ru</a>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">ЧАСЫ РАБОТЫ:</h4>
                <p className="text-lg font-bold">пн-вс: с 6:30 до 23:00</p>
                <p className="text-sm font-medium text-white/60 uppercase tracking-widest">Без выходных</p>
              </div>
            </div>
          </div>

          {/* ACTIONS & SOCIALS */}
          <div className="space-y-8">
            <button onClick={() => openModal("Записаться в клуб")} className="w-full bg-white text-river py-4 rounded-xl font-extrabold uppercase tracking-widest text-xs hover:bg-river-accent hover:text-white transition-all duration-500">
              Записаться
            </button>
            
            <div className="flex gap-3">
              <a href="#" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-river hover:bg-river-accent hover:text-white transition-all">
                <MessageCircle size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-river hover:bg-river-accent hover:text-white transition-all">
                <Share2 size={24} />
              </a>
              <a href="#" className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-river hover:bg-river-accent hover:text-white transition-all">
                <Instagram size={24} />
              </a>
            </div>

            <button className="w-full border border-river-accent/40 text-white/80 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:border-river-accent hover:text-white transition-all">
              River Kids
            </button>

            <a href="#" className="block text-[11px] font-medium text-white/40 hover:text-white transition-colors underline underline-offset-4">
              Политика конфиденциальности
            </a>
          </div>
        </div>

        {/* РАЗДЕЛИТЕЛЬ */}
        <div className="h-px bg-white/10 w-full mb-12"></div>

        {/* НИЖНЯЯ ЮРИДИЧЕСКАЯ ЧАСТЬ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-[11px] font-medium text-white/30 uppercase tracking-wider leading-relaxed">
          <div className="space-y-2">
            <p className="text-white/50 font-bold mb-2 text-xs text-left">ООО «Спортинвест»</p>
            <p>680009, г. Хабаровск, проспект <br/> 60-летия Октября, 210, оф. 307</p>
            <p>ИНН: 2724204411</p>
            <p>КПП: 272401001</p>
            <p>ОГРН: 1152724006247</p>
          </div>

          <div className="space-y-2">
            <p className="text-white/50 font-bold mb-2 text-xs">ФИЛИАЛ "ХАБАРОВСКИЙ" АО "АЛЬФА-БАНК"</p>
            <p>БИК: 040813770</p>
            <p>К/с: 30101810800000000770</p>
            <p>Р/с: 40702810020000004729</p>
          </div>

          <div className="flex flex-col justify-end lg:items-end gap-6">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-white/10">River Club 2026 © Excellence in Motion</p>
            
            {/* DESIGNED BY DONT ASK STUDIO */}
            <a 
              href="https://dontask.studio/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 group/credit"
            >
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest transition-colors group-hover/credit:text-white/40">DESIGNED BY</span>
              <div className="flex items-center gap-0.5 text-[11px] md:text-[13px] font-black italic uppercase transition-all group-hover/credit:tracking-[0.1em]">
                <span className="text-white">DONT</span>
                <span className="text-[#6768E8] ml-1">ASK</span>
                <span className="ml-1 flex">
                  <span className="studio-outline">STU</span>
                  <span className="text-white">D</span>
                  <span className="studio-outline">IO</span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
