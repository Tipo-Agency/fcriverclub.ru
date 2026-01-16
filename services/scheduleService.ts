/**
 * Сервис для получения расписания из 1C API
 * Интеграция с 1C может быть удалена командой: bash scripts/remove-1c-integration.sh
 */

// URL прокси endpoint (будет проксировать на 1C API)
const SCHEDULE_API_ENDPOINT = '/api/schedule';

/**
 * Интерфейс для ответа API 1C (групповые занятия)
 */
export interface ClassFrom1C {
  appointment_id: string;
  already_booked?: string;
  online: boolean;
  canceled?: string;
  reason_for_cancellation?: string;
  booked?: string;
  web_booked?: string;
  web_capacity?: string;
  course?: {
    id: string;
    title: string;
    cycle_period?: {
      id: string;
      title: string;
      start_date: string;
      end_date: string;
    } | null;
    color?: string;
  };
  service?: {
    title: string;
    id: string;
    color?: string;
    course?: {
      title: string;
      id: string;
      strength?: string;
      endurance?: string;
      cardio?: string;
      flexibility?: string;
      sort_index?: number;
      pictures?: string[];
    };
  };
  service_replacement?: {
    title: string;
    id: string;
  };
  group?: {
    title: string;
    id: string;
  };
  room?: {
    title: string;
    id: string;
    sort_order?: number;
  };
  direction?: {
    title: string;
    id: string;
  };
  room_replacement?: {
    title: string;
    id: string;
  };
  employee?: {
    name: string;
    id: string;
    photo?: string;
    position?: {
      title: string;
      id: string;
    };
  };
  employee_replacement?: {
    name: string;
    id: string;
    position?: {
      title: string;
      id: string;
    };
  };
  assistant?: {
    name: string;
    id: string;
  };
  type: string; // 'classes' | 'personal'
  capacity: number;
  start_date: string; // "yyyy-mm-dd HH:MM"
  start_date_replacement?: string;
  end_date: string; // "yyyy-mm-dd HH:MM"
  duration: number;
  commercial?: boolean;
  booking_online?: boolean;
  booking_window?: {
    start_date_time: string;
    end_date_time: string;
  };
  badges?: Array<{
    title: string;
    unicode: string;
  }>;
  use_waiting_list?: boolean | null;
  course_activity?: boolean;
}

/**
 * Получает расписание занятий за период из 1C API
 * @param startDate - Дата начала периода (yyyy-mm-dd)
 * @param endDate - Дата окончания периода (yyyy-mm-dd)
 * @returns Массив занятий или null в случае ошибки
 */
export const getScheduleFrom1C = async (
  startDate: string,
  endDate: string
): Promise<ClassFrom1C[] | null> => {
  try {
    const url = `${SCHEDULE_API_ENDPOINT}?start_date=${startDate}&end_date=${endDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch schedule from 1C:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Если ответ - массив, возвращаем его
    if (Array.isArray(data)) {
      return data;
    }
    
    // Если ответ - объект с массивом classes
    if (data && Array.isArray(data.classes)) {
      return data.classes;
    }
    
    console.warn('Unexpected response format from 1C API:', data);
    return null;
  } catch (error) {
    console.error('Error fetching schedule from 1C:', error);
    return null;
  }
};

/**
 * Преобразует занятие из 1C в формат ScheduleItem
 */
export const convert1CClassToScheduleItem = (classItem: ClassFrom1C): {
  id: string;
  time: string;
  activity: string;
  trainer: string;
  room: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: number;
  online: boolean;
  canceled?: boolean;
  capacity?: number;
} => {
  // Извлекаем время из start_date (формат "yyyy-mm-dd HH:MM")
  const timeMatch = classItem.start_date.match(/\d{4}-\d{2}-\d{2} (\d{2}:\d{2})/);
  const time = timeMatch ? timeMatch[1] : '';
  
  // Название занятия - из service или course
  const activity = classItem.service?.title || classItem.course?.title || 'Занятие';
  
  // Тренер - из employee
  const trainer = classItem.employee?.name || 'Тренер';
  
  // Помещение - из room
  const room = classItem.room?.title || 'Помещение';
  
  // Категория - из service.course или direction
  const category = 
    classItem.service?.course?.title || 
    classItem.direction?.title || 
    classItem.course?.title || 
    'Групповое занятие';

  return {
    id: classItem.appointment_id,
    time,
    activity,
    trainer,
    room,
    category,
    startDate: classItem.start_date,
    endDate: classItem.end_date,
    duration: classItem.duration,
    online: classItem.online,
    canceled: classItem.canceled === 'true' || classItem.canceled === '1',
    capacity: classItem.capacity || undefined,
  };
};
