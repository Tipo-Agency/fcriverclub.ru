
import React from 'react';
import { motion } from 'framer-motion';

const IMAGES = [
  "/L_height.webp",
  "/L_height (1).webp",
  "/L_height (2).webp",
  "/L_height (3).webp",
  "/L_height (4).webp",
  "/gallery_0.webp"
];

export const Gallery: React.FC = () => {
  return (
    <section className="py-40 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
          <h2 className="text-6xl md:text-8xl font-extrabold text-river-dark tracking-tighter leading-none uppercase">Эстетика <br/> <span className="text-river">результата</span></h2>
          <p className="text-river-gray max-w-sm text-xl font-medium">Безупречный дизайн каждого метра пространства для вашего вдохновения.</p>
        </div>
        
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {IMAGES.map((img, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="relative overflow-hidden rounded-premium group shadow-lg hover:shadow-2xl transition-all duration-700"
            >
              <img 
                src={img} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="River Interior" 
              />
              <div className="absolute inset-0 bg-river/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
