import React from 'react';

interface LegalSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const LegalSection: React.FC<LegalSectionProps> = ({ title, children, className = '' }) => {
  return (
    <section className={`mb-8 ${className}`}>
      {title && (
        <h3 className="text-2xl font-extrabold text-river-dark mb-4 uppercase tracking-tight">
          {title}
        </h3>
      )}
      <div className="text-river-gray leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
};

interface LegalParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const LegalParagraph: React.FC<LegalParagraphProps> = ({ children, className = '' }) => {
  return (
    <p className={`mb-4 ${className}`}>
      {children}
    </p>
  );
};

interface LegalListProps {
  items: string[];
  ordered?: boolean;
}

export const LegalList: React.FC<LegalListProps> = ({ items, ordered = false }) => {
  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <ListTag className={`list-disc list-inside mb-4 space-y-2 ml-4 ${ordered ? 'list-decimal' : ''}`}>
      {items.map((item, index) => (
        <li key={index} className="mb-2">
          {item}
        </li>
      ))}
    </ListTag>
  );
};
