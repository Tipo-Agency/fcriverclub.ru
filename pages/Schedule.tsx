// Интеграция с 1C для расписания - можно удалить через: bash scripts/remove-1c-integration.sh
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Users, ChevronRight, Calendar, ChevronLeft } from 'lucide-react';
import { SCHEDULE } from '../constants';
import { motion } from 'framer-motion';
import { useFeedback } from '../contexts/FeedbackContext';
import { getScheduleFrom1C, convert1CClassToScheduleItem } from '../services/scheduleService';

/**
 * Получает понедельник выбранной недели
 */
const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Понедельник как 1-й день недели
  return new Date(d.setDate(diff));
};

/**
 * Форматирует дату для отображения
 */
const formatWeekRange = (monday: Date): string => {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  
  const mondayStr = `${monday.getDate()} ${months[monday.getMonth()]}`;
  const sundayStr = `${sunday.getDate()} ${months[sunday.getMonth()]}`;
  
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()}-${sundayStr}`;
  }
  return `${mondayStr} - ${sundayStr}`;
};

const Schedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ПН');
  const [selectedWeek, setSelectedWeek] = useState<Date>(getMondayOfWeek(new Date()));
  const [apiSchedule, setApiSchedule] = useState<Array<ReturnType<typeof convert1CClassToScheduleItem>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const { openModal } = useFeedback();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  // Вычисляем даты начала и конца недели
  const weekDates = useMemo(() => {
    const monday = new Date(selectedWeek);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return {
      start: monday.toISOString().split('T')[0], // yyyy-mm-dd
      end: sunday.toISOString().split('T')[0], // yyyy-mm-dd
    };
  }, [selectedWeek]);

  // Используем ref для отслеживания текущего запроса и предотвращения дублирования
  const loadingRef = useRef(false);
  const currentRequestRef = useRef<string | null>(null);

  // Загрузка расписания из 1C API при изменении недели
  useEffect(() => {
    // Создаем уникальный ключ для этого запроса
    const requestKey = `${weekDates.start}-${weekDates.end}`;
    
    // Если уже идет загрузка для этого запроса, не запускаем повторно
    if (loadingRef.current && currentRequestRef.current === requestKey) {
      console.log('[Schedule] Загрузка уже идет для этого запроса, пропускаем');
      return;
    }

    // Если уже был загружен этот запрос, не загружаем повторно
    if (currentRequestRef.current === requestKey && !loadingRef.current) {
      console.log('[Schedule] Данные уже загружены для этой недели, пропускаем');
      return;
    }

    const loadSchedule = async () => {
      loadingRef.current = true;
      currentRequestRef.current = requestKey;
      setLoading(true);
      setApiError(null);
      
      try {
        console.log('[Schedule] Загрузка расписания из 1C API:', weekDates, 'Request key:', requestKey);
        const classes = await getScheduleFrom1C(weekDates.start, weekDates.end);
        
        console.log('[Schedule] Получено из API:', classes ? `${classes.length} занятий` : 'null');
        
        if (classes && classes.length > 0) {
          const converted = classes
            .map(convert1CClassToScheduleItem)
            .filter(item => !item.canceled); // Фильтруем отмененные занятия
          console.log('[Schedule] Преобразовано занятий:', converted.length);
          setApiSchedule(converted);
        } else {
          // Если API не вернул данные, используем fallback
          console.warn('[Schedule] API не вернул данные, используем fallback на статичные данные');
          setApiSchedule(null);
          setApiError('API не вернул данные');
        }
      } catch (error) {
        console.error('[Schedule] Ошибка загрузки расписания из 1C:', error);
        // При ошибке используем fallback
        setApiSchedule(null);
        setApiError(error instanceof Error ? error.message : 'Ошибка загрузки расписания');
      } finally {
        setLoading(false);
        loadingRef.current = false;
        // Не очищаем currentRequestRef здесь, чтобы помнить, что запрос завершен
      }
    };

    loadSchedule();
    
    // Cleanup функция - отменяем запрос, если компонент размонтируется или зависимости изменятся
    return () => {
      // В случае размонтирования или изменения зависимостей, сбрасываем флаги
      // Но не сбрасываем currentRequestRef, чтобы избежать повторных загрузок при HMR
      loadingRef.current = false;
    };
  }, [weekDates.start, weekDates.end]);

  // Навигация по неделям
  const goToPreviousWeek = () => {
    const prevWeek = new Date(selectedWeek);
    prevWeek.setDate(selectedWeek.getDate() - 7);
    setSelectedWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(selectedWeek);
    nextWeek.setDate(selectedWeek.getDate() + 7);
    setSelectedWeek(nextWeek);
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(getMondayOfWeek(new Date()));
  };

  const isCurrentWeek = useMemo(() => {
    const currentMonday = getMondayOfWeek(new Date());
    return currentMonday.getTime() === selectedWeek.getTime();
  }, [selectedWeek]);

  // Фильтрация расписания по выбранному дню недели
  const filteredSchedule = useMemo(() => {
    const scheduleToUse = apiSchedule || SCHEDULE;
    
    if (!activeTab || activeTab === 'ВСЕ') {
      return scheduleToUse;
    }

    // Маппинг дней недели: ПН = 1, ВТ = 2, ..., ВС = 0
    const dayMap: Record<string, number> = {
      'ПН': 1,
      'ВТ': 2,
      'СР': 3,
      'ЧТ': 4,
      'ПТ': 5,
      'СБ': 6,
      'ВС': 0,
    };

    const targetDay = dayMap[activeTab];

    return scheduleToUse.filter((item) => {
      // Если это API данные с startDate, извлекаем день недели
      if ('startDate' in item) {
        const date = new Date(item.startDate);
        const dayOfWeek = date.getDay(); // 0 = воскресенье, 1 = понедельник, ...
        return dayOfWeek === targetDay;
      }
      
      // Для статических данных используем первый элемент (для совместимости)
      return true;
    });
  }, [apiSchedule, activeTab]);

  return (
    <div className="pt-52 pb-40 bg-white min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="space-y-6">
             <div className="inline-flex items-center gap-3 bg-river/5 px-4 py-2 rounded-full text-river text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} /> Расписание занятий
             </div>
             <h1 className="text-6xl md:text-8xl font-extrabold text-river-dark tracking-tighter">Групповые <br/> <span className="text-river">программы</span></h1>
          </div>
          
          {/* Навигация по неделям */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-4 bg-river-light p-3 rounded-full border border-black/5">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-river hover:text-white rounded-full transition-all"
                aria-label="Предыдущая неделя"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex flex-col items-center min-w-[200px]">
                <div className="text-sm font-bold text-river-dark">
                  {formatWeekRange(selectedWeek)}
                </div>
                {!isCurrentWeek && (
                  <button
                    onClick={goToCurrentWeek}
                    className="text-xs text-river hover:underline mt-1"
                  >
                    Текущая неделя
                  </button>
                )}
              </div>
              
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-river hover:text-white rounded-full transition-all"
                aria-label="Следующая неделя"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {/* Дни недели */}
            <div className="flex flex-wrap gap-2 bg-river-light p-2 rounded-full border border-black/5">
              {days.map((day) => (
                <button 
                  key={day}
                  onClick={() => setActiveTab(day)}
                  className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-bold text-sm rounded-full transition-all duration-300 ${activeTab === day ? 'bg-river text-white shadow-lg' : 'text-river-gray hover:text-river-dark hover:bg-white'}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-river-gray text-lg">Загрузка расписания...</div>
          </div>
        ) : (
          <>
            {apiError && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                ⚠️ Ошибка загрузки из 1C API: {apiError}. Используются статичные данные.
              </div>
            )}
            {filteredSchedule.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-river-gray text-lg">На выбранный день занятий не найдено</div>
              </div>
            ) : (
          <div className="space-y-6">
            {filteredSchedule.map((item, idx) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col md:flex-row items-center justify-between p-10 bg-white rounded-premium border border-black/5 hover:border-river transition-all duration-500 hover:shadow-2xl"
              >
                <div className="flex items-center gap-10 flex-1 w-full">
                  <div className="text-5xl font-extrabold text-river-dark tabular-nums group-hover:text-river transition-colors">
                    {item.time}
                  </div>
                  <div className="w-[1px] h-16 bg-black/5 hidden md:block"></div>
                  <div className="space-y-3">
                    <div className="text-[10px] font-bold text-river uppercase tracking-widest">{item.category}</div>
                    <h3 className="text-3xl font-extrabold text-river-dark">{item.activity}</h3>
                    <div className="flex flex-wrap items-center gap-6 text-river-gray text-sm font-semibold">
                      <span className="flex items-center gap-2"><MapPin size={16} className="text-river" /> {item.room}</span>
                      <span className="flex items-center gap-2"><Users size={16} className="text-river" /> {item.trainer}</span>
                      {'online' in item && item.online && (
                        <span className="flex items-center gap-2 text-river text-xs font-bold">● Онлайн</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-0">
                  <button onClick={() => openModal(`Запись на занятие: ${item.activity}`)} className="flex items-center gap-4 bg-river-light hover:bg-river hover:text-white px-10 py-5 rounded-full font-bold text-xs text-river-dark uppercase tracking-widest transition-all">
                    Записаться <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
