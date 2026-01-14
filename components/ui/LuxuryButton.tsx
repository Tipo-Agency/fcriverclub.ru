
import React from 'react';
import { motion } from 'framer-motion';

interface LuxuryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'minimal';
  className?: string;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'solid', 
  className = "" 
}) => {
  const base = "relative px-10 py-4 text-sm font-bold tracking-tight rounded-full transition-all duration-500 overflow-hidden flex items-center justify-center gap-3";
  
  const variants = {
    solid: "bg-river text-white hover:bg-river-dark hover:shadow-[0_10px_30px_rgba(10,77,76,0.2)]",
    outline: "border-2 border-river/20 text-river hover:border-river hover:bg-river/5",
    minimal: "text-river hover:text-river-accent px-4"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
