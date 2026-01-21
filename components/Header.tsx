
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useFeedback } from '../contexts/FeedbackContext';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { openModal } = useFeedback();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Клуб', path: '/' },
    { name: 'RIVER KIDS', path: '/kids' },
    { name: 'Направления', path: '/services' },
    { name: 'Карты', path: '/pricing' },
    { name: 'Расписание', path: '/schedule' }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 px-4 md:px-12 ${isScrolled ? 'py-3' : 'py-6 md:py-10'}`}>
        <div className={`max-w-[1440px] mx-auto flex justify-between items-center transition-all duration-700 ${isScrolled ? 'glass-light px-6 py-2 rounded-full soft-shadow' : ''}`}>
          <Link to="/" className="flex items-center group">
            <img 
              src="/logo.svg" 
              alt="RIVER CLUB" 
              className="h-8 md:h-10 transition-transform group-hover:scale-105"
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={`text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${pathname === link.path ? 'text-river underline decoration-2 underline-offset-8' : 'text-river-dark/50 hover:text-river-dark'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => openModal("Вступить в клуб")} className="hidden sm:flex bg-river text-white px-8 py-3 rounded-full text-[11px] font-bold hover:shadow-lg transition-all items-center gap-2">
              Вступить <ArrowRight size={14} />
            </button>
            <button onClick={() => setIsOpen(true)} className="p-2 text-river-dark hover:scale-110 transition-transform">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-20">
              <img 
                src="/logo.svg" 
                alt="RIVER CLUB" 
                className="h-8"
              />
              <button onClick={() => setIsOpen(false)} className="bg-river-light p-4 rounded-full text-river-dark hover:rotate-90 transition-transform">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-6 md:gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl md:text-6xl font-extrabold text-river-dark hover:text-river transition-colors tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-black/5">
               <a href="tel:+74212728292" className="text-river-gray text-sm font-bold uppercase tracking-widest mb-4 hover:text-river transition-colors block">+7 (421) 272-82-92</a>
               <p className="text-river-dark/40 text-[10px] font-bold uppercase tracking-widest">Хабаровск, ул. Советская, 1 к4</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
