#!/bin/bash

# Скрипт для отката интеграции с 1C для расписания
# Удаляет все изменения, связанные с получением расписания из 1C API
# Использование: bash scripts/remove-1c-integration.sh

set -e

echo "🔄 Откат интеграции с 1C для расписания..."

# 1. Удаляем сервис для работы с расписанием из 1C
if [ -f "services/scheduleService.ts" ]; then
  echo "  ❌ Удаляем services/scheduleService.ts"
  rm "services/scheduleService.ts"
else
  echo "  ℹ️  Файл services/scheduleService.ts не найден"
fi

# 2. Убираем proxy конфигурацию из vite.config.ts
if [ -f "vite.config.ts" ]; then
  echo "  🔧 Удаляем proxy /api/schedule из vite.config.ts"
  # Используем sed для удаления блока proxy /api/schedule
  sed -i.bak '/\/\/ Интеграция с 1C для расписания/,/},/d' vite.config.ts
  # Убираем лишнюю запятую, если осталась
  sed -i.bak 's/},$/,/g' vite.config.ts
  rm -f vite.config.ts.bak
  echo "  ✅ vite.config.ts обновлен"
else
  echo "  ⚠️  Файл vite.config.ts не найден"
fi

# 3. Убираем location /api/schedule из nginx-api-proxy.conf
if [ -f "nginx-api-proxy.conf" ]; then
  echo "  🔧 Удаляем location /api/schedule из nginx-api-proxy.conf"
  # Используем sed для удаления блока location /api/schedule
  sed -i.bak '/# Интеграция с 1C для расписания/,/^}/d' nginx-api-proxy.conf
  rm -f nginx-api-proxy.conf.bak
  echo "  ✅ nginx-api-proxy.conf обновлен"
else
  echo "  ⚠️  Файл nginx-api-proxy.conf не найден"
fi

# 4. Восстанавливаем исходный Schedule.tsx (убираем интеграцию с API)
if [ -f "pages/Schedule.tsx" ]; then
  echo "  🔧 Восстанавливаем pages/Schedule.tsx к исходному виду"
  
  # Создаем резервную копию
  cp pages/Schedule.tsx pages/Schedule.tsx.backup
  
  # Восстанавливаем исходный код без интеграции с 1C
  cat > pages/Schedule.tsx << 'SCHEDULE_EOF'

import React, { useState } from 'react';
import { MapPin, Users, ChevronRight, Calendar } from 'lucide-react';
import { SCHEDULE } from '../constants';
import { motion } from 'framer-motion';
import { useFeedback } from '../contexts/FeedbackContext';

const Schedule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ПН');
  const { openModal } = useFeedback();
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

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

        <div className="space-y-6">
          {SCHEDULE.map((item, idx) => (
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
      </div>
    </div>
  );
};

export default Schedule;
SCHEDULE_EOF

  echo "  ✅ pages/Schedule.tsx восстановлен (резервная копия: pages/Schedule.tsx.backup)"
else
  echo "  ⚠️  Файл pages/Schedule.tsx не найден"
fi

echo ""
echo "✅ Откат интеграции с 1C для расписания завершен!"
echo ""
echo "📝 Что было сделано:"
echo "   • Удален services/scheduleService.ts"
echo "   • Убрана proxy конфигурация /api/schedule из vite.config.ts"
echo "   • Убран location /api/schedule из nginx-api-proxy.conf"
echo "   • Восстановлен pages/Schedule.tsx к исходному виду"
echo ""
echo "⚠️  Примечание: Интеграция с Calltouch для отправки лидов работает напрямую с клиента"
echo ""
echo "💾 Резервная копия Schedule.tsx сохранена как pages/Schedule.tsx.backup"
