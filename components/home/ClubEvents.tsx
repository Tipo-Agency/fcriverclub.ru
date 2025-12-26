
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music, GlassWater, Star } from 'lucide-react';

const CLUB_VIDEOS = [
  { id: 1, poster: "/slide-01.jpg", title: "Rooftop Party" },
  { id: 2, poster: "/slide-06.jpg", title: "Gastro Night" },
  { id: 3, poster: "/2ce1495c-ff2a-477e-af07-8cb0841908ac.jpg", title: "Community" }
];

export const ClubEvents: React.FC = () => {
  return (
    <section className="py-16 bg-river-dark text-white overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="space-y-2">
            <span className="text-river-accent font-bold uppercase tracking-[0.4em] text-[10px]">Lifestyle Community</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-none uppercase">
              БОЛЬШЕ ЧЕМ <span className="text-river-accent italic">ФИТНЕС</span>
            </h2>
          </div>
          <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm md:text-right">
            Закрытые вечеринки на крыше, гастрономические вечера и сообщество успешных людей.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {CLUB_VIDEOS.map((v, i) => (
            <motion.div 
              key={v.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10"
            >
              <img 
                src={v.poster} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                alt={v.title} 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-river-dark/80 via-transparent to-transparent"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold uppercase tracking-widest">{v.title}</h4>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-river-accent group-hover:text-river-dark transition-all">
                    <Play size={10} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-8 items-center justify-center border-t border-white/5 pt-8">
          <div className="flex items-center gap-3 text-white/40">
            <GlassWater size={16} className="text-river-accent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Rooftop Sunsets</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <Star size={16} className="text-river-accent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Master Classes</span>
          </div>
          <div className="flex items-center gap-3 text-white/40">
            <Music size={16} className="text-river-accent" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Secret DJ Sets</span>
          </div>
        </div>
      </div>
    </section>
  );
};
