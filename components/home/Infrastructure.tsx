
import React from 'react';
import { motion } from 'framer-motion';
import { SERVICES } from '../../constants';
import { ArrowRight } from 'lucide-react';

export const Infrastructure: React.FC = () => {
  return (
    <section className="py-40 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="space-y-6">
            <div className="w-20 h-1 bg-river rounded-full"></div>
            <h2 className="text-6xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none">Зоны <br/> клуба</h2>
          </div>
          <p className="text-river-gray max-w-sm text-xl font-medium leading-relaxed">
            Каждое пространство спроектировано с учетом мировых стандартов биомеханики и комфорта.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {SERVICES.map((service, idx) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-premium overflow-hidden mb-10 shadow-sm transition-shadow group-hover:shadow-2xl">
                <img 
                  src={service.image} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt={service.title} 
                />
                <div className="absolute inset-0 bg-river/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="space-y-4 px-2">
                <h4 className="text-3xl font-extrabold text-river-dark flex items-center gap-4 transition-colors group-hover:text-river">
                  {service.title}
                  <ArrowRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h4>
                <p className="text-river-gray text-base leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
