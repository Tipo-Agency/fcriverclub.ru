import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Waves, Dumbbell, Users, Sword, Baby, Heart } from 'lucide-react';
import { FITNESS_ZONES } from '../constants';
import { useFeedback } from '../contexts/FeedbackContext';
import { LuxuryButton } from '../components/ui/LuxuryButton';
import { Hero } from '../components/home/Hero';

// Расширенные направления с деталями
const DIRECTIONS = [
  {
    ...FITNESS_ZONES.find(z => z.id === 'pool')!,
    icon: Waves,
    features: ['Открытый бассейн на крыше', 'Закрытый бассейн 25м', 'Хаммам', 'Финская сауна', 'Турецкая баня', 'Джакузи']
  },
  {
    ...FITNESS_ZONES.find(z => z.id === 'gym')!,
    icon: Dumbbell,
    features: ['Тренажеры Precor', 'Тренажеры Hoist', 'Свободные веса', 'Кардиозона', 'Функциональная зона']
  },
  {
    ...FITNESS_ZONES.find(z => z.id === 'group')!,
    icon: Users,
    features: ['Более 40 направлений', 'Йога', 'Пилатес', 'Кроссфит', 'Танцы', 'Cycle', 'TRX', 'HIIT']
  },
  {
    ...FITNESS_ZONES.find(z => z.id === 'fight')!,
    icon: Sword,
    features: ['Бойцовский ринг', 'Татами', 'Мастера спорта', 'Бокс', 'ММА', 'Самбо', 'Дзюдо']
  },
  {
    ...FITNESS_ZONES.find(z => z.id === 'yoga')!,
    icon: Heart,
    features: ['Хатха йога', 'Виньяса флоу', 'Йога Айенгара', 'Пилатес', 'Стретчинг', 'Медитация']
  },
  {
    ...FITNESS_ZONES.find(z => z.id === 'kids')!,
    icon: Baby,
    features: ['Программы для детей', '2 бассейна', 'Безопасная среда', 'Профессиональные тренеры', 'Развивающие занятия']
  }
];

const Directions: React.FC = () => {
  const { openModal } = useFeedback();

  return (
    <div className="bg-white">
      {/* Hero секция */}
      <Hero />

      {/* SECTION: НАПРАВЛЕНИЯ */}
      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">НАПРАВЛЕНИЯ</h2>
            <p className="text-river-gray text-xl max-w-3xl font-medium leading-relaxed">
              От панорамного бассейна до профессионального бойцовского ринга. Каждая деталь продумана экспертами.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DIRECTIONS.map((direction, idx) => {
              const IconComponent = direction.icon;
              return (
                <motion.div
                  key={direction.id}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] rounded-premium overflow-hidden mb-8 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img
                      src={direction.image}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt={direction.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <h4 className="text-2xl font-extrabold text-river-dark uppercase group-hover:text-river transition-colors">{direction.title}</h4>
                  <p className="text-river-gray text-base font-medium mt-2 leading-relaxed">
                    {direction.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Directions;

