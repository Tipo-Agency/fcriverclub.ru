
import { Service, Trainer, PricingPlan, ScheduleItem } from './types';

export const KIDS_DIRECTIONS = [
  // 5+ лет
  { id: 'k1', title: 'Боевое самбо', age: '5-12 лет', category: '5+', image: '/1651574248_07.jpeg' },
  { id: 'k2', title: 'Зарядка для ножек', age: 'от 5 лет', category: '5+', image: '/1651574206_05.jpeg' },
  { id: 'k3', title: 'ОФП', age: 'от 5 лет', category: '5+', image: '/1651574217_04.jpeg' },
  { id: 'k4', title: 'Детская хореография', age: 'от 5 лет', category: '5+', image: '/1651574260_06.jpeg' },
  { id: 'k5', title: 'Баланс Фит', age: 'от 5 лет', category: '5+', image: '/1651574270_01.jpeg' },
  { id: 'k21', title: 'Фитбол', age: 'от 5 лет', category: '5+', image: '/0B6A8602_resized.jpg' },
  { id: 'k22', title: 'Fit Kid', age: 'от 5 лет', category: '5+', image: '/1664951294_34cdf6.jpg' },
  { id: 'k23', title: 'Ритмика', age: 'от 5 лет', category: '5+', image: '/2ce1495c-ff2a-477e-af07-8cb0841908ac.jpg' },
  { id: 'k24', title: 'Олимпик', age: 'от 5 лет', category: '5+', image: '/5w2ageDNzGQIUPTCEOHiQ.jpg' },
  
  // 8+ лет
  { id: 'k6', title: 'Здоровая спина', age: 'от 8 лет', category: '8+', image: '/cec464460827989a0951bf87830a9d89_640.jpg' },
  { id: 'k7', title: 'Функционал', age: 'от 8 лет', category: '8+', image: '/gallery_0.webp' },
  { id: 'k8', title: 'Кроссфит', age: 'от 8 лет', category: '8+', image: '/L_height.webp' },
  { id: 'k25', title: 'Силовой класс', age: 'от 8 лет', category: '8+', image: '/L_height (1).webp' },
  { id: 'k26', title: 'Пилатес', age: 'от 8 лет', category: '8+', image: '/L_height (2).webp' },
  { id: 'k27', title: 'Кинезиофитнес', age: 'от 8 лет', category: '8+', image: '/L_height (3).webp' },
  
  // 13+ лет
  { id: 'k9', title: 'Тик-Ток танцы', age: 'от 13 лет', category: '13+', image: '/L_height (4).webp' },
  { id: 'k10', title: 'Cycle', age: 'от 13 лет', category: '13+', image: '/slide-01.jpg' },
  { id: 'k28', title: 'ABS+Stretching', age: 'от 13 лет', category: '13+', image: '/slide-06.jpg' },
  { id: 'k29', title: 'Circuit training', age: 'от 13 лет', category: '13+', image: '/1651574206_05.jpeg' },
  { id: 'k30', title: 'Total functional', age: 'от 13 лет', category: '13+', image: '/1651574217_04.jpeg' },

  // Вода
  { id: 'k11', title: 'Акулята', age: '5-7 лет', category: 'Вода', image: '/1651574270_01.jpeg' },
  { id: 'k12', title: 'Пираты', age: '8-12 лет', category: 'Вода', image: '/1651574260_06.jpeg' },
  { id: 'k31', title: 'Swim games', age: 'от 8 лет', category: 'Вода', image: '/1651574248_07.jpeg' },
  { id: 'k32', title: 'Free-дайверы', age: 'от 8 лет', category: 'Вода', image: '/0B6A8602_resized.jpg' },
  { id: 'k33', title: 'Swimming', age: 'от 13 лет', category: 'Вода', image: '/1664951294_34cdf6.jpg' },
  
  // Секции
  { id: 'k34', title: 'Школа моделей', age: 'от 8 лет', category: 'Секции', image: '/2ce1495c-ff2a-477e-af07-8cb0841908ac.jpg' },
  { id: 'k35', title: 'Нейропсихолог', age: 'от 8 лет', category: 'Секции', image: '/5w2ageDNzGQIUPTCEOHiQ.jpg' },
  { id: 'k36', title: 'Клуб с психологом', age: 'от 8 лет', category: 'Секции', image: '/cec464460827989a0951bf87830a9d89_640.jpg' }
];

