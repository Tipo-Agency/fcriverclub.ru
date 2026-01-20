
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/home/Hero';
import { Gallery } from '../components/home/Gallery';
import { ClubEvents } from '../components/home/ClubEvents';
import { FinalCTA } from '../components/home/FinalCTA';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { BENEFITS, FITNESS_ZONES, NEWS } from '../constants';
import * as LucideIcons from 'lucide-react';
import { useFeedback } from '../contexts/FeedbackContext';
import { sendLeadTo1C, type LeadData } from '../services/leadService';
import { handlePhoneChange } from '../utils/phoneMask';

const LeadForm: React.FC<{ subject: string }> = ({ subject }) => {
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
    } else {
      setError(result.message || 'Ошибка отправки заявки. Попробуйте позже.');
    }
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8" onSubmit={handleSubmit}>
      {error && (
        <div className="sm:col-span-2 bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}
      <div className="relative group">
        <input 
          type="text" 
          placeholder="Ваше имя" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 md:py-6 focus:border-river-accent outline-none text-lg md:text-xl transition-all placeholder:text-white/20" 
          required
        />
      </div>
      <div className="relative group">
        <input 
          type="tel" 
          placeholder="+7 (___) ___-__-__" 
          value={phone}
          onChange={(e) => handlePhoneChange(e, setPhone)}
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 md:py-6 focus:border-river-accent outline-none text-lg md:text-xl transition-all placeholder:text-white/20" 
          required
        />
      </div>
      <div className="sm:col-span-2 pt-4">
        <LuxuryButton 
          type="submit"
          disabled={isSubmitting}
          className="bg-river-accent text-river-dark w-full sm:w-auto h-20 px-20 text-xl uppercase shadow-2xl hover:shadow-river-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </LuxuryButton>
      </div>
    </form>
  );
};

