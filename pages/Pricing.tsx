import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Waves } from 'lucide-react';
import { PRICING_PLANS } from '../constants';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { Hero } from '../components/home/Hero';
import { useFeedback } from '../contexts/FeedbackContext';

const Pricing: React.FC = () => {
  const { openModal } = useFeedback();

  const vipPlans = PRICING_PLANS.filter(p => p.category === 'VIP');
  const standardPlans = PRICING_PLANS.filter(p => p.category === 'STANDARD');

  return (
    <div className="bg-white">
      <Hero />

      {/* SECTION: КЛУБНЫЕ КАРТЫ */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">КЛУБНЫЕ КАРТЫ</h2>
            <p className="text-river-gray text-xl max-w-3xl font-medium leading-relaxed">
              Инвестиция в статус и здоровье. Мы не продаем абонементы, мы создаем среду для успеха.
            </p>
          </div>

          {/* VIP SECTION */}
          <div className="mb-24 md:mb-32">
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px bg-river/20 flex-1"></div>
              <div className="flex items-center gap-3 text-river font-black uppercase tracking-widest text-xs">
                <Crown size={20} /> VIP КАРТЫ
              </div>
              <div className="h-px bg-river/20 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {vipPlans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="relative p-12 md:p-16 rounded-premium bg-river text-white overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-river-accent/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="relative z-10 space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase">{plan.name}</h3>
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 rounded-full text-white/90 text-xs font-bold uppercase tracking-widest border border-white/20">
                        <Waves size={16} /> {plan.poolType}
                      </div>
                    </div>
                    
                    <ul className="space-y-4">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-4 text-white/80 text-sm font-medium">
                          <Check className="text-river-accent mt-0.5 shrink-0" size={20} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4">
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">{plan.period}</p>
                      <button 
                        onClick={() => openModal(`Запрос условий: ${plan.name}`)}
                        className="bg-white text-river py-4 px-12 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-river-accent hover:text-white transition-all duration-500 shadow-xl w-full sm:w-auto"
                      >
                        Обсудить условия
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* STANDARD SECTION */}
          <div>
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px bg-black/5 flex-1"></div>
              <div className="text-river-gray font-black uppercase tracking-widest text-xs">
                СТАНДАРТНЫЕ КАРТЫ
              </div>
              <div className="h-px bg-black/5 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {standardPlans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-12 md:p-16 rounded-premium bg-river-light border border-black/5 hover:border-river/30 transition-all duration-500 hover:shadow-2xl group"
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-extrabold text-river-dark uppercase tracking-tighter">{plan.name}</h3>
                      <div className="flex items-center gap-3 text-river-gray text-xs font-bold uppercase tracking-widest">
                        <Waves size={16} className="text-river" /> {plan.poolType}
                      </div>
                      <p className="text-river-gray/60 text-xs font-bold uppercase tracking-widest">{plan.period}</p>
                    </div>

                    <ul className="space-y-4">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-4 text-river-gray text-sm font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-river mt-2 shrink-0"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <LuxuryButton 
                      variant="solid"
                      onClick={() => openModal(`Запрос условий: ${plan.name}`)}
                      className="w-full h-16 shadow-xl"
                    >
                      Узнать стоимость
                    </LuxuryButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