export const BENEFITS = [
  { id: 1, title: '5000 м²', desc: 'Для комфортных занятий', icon: 'Maximize' },
  { id: 2, title: '3 этажа', desc: 'Пространства для фитнеса', icon: 'Layers' },
  { id: 3, title: 'Парковая зона', desc: 'Расположение в центре', icon: 'Trees' },
  { id: 4, title: 'Парковка', desc: 'Собственная выделенная зона', icon: 'ParkingCircle' },
  { id: 5, title: 'Вечеринки', desc: 'Зона заката на крыше', icon: 'GlassWater' },
  { id: 6, title: 'PRECOR & HOIST', desc: 'Премиальные тренажеры', icon: 'Dumbbell' },
  { id: 7, title: 'Бассейны', desc: 'Закрытый и открытый', icon: 'Waves' },
  { id: 8, title: 'Детский клуб', desc: 'С 2 бассейнами', icon: 'Baby' },
];

export const FITNESS_ZONES: Service[] = [
  { id: 'pool', title: 'Термальный комплекс', description: 'Бассейн открытый и закрытый, хаммам, сауны.', image: '/1651574270_01.jpeg', category: 'wellness' },
  { id: 'gym', title: 'Тренажерный зал', description: 'Оборудование мировых брендов Precor и Hoist.', image: '/1651574206_05.jpeg', category: 'sports' },
  { id: 'group', title: 'Групповые программы', description: 'Более 40 направлений от йоги до кроссфита.', image: '/1651574217_04.jpeg', category: 'sports' },
  { id: 'fight', title: 'Бойцовский клуб', description: 'Ринг, татами и работа с мастерами спорта.', image: '/1651574248_07.jpeg', category: 'sports' },
  { id: 'kids', title: 'Детский клуб', description: 'Программы развития и спорта для детей.', image: '/1651574260_06.jpeg', category: 'kids' },
  { id: 'yoga', title: 'Йога и Пилатес', description: 'Студия для восстановления и гармонии.', image: '/0B6A8602_resized.jpg', category: 'wellness' },
];

export const NEWS = [
  { id: 1, title: 'Запуск интенсивных тренировок с DexBee', date: 'Декабрь 2024', image: '/1664951294_34cdf6.jpg' },
  { id: 2, title: 'Открытие соляной сауны', date: 'Март 2025', image: '/5w2ageDNzGQIUPTCEOHiQ.jpg' },
  { id: 3, title: 'Обновление пляжной зоны на крыше', date: 'Июнь 2025', image: '/cec464460827989a0951bf87830a9d89_640.jpg' },
];

export const SERVICES = FITNESS_ZONES;

export const PRICING_PLANS: (PricingPlan & { category: 'VIP' | 'STANDARD', poolType: string })[] = [
  { 
    id: 'river_one', 
    name: 'RIVER ONE', 
    category: 'VIP',
    poolType: 'Закрытый + Открытый',
    price: 0, 
    period: '12 месяцев', 
    features: ['Персональный тренинг', 'VIP-паркинг', 'Консьерж-сервис 24/7', 'Доступ в открытый бассейн на крыше', 'Индивидуальная раздевалка'] 
  },
  { 
    id: 'executive', 
    name: 'EXECUTIVE', 
    category: 'VIP',
    poolType: 'Закрытый + Открытый',
    isPopular: true,
    price: 0, 
    period: '12 месяцев', 
    features: ['Все зоны клуба без ограничений', 'Доступ в открытый бассейн', '10 гостевых визитов', 'Стирка спортивной формы', 'Фитнес-тестирование'] 
  },
  { 
    id: 'classic_plus', 
    name: 'CLASSIC PLUS', 
    category: 'STANDARD',
    poolType: 'Закрытый + Открытый',
    price: 0, 
    period: '12 месяцев', 
    features: ['Тренажерный зал Precor/Hoist', 'Групповые программы', 'Термальный комплекс', 'Доступ в открытый бассейн на крыше'] 
  },
  { 
    id: 'classic', 
    name: 'CLASSIC', 
    category: 'STANDARD',
    poolType: 'Только Закрытый',
    price: 0, 
    period: '12 месяцев', 
    features: ['Тренажерный зал', 'Групповые занятия по расписанию', 'Закрытый бассейн и хаммам', 'Доступ 07:00 - 23:00'] 
  }
];

export const SCHEDULE: ScheduleItem[] = [
  { id: 's1', time: '08:00', activity: 'Рассветная Йога', trainer: 'Елена Гранд', room: 'Дзен Студия', category: 'Разум и Тело' },
  { id: 's2', time: '12:00', activity: 'Силовой Атлетизм', trainer: 'Марк Андреев', room: 'Зона Силы', category: 'Сила' },
];
