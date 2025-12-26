import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FeedbackContextType {
  isOpen: boolean;
  subject: string;
  openModal: (subject?: string) => void;
  closeModal: () => void;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("Заявка в клуб");

  const openModal = (newSubject?: string) => {
    if (newSubject) {
      setSubject(newSubject);
    } else {
      setSubject("Заявка в клуб");
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <FeedbackContext.Provider value={{ isOpen, subject, openModal, closeModal }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

