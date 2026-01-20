
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Gift, Crown, Waves, CakeSlice, PartyPopper, ChevronRight, Baby, Trophy, Music, Sword, Heart, ArrowRight } from 'lucide-react';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { KIDS_DIRECTIONS } from '../constants';
import { useFeedback } from '../contexts/FeedbackContext';
import { sendLeadTo1C, type LeadData } from '../services/leadService';
import { handlePhoneChange } from '../utils/phoneMask';

const LeadFormKids: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Пожалуйста, укажите имя');
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
      subject: 'River Kids: Запись на визит',
    };

    const result = await sendLeadTo1C(leadData);

    setIsSubmitting(false);

    if (result.success) {
      alert('Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
      setName('');
      setPhone('');
    } else {
      setError(result.message || 'Ошибка отправки заявки. Попробуйте позже.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-river-dark/30 uppercase tracking-widest ml-1">Имя родителя</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-river-light border border-black/5 rounded-2xl px-6 py-5 text-river-dark font-bold focus:border-river-accent outline-none transition-all" 
          placeholder="Александр"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-river-dark/30 uppercase tracking-widest ml-1">Телефон</label>
        <input 
          type="tel" 
          value={phone}
          onChange={(e) => handlePhoneChange(e, setPhone)}
          className="w-full bg-river-light border border-black/5 rounded-2xl px-6 py-5 text-river-dark font-bold focus:border-river-accent outline-none transition-all" 
          placeholder="+7 (999) 000-00-00"
          required
        />
      </div>
      <button 
        type="submit"
        disabled={isSubmitting}
        className="w-full h-20 bg-river text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-river-accent transition-all shadow-xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'} <ArrowRight size={20} />
      </button>
    </form>
  );
};

const QUICK_LINKS = [
  { id: 1, title: 'Водные программы', icon: <Waves /> },
  { id: 2, title: 'Боевые дисциплины', icon: <Sword /> },
  { id: 3, title: 'Детский клуб', icon: <Baby /> },
  { id: 4, title: 'Танцевальные направления', icon: <Music /> }
];

const BIRTHDAY_FEATURES = [
  { id: 1, title: 'Герои', icon: <Star />, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 2, title: 'Шоу', icon: <PartyPopper />, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 3, title: 'Фокусы', icon: <Crown />, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 4, title: 'Сладости', icon: <CakeSlice />, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 5, title: 'Бассейн', icon: <Waves />, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 6, title: 'Подарок', icon: <Gift />, color: 'text-yellow-600', bg: 'bg-yellow-50' }
];

const RiverKids: React.FC = () => {
  const { openModal } = useFeedback();
  const [activeFilter, setActiveFilter] = useState('Все');
  const [visibleCount, setVisibleCount] = useState(10);

  const filters = ['Все', 'Тренировки от 5 лет', 'Тренировки от 8 лет', 'Тренировки от 13 лет', 'Водные программы', 'Секции'];
  
  const filterMapping: Record<string, string> = {
    'Все': 'Все',
    'Тренировки от 5 лет': '5+',
    'Тренировки от 8 лет': '8+',
    'Тренировки от 13 лет': '13+',
    'Водные программы': 'Вода',
    'Секции': 'Секции'
  };

  const filteredDirections = useMemo(() => {
    return activeFilter === 'Все' 
      ? KIDS_DIRECTIONS 
      : KIDS_DIRECTIONS.filter(d => d.category === filterMapping[activeFilter]);
  }, [activeFilter]);

  const displayedDirections = filteredDirections.slice(0, visibleCount);

  return (
    <div className="bg-white overflow-hidden">
      {/* HERO SECTION - REFINED PROPORTIONS */}
      <section className="relative min-h-[85vh] flex items-center bg-[#4CB5B1] overflow-hidden pt-24 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          <div className="flex-1 space-y-12 text-center lg:text-left">
            <div className="space-y-6">
              <span className="text-white/80 font-black uppercase tracking-[0.4em] text-[10px] block">Premium Kids Fitness</span>
              <h1 className="text-5xl md:text-8xl lg:text-[90px] font-black text-white leading-[0.9] tracking-tighter uppercase">
                RIVER <br/> <span className="text-white/40">KIDS</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-bold max-w-lg leading-relaxed mx-auto lg:mx-0">
                Создаем фундамент для большого будущего через игру, спорт и профессиональное плавание.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {QUICK_LINKS.map(link => (
                <div key={link.id} className="flex flex-col items-center gap-3 group cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#4CB5B1] transition-all duration-500 shadow-xl">
                    {React.cloneElement(link.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-wider text-center max-w-[80px] leading-tight opacity-80">
                    {link.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <button 
                onClick={() => openModal("Записаться в River Kids")}
                className="bg-white text-river h-20 px-16 rounded-full font-black uppercase tracking-widest text-xs hover:bg-river-dark hover:text-white transition-all shadow-2xl"
              >
                Записаться
              </button>
              <button className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs group">
                <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center bg-white/10 group-hover:bg-white group-hover:text-river transition-all">
                  <Play size={20} fill="currentColor" />
                </div>
                Видео клуба
              </button>
            </div>
          </div>
          
          <div className="relative w-full max-w-xl lg:w-[45%]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 w-full aspect-[4/5] rounded-[60px] lg:rounded-[80px] overflow-hidden border-[10px] border-white/20 shadow-2xl"
            >
              <img 
                src="/хероблок.jpeg" 
                className="w-full h-full object-cover" 
                alt="River Kids Hero" 
              />
            </motion.div>
            
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-yellow-300 rounded-full flex flex-col items-center justify-center shadow-2xl p-4 text-center animate-bounce z-20">
               <Waves size={28} className="text-river mb-1" />
               <span className="text-[9px] font-black uppercase tracking-tighter text-river leading-tight">Elite <br/> Aqua Area</span>
            </div>
          </div>
        </div>
      </section>

      {/* DIRECTIONS CATALOG - IMPLEMENTED LOAD MORE */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center space-y-12 mb-24">
            <div className="space-y-4">
              <span className="text-river-accent font-black uppercase tracking-[0.4em] text-[10px]">Development</span>
              <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-river-dark tracking-tighter uppercase leading-none italic">НАПРАВЛЕНИЯ</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
               {filters.map(filter => (
                 <button 
                   key={filter}
                   onClick={() => {
                     setActiveFilter(filter);
                     setVisibleCount(10); // Reset count on filter change
                   }}
                   className={`px-8 py-5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500 border-2 ${activeFilter === filter ? 'bg-river border-river text-white shadow-2xl' : 'border-black/5 text-river-dark/40 hover:border-river/20 hover:text-river'}`}
                 >
                   {filter}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedDirections.map((dir, idx) => (
                <motion.div 
                  layout
                  key={dir.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group"
                >
                  <div className="aspect-[4/5] rounded-[40px] overflow-hidden mb-5 relative shadow-md group-hover:shadow-2xl transition-all duration-700 bg-river-light border border-black/5">
                    <img src={dir.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={dir.title} />
                  </div>
                  <div className="text-center px-2">
                    <h4 className="text-xl font-black text-river-dark uppercase tracking-tight group-hover:text-river transition-colors leading-tight">
                      {dir.title}
                    </h4>
                    <span className="text-river-accent font-black text-[9px] uppercase tracking-widest block mt-1">{dir.age}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {visibleCount < filteredDirections.length && (
            <div className="mt-20 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="inline-flex items-center gap-4 bg-river-light text-river-dark px-12 py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-river hover:text-white transition-all shadow-lg"
              >
                Показать еще <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* BIRTHDAY SECTION - REFINED LAYOUT & IMAGES */}
      <section className="py-24 md:py-40 bg-river-light relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-16">
              <div className="space-y-6">
                <span className="text-[#4CB5B1] font-black uppercase tracking-[0.4em] text-[10px]">Celebration</span>
                <h2 className="text-5xl md:text-8xl font-black text-river-dark tracking-tighter leading-none uppercase">
                  ДЕНЬ РОЖДЕНИЯ <br/> <span className="text-[#4CB5B1]">B RIVER CLUB</span>
                </h2>
                <p className="text-river-gray text-xl font-medium max-w-xl">
                  Идеальное торжество без лишних забот. Профессиональная анимация, аква-вечеринки и авторское меню для детей.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                 {BIRTHDAY_FEATURES.map(f => (
                   <div key={f.id} className="p-6 bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 group flex flex-col items-center text-center">
                      <div className={`w-14 h-14 rounded-full ${f.bg} flex items-center justify-center ${f.color} mb-4 group-hover:scale-110 transition-transform`}>
                         {React.cloneElement(f.icon as React.ReactElement, { size: 24 })}
                      </div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-river-dark">{f.title}</h5>
                   </div>
                 ))}
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                 <LuxuryButton onClick={() => openModal("River Kids: День рождения")} className="h-20 px-16 shadow-2xl text-base">Узнать подробности</LuxuryButton>
                 <button className="h-20 px-16 rounded-full border-2 border-river-dark text-river-dark font-black uppercase tracking-widest text-xs hover:bg-river-dark hover:text-white transition-all">Тарифы праздника</button>
              </div>
            </div>

            <div className="relative">
               <div className="rounded-[80px] h-[700px] relative overflow-hidden shadow-2xl group">
                  <img 
                    src="/5w2ageDNzGQIUPTCEOHiQ.jpg" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt="Birthday Party" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                     <button className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:scale-110 hover:bg-white hover:text-river transition-all shadow-2xl">
                        <Play size={32} fill="currentColor" className="ml-1" />
                     </button>
                  </div>

                  <div className="absolute bottom-12 left-12 right-12">
                     <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-4">ВАШ ИДЕАЛЬНЫЙ <br/> ПРАЗДНИК</h3>
                     <p className="text-white/70 text-lg font-bold">Организация торжества под ключ от лучших аниматоров города.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIFE IN ACTION GALLERY - KIDS ONLY PHOTOS */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-24 flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="space-y-4">
              <span className="text-river font-black uppercase tracking-[0.4em] text-[10px]">Gallery</span>
              <h2 className="text-5xl md:text-9xl font-black text-river-dark tracking-tighter uppercase leading-none italic">LIFE IN <span className="text-river">ACTION</span></h2>
            </div>
            <p className="text-river-gray max-w-sm text-xl font-medium">Только реальные эмоции и достижения наших маленьких чемпионов.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px]">
             <div className="md:col-span-5 rounded-[60px] overflow-hidden shadow-xl group">
                <img src="/cec464460827989a0951bf87830a9d89_640.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Kid Action 1" />
             </div>
             <div className="md:col-span-7 grid grid-rows-2 gap-6">
                <div className="rounded-[60px] overflow-hidden shadow-xl group">
                   <img src="/0B6A8602_resized.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Kid Action 2" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="rounded-[40px] overflow-hidden shadow-xl group">
                      <img src="/1651574270_01.jpeg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Kid Action 3" />
                   </div>
                   <div className="rounded-[40px] overflow-hidden shadow-xl group">
                      <img src="/1651574206_05.jpeg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Kid Action 4" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA - REDESIGNED WITHOUT WAVES, PREMIUM STYLE */}
      <section className="relative py-32 md:py-52 bg-river overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-river-accent/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-[1440px] mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-12">
               <div className="space-y-6">
                  <span className="text-river-accent font-black uppercase tracking-[0.4em] text-[10px]">Registration</span>
                  <h2 className="text-5xl md:text-[80px] font-black text-white tracking-tighter uppercase leading-[0.85]">
                    ПРИСОЕДИНЯЙТЕСЬ <br/> <span className="text-river-accent italic">К RIVER KIDS</span>
                  </h2>
                  <p className="text-white/60 text-xl font-bold max-w-xl">Оставьте заявку на вводную тренировку и получите экскурсию по клубу в подарок.</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                  <div className="space-y-2">
                     <span className="text-river-accent font-black text-[10px] uppercase tracking-widest">Адрес</span>
                     <p className="text-white font-bold">Хабаровск, ул. Советская, 1 к4</p>
                  </div>
                  <div className="space-y-2">
                     <span className="text-river-accent font-black text-[10px] uppercase tracking-widest">Телефон</span>
                     <p className="text-white font-bold">+7 (421) 272-82-92</p>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-[450px] bg-white p-10 md:p-14 rounded-[50px] shadow-2xl relative">
               <div className="absolute -top-6 -right-6 w-20 h-20 bg-river-accent rounded-full flex items-center justify-center text-river shadow-xl">
                  <Star size={32} />
               </div>
               
               <h3 className="text-3xl font-black text-river-dark uppercase tracking-tighter mb-8 leading-none">ЗАПИСАТЬСЯ <br/> НА ВИЗИТ</h3>
               
               <LeadFormKids />
               
               <p className="text-[9px] text-river-dark/40 font-bold uppercase tracking-widest mt-8 text-center leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь с правилами <br/> обработки персональных данных.
               </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default RiverKids;
