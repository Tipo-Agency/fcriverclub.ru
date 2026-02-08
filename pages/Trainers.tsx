import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Waves, Baby, Dumbbell, Users, X } from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { TRAINER_CATEGORIES } from '../constants/trainersData';
import type { Trainer } from '../types';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  pool: Waves,
  kids: Baby,
  gym: Dumbbell,
  group: Users,
};

const TrainerCard: React.FC<{ trainer: Trainer; index: number }> = ({ trainer, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className="group bg-white rounded-premium border border-black/5 overflow-hidden hover:border-river hover:shadow-xl transition-all duration-500"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-river-light/10">
          {!imgError ? (
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-river-dark/30 text-6xl font-bold">
              {trainer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-xs font-bold uppercase tracking-widest text-white/80">{trainer.role}</p>
            <p className="text-lg font-extrabold leading-tight mt-1">{trainer.name}</p>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-extrabold text-river-dark">{trainer.name}</h3>
          <p className="text-river text-sm font-bold uppercase tracking-wider mt-1">{trainer.role}</p>
          <p className="text-river-gray text-sm font-medium mt-3 line-clamp-3">{trainer.specialization}</p>
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-4 text-river text-xs font-bold uppercase tracking-widest hover:underline"
          >
            Подробнее
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-premium max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-[3/4] max-h-80 overflow-hidden">
                {!imgError ? (
                  <img src={trainer.image} alt={trainer.name} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-river-dark/30 text-6xl font-bold bg-river-light/10">
                    {trainer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-river-dark hover:bg-white"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-extrabold text-river-dark">{trainer.name}</h3>
                <p className="text-river font-bold uppercase tracking-wider mt-1">{trainer.role}</p>
                {trainer.credentials && (
                  <div className="mt-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-river-gray mb-2">Регалии</h4>
                    <p className="text-river-dark text-sm leading-relaxed">{trainer.credentials}</p>
                  </div>
                )}
                {trainer.education && (
                  <div className="mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-river-gray mb-2">Образование</h4>
                    <p className="text-river-dark text-sm leading-relaxed">{trainer.education}</p>
                  </div>
                )}
                <div className="mt-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-river-gray mb-2">Направление</h4>
                  <p className="text-river-dark text-sm leading-relaxed whitespace-pre-line">{trainer.specialization}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Trainers: React.FC = () => {
  return (
    <div className="bg-white">
      <Hero />

      <section className="py-24 md:py-40 px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-24 space-y-6">
            <h2 className="text-5xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">
              Тренеры
            </h2>
            <p className="text-river-gray text-xl max-w-3xl font-medium leading-relaxed">
              Наши специалисты — мастера своего дела с профильным образованием и многолетним опытом.
            </p>
          </div>

          {TRAINER_CATEGORIES.map(category => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <div key={category.id} className="mb-24 last:mb-0">
                <div className="flex items-center gap-4 mb-10">
                  {Icon && (
                    <div className="w-14 h-14 rounded-2xl bg-river/10 flex items-center justify-center text-river">
                      <Icon size={28} />
                    </div>
                  )}
                  <h3 className="text-3xl md:text-4xl font-extrabold text-river-dark uppercase tracking-tighter">
                    {category.title}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {category.trainers.map((trainer, idx) => (
                    <TrainerCard key={trainer.id} trainer={trainer} index={idx} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Trainers;
