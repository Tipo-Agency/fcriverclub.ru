
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Schedule from './pages/Schedule';
import RiverKids from './pages/RiverKids';
import Directions from './pages/Directions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Oferta from './pages/Oferta';
import Rules from './pages/Rules';
import ThankYou from './pages/ThankYou';
import { FeedbackProvider, useFeedback } from './contexts/FeedbackContext';
import { FeedbackModal } from './components/ui/FeedbackModal';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const { isOpen, subject, closeModal } = useFeedback();
  
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white selection:bg-river selection:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kids" element={<RiverKids />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/services" element={<Directions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/oferta" element={<Oferta />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/submitted" element={<ThankYou />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <FeedbackModal isOpen={isOpen} onClose={closeModal} subject={subject} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <FeedbackProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </FeedbackProvider>
  );
};

export default App;