const Home: React.FC = () => {
  const { openModal } = useFeedback();
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 20, minutes: 36, seconds: 43 });

  useEffect(() => {
    // Устанавливаем целевую дату: текущее время + 5 дней 20 часов 36 минут 43 секунды
    const initialDays = 5;
    const initialHours = 20;
    const initialMinutes = 36;
    const initialSeconds = 43;
    
    const targetDate = new Date().getTime() + 
      (initialDays * 24 * 60 * 60 * 1000) +
      (initialHours * 60 * 60 * 1000) +
      (initialMinutes * 60 * 1000) +
      (initialSeconds * 1000);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Запускаем только один раз при монтировании

  const formatTime = (value: number) => value.toString().padStart(2, '0');
  
  return (
    <div className="bg-white">
      <Hero />
      
      {/* SECTION: О КЛУБЕ (Benefits Grid) */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
            <div className="space-y-10">
              <h2 className="text-5xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">
                О КЛУБЕ
              </h2>
              <p className="text-river-gray text-xl font-medium leading-relaxed max-w-xl">
                RIVER CLUB — это первый многофункциональный фитнес-центр премиум класса в Хабаровске, построенный с нуля с учетом мирового опыта.
              </p>
              <LuxuryButton onClick={() => openModal("Записаться в клуб")} variant="solid" className="h-16 px-14">Записаться</LuxuryButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-8">
              {BENEFITS.map((item) => {
                const Icon = (LucideIcons as any)[item.icon] || LucideIcons.Zap;
                return (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-16 h-16 bg-river/5 rounded-2xl flex items-center justify-center text-river group-hover:bg-river group-hover:text-white transition-all duration-500">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-extrabold text-river-dark">{item.title}</h4>
                      <p className="text-river-gray text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PROMO (Timer/Gift) */}
      <section className="py-24 md:py-40 bg-river-light relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-video lg:aspect-square rounded-super overflow-hidden shadow-2xl order-2 lg:order-1">
            <img 
              src="/60d.jpg" 
              className="w-full h-full object-cover" 
              alt="Promo" 
            />
            <div className="absolute inset-0 bg-river/10"></div>
          </div>
          
          <div className="space-y-12 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="text-5xl font-extrabold text-river tabular-nums tracking-tighter">
                {timeLeft.days}:{formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-river-dark tracking-tighter leading-[0.9] uppercase">
                +60 ДНЕЙ <br/> РОСКОШНОГО <br/> <span className="text-river">ФИТНЕСА</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-8 border-y border-black/5 py-10">
              <div className="space-y-2">
                <span className="text-river font-bold text-xs uppercase tracking-widest">+ Привилегии</span>
                <p className="text-river-gray text-sm font-medium italic">Персональный менеджер</p>
              </div>
              <div className="space-y-2">
                <span className="text-river font-bold text-xs uppercase tracking-widest">+ Тренировки</span>
                <p className="text-river-gray text-sm font-medium italic">3 вводных занятия</p>
              </div>
            </div>

            <LuxuryButton onClick={() => openModal("Получить предложение (+60 дней)")} className="h-20 w-full text-lg shadow-2xl">Получить предложение</LuxuryButton>
          </div>
        </div>
      </section>

      {/* SECTION: ФИТНЕС-ЗОНЫ */}
      <section className="py-24 md:py-40 px-6 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">ФИТНЕС-ЗОНЫ</h2>
            <p className="text-river-gray text-xl max-w-3xl font-medium leading-relaxed">
              От панорамного бассейна до профессионального бойцовского ринга. Каждая деталь продумана экспертами.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FITNESS_ZONES.map((zone, idx) => (
              <motion.div 
                key={zone.id}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-premium overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  <img src={zone.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={zone.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h4 className="text-2xl font-extrabold text-river-dark uppercase group-hover:text-river transition-colors">{zone.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: GALLERY */}
      <Gallery />

      {/* SECTION: ДРУГОЙ КЛУБ (Lead Form) */}
      <section className="py-20 md:py-40 bg-river-dark text-white rounded-[40px] md:rounded-[60px] mx-4 md:mx-6 mb-10 overflow-hidden relative border border-white/5">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-10 md:opacity-20 grayscale pointer-events-none">
          <img src="/2ce1495c-ff2a-477e-af07-8cb0841908ac.jpg" className="w-full h-full object-cover" alt="" />
        </div>
        
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl space-y-8 md:space-y-12">
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-[0.9] uppercase">
              ЗАНИМАЕТЕСЬ В <br/> <span className="text-river-accent italic">ДРУГОМ КЛУБЕ?</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium max-w-xl">Оставьте заявку и получите персональные условия перехода в River.</p>
            
            <LeadForm subject="Переход из другого клуба" />
          </div>
        </div>
      </section>

      {/* NEW SECTION: CLUB EVENTS */}
      <ClubEvents />

      {/* SECTION: НОВОСТИ */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-5xl md:text-7xl font-extrabold text-river-dark tracking-tighter mb-24 uppercase">НОВОСТИ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {NEWS.map((item) => (
              <div key={item.id} className="group cursor-pointer space-y-6">
                <div className="aspect-[16/9] rounded-premium overflow-hidden border border-black/5">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                </div>
                <div className="space-y-3">
                  <span className="text-river font-bold text-[10px] uppercase tracking-widest">{item.date}</span>
                  <h4 className="text-2xl font-extrabold text-river-dark leading-tight uppercase group-hover:text-river transition-colors">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: APP PROMO */}
      <section className="py-24 md:py-40 px-6 mb-20">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-gradient-to-br from-river via-river to-[#083937] rounded-[60px] p-12 md:p-24 relative overflow-hidden">
            {/* Декоративные элементы */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-river-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Левая часть - текст и кнопки */}
              <div className="space-y-12 text-white">
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none uppercase">
                    RIVER <br /> FITNESS APP
                  </h2>
                  <p className="text-white/70 text-xl md:text-2xl font-medium leading-relaxed max-w-xl">
                    Быстрая запись, актуальное расписание и контроль абонемента в одном касании.
                  </p>
                </div>

                {/* Кнопки магазинов */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <a 
                    href="#" 
                    className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 hover:bg-white hover:text-river transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    <span className="font-extrabold uppercase tracking-widest text-sm">App Store</span>
                    <LucideIcons.ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href="#" 
                    className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 hover:bg-white hover:text-river transition-all duration-500 flex items-center justify-center gap-4"
                  >
                    <span className="font-extrabold uppercase tracking-widest text-sm">Google Play</span>
                    <LucideIcons.ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Преимущества приложения */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div className="space-y-2">
                    <div className="text-3xl font-extrabold text-white">24/7</div>
                    <p className="text-white/60 text-sm font-medium">Доступ всегда</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-extrabold text-white">Быстро</div>
                    <p className="text-white/60 text-sm font-medium">Запись за секунды</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-extrabold text-white">Удобно</div>
                    <p className="text-white/60 text-sm font-medium">Все в одном месте</p>
                  </div>
                </div>
              </div>

              {/* Правая часть - изображение телефона */}
              <div className="relative flex items-center justify-center overflow-visible" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <img 
                  src="/мобильное приложение-Photoroom.png" 
                  className="w-full h-auto max-h-[600px] object-contain" 
                  style={{ 
                    filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.3))'
                  }}
                  alt="RIVER FITNESS APP Preview"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: FINAL CTA (FROM SCREENSHOT) */}
      <FinalCTA />
    </div>
  );
};

export default Home;
