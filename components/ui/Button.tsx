
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = "",
  icon
}) => {
  const baseStyles = "relative overflow-hidden rounded-pill font-header text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold transition-all duration-500 flex items-center justify-center gap-4 py-5 px-10 md:px-14";
  
  const variants = {
    primary: "bg-river-gold text-river-dark btn-gold-hover",
    outline: "border border-river-gold/30 text-river-gold hover:bg-river-gold hover:text-river-dark",
    ghost: "bg-white/5 text-white hover:bg-white/10"
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
      {icon && <span className="opacity-70">{icon}</span>}
    </motion.button>
  );
};
