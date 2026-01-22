import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Phone } from 'lucide-react';
import { LuxuryButton } from '../components/ui/LuxuryButton';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || 'Заявка';

  useEffect(() => {
    // Отправляем событие в Яндекс.Метрику о достижении цели
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(94603976, 'reachGoal', 'form_submit_success', {
          subject: subject
        });
      } catch (e) {
        console.warn('Failed to send Yandex Metrika event:', e);
      }
    }

    // Отправляем событие в Calltouch
    if (typeof window !== 'undefined' && (window as any).ct) {
      try {
        (window as any).ct('event', 'form_submit_success');
      } catch (e) {
        console.warn('Failed to send Calltouch event:', e);
      }
    }
  }, [subject]);

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={64} className="text-green-600" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-river-dark tracking-tighter mb-6">
            Спасибо!
          </h1>
          
          <p className="text-xl md:text-2xl text-river-gray font-medium mb-4">
            Ваша заявка успешно отправлена
          </p>
          
          <p className="text-lg text-river-gray/70 font-medium mb-12 max-w-xl mx-auto">
            Наш менеджер свяжется с вами в ближайшее время для консультации и ответит на все ваши вопросы.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="bg-river-light p-8 rounded-premium border border-black/5">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Phone size={24} className="text-river" />
              <h3 className="text-xl font-bold text-river-dark">Нужна срочная консультация?</h3>
            </div>
            <a 
              href="tel:+74212728292" 
              className="text-2xl font-extrabold text-river hover:text-river-dark transition-colors"
            >
              +7 (421) 272-82-92
            </a>
            <p className="text-sm text-river-gray mt-2">пн-вс: с 6:30 до 23:00</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LuxuryButton 
              onClick={() => navigate('/')}
              className="h-16 px-12 text-base shadow-xl"
            >
              <ArrowLeft size={18} className="mr-2" />
              Вернуться на главную
            </LuxuryButton>
            
            <LuxuryButton 
              onClick={() => navigate('/pricing')}
              className="h-16 px-12 text-base shadow-xl"
            >
              Посмотреть карты
            </LuxuryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThankYou;
