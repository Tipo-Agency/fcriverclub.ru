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
    console.log('[ScheduleService] Запрос к API:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[ScheduleService] Ответ API:', response.status, response.statusText, response.ok);
    console.log('[ScheduleService] Content-Type:', response.headers.get('content-type'));

    // Сначала читаем ответ как текст для отладки
    const textResponse = await response.text().catch(() => 'Не удалось прочитать ответ');
    
    // Проверяем, что ответ действительно JSON
    const contentType = response.headers.get('content-type');
    if (!response.ok || !contentType || !contentType.includes('application/json')) {
      console.error('[ScheduleService] API вернул ошибку или не JSON:', {
        contentType,
        status: response.status,
        statusText: response.statusText,
        url,
        responsePreview: textResponse.substring(0, 1000),
      });
      
      // Если это HTML страница, возможно API недоступен или требует авторизацию
      if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
        console.error('[ScheduleService] API вернул HTML страницу вместо JSON. Возможно:');
        console.error('  - Неправильный endpoint');
        console.error('  - Требуется авторизация (API ключ)');
        console.error('  - API недоступен');
        console.error('  - Проблема с proxy конфигурацией');
      } else if (response.status === 500) {
        console.error('[ScheduleService] Ошибка 500 от сервера. Возможные причины:');
        console.error('  - Ошибка на стороне 1C API');
        console.error('  - Неправильные параметры запроса');
        console.error('  - Требуется авторизация или API ключ');
        console.error('Полный ответ:', textResponse);
      }
      
      return null;
    }

    // Парсим JSON из уже прочитанного текста
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (jsonError) {
      console.error('[ScheduleService] Ошибка парсинга JSON:', jsonError);
      console.error('[ScheduleService] Ответ (первые 500 символов):', textResponse.substring(0, 500));
      return null;
    }
    
    if (data === null) {
      return null;
    }
    console.log('[ScheduleService] Полученные данные:', {
      type: typeof data,
      isArray: Array.isArray(data),
      keys: data ? Object.keys(data) : null,
      length: Array.isArray(data) ? data.length : (data?.classes ? data.classes.length : null),
    });
    
    // Если ответ - массив, возвращаем его
    if (Array.isArray(data)) {
      console.log('[ScheduleService] Возвращаем массив, занятий:', data.length);
      return data;
    }
    
    // Если ответ - объект с массивом classes
    if (data && Array.isArray(data.classes)) {
      console.log('[ScheduleService] Возвращаем data.classes, занятий:', data.classes.length);
      return data.classes;
    }
    
    console.warn('[ScheduleService] Неожиданный формат ответа от 1C API:', data);
    return null;
  } catch (error) {
    console.error('[ScheduleService] Исключение при запросе к 1C API:', error);
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
