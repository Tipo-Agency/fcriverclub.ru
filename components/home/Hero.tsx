
import React from 'react';
import { motion } from 'framer-motion';
import { LuxuryButton } from '../ui/LuxuryButton';
import { Play } from 'lucide-react';
import { useFeedback } from '../../contexts/FeedbackContext';

export const Hero: React.FC = () => {
  const { openModal } = useFeedback();
  
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-white pt-32 pb-20">
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Левая часть - текст */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 md:space-y-12 text-center lg:text-left"
          >
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-extrabold leading-[1.15] md:leading-[1.1] tracking-tight text-river-dark uppercase">
                ПРЕМИАЛЬНЫЙ <br /> 
                <span className="text-river">ФИТНЕС КЛУБ</span> <br /> 
                <span className="text-river-gray italic font-medium lowercase first-letter:uppercase block sm:inline-block">
                  ДЛЯ ТРЕБОВАТЕЛЬНЫХ.
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-river-gray font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Первый многофункциональный фитнес-центр в Хабаровске, построенный по мировым стандартам комфорта.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4">
              <LuxuryButton onClick={() => openModal("Получить предложение")} className="w-full sm:w-auto h-16 md:h-20 px-12 md:px-16 text-base md:text-lg shadow-xl">
                Получить предложение
              </LuxuryButton>
              <button className="group flex items-center gap-4 text-river-dark font-bold text-sm tracking-widest uppercase transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-river group-hover:text-white transition-all shadow-lg bg-white">
                  <Play size={18} fill="currentColor" />
                </div>
                <span>Смотреть видео</span>
              </button>
            </div>
          </motion.div>

          {/* Правая часть - изображение */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] md:h-[600px] lg:h-[700px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl"
          >
            <img 
              src="/хероблок.jpeg" 
              className="w-full h-full object-cover"
              alt="River Premium"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
