import React from 'react';
import { motion } from 'framer-motion';

interface LegalPageLayoutProps {
  title: string;
  subtitle?: string;
  approvalInfo?: {
    role: string;
    name: string;
    date: string;
  };
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ 
  title, 
  subtitle, 
  approvalInfo,
  children 
}) => {
  return (
    <div className="bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-river-dark mb-4 uppercase tracking-tighter">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-river-gray font-medium">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg max-w-none bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5"
        >
          {children}
        </motion.div>

        {approvalInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-8 border-t border-black/10"
          >
            <div className="text-right">
              <p className="text-river-gray font-bold mb-2">{approvalInfo.role}</p>
              <p className="text-river-dark font-extrabold mb-4">{approvalInfo.name}</p>
              <p className="text-river-gray">{approvalInfo.date}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
