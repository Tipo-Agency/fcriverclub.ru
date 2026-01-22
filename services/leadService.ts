/**
 * Сервис для отправки лидов в 1C через прокси и Calltouch API
 */

import { collectAnalyticsData } from '../utils/analytics';

// URL прокси endpoint (будет проксировать на 1C)
const PROXY_ENDPOINT = '/api/lead-proxy';

// Calltouch API настройки
const CALLTOUCH_SITE_ID = '52898';
const CALLTOUCH_MOD_ID = 'r2kmsp7t';
// В Vite переменные окружения доступны через import.meta.env (для переменных с префиксом VITE_)
// Также поддерживаем process.env через define в vite.config.ts
const CALLTOUCH_API_TOKEN = 
  (typeof import !== 'undefined' && (import.meta as any).env?.VITE_CALLTOUCH_API_TOKEN) ||
  (typeof process !== 'undefined' && (process as any).env?.VITE_CALLTOUCH_API_TOKEN) ||
  '0b9ea4940475d676014768f9478f3b5062130d223af84'; // Fallback для разработки
const CALLTOUCH_API_URL = `https://api.calltouch.ru/calls-service/RestAPI/${CALLTOUCH_SITE_ID}/register-lead-dict`;

export interface LeadData {
  name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  comment?: string;
  subject?: string; // Тема заявки (для внутреннего использования, не отправляется в 1C)
}

/**
 * Нормализует номер телефона (убирает все, кроме цифр)
 */
/**
 * Отправляет заявку в Calltouch API
 */
const sendLeadToCalltouch = async (data: {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  comment: string;
  subject: string;
}): Promise<void> => {
  try {
    // Формируем URL с параметрами
    const params = new URLSearchParams({
      site_id: CALLTOUCH_SITE_ID,
      mod_id: CALLTOUCH_MOD_ID,
      access_token: CALLTOUCH_API_TOKEN,
      name: data.name || '',
      phone: data.phone,
      email: data.email || '',
      comment: data.comment || data.subject || 'Заявка с сайта',
      targetRequest: 'true', // Целевая заявка
    });

    console.log('[LeadService] Отправка заявки в Calltouch API:', params.toString());

    // Используем GET метод согласно инструкции Calltouch API
    const response = await fetch(`${CALLTOUCH_API_URL}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[LeadService] Calltouch API вернул ошибку:', response.status, errorText);
      throw new Error(`Calltouch API error: ${response.status}`);
    }

    const result = await response.json().catch(() => ({}));
    console.log('[LeadService] Calltouch API ответ:', result);
  } catch (error) {
    console.error('[LeadService] Ошибка отправки в Calltouch API:', error);
    throw error;
  }
};

export const normalizePhone = (phone: string): string => {
  // Убираем все, кроме цифр
  const digits = phone.replace(/\D/g, '');
  
  // Если начинается с 8, заменяем на 7
  if (digits.startsWith('8') && digits.length === 11) {
    return '7' + digits.slice(1);
  }
  
  // Если начинается с +7 или 7, оставляем как есть
  if (digits.startsWith('7')) {
    return digits;
  }
  
  // Если начинается с другого кода, добавляем 7
  if (digits.length === 10) {
    return '7' + digits;
  }
  
  return digits;
};

/**
 * Отправляет лид в 1C через прокси
 */
export const sendLeadTo1C = async (data: LeadData): Promise<{ success: boolean; message?: string }> => {
  try {
    // Собираем аналитические данные
    const analytics = collectAnalyticsData();
    
    // Разделяем имя на имя и фамилию, если указано только имя
    let firstName = data.name || '';
    let lastName = data.last_name || '';
    
    if (firstName && !lastName) {
      const nameParts = firstName.trim().split(/\s+/);
      if (nameParts.length > 1) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
    }
    
    // Нормализуем телефон
    const normalizedPhone = normalizePhone(data.phone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      return { success: false, message: 'Пожалуйста, укажите корректный номер телефона' };
    }
    
    // Формируем данные для отправки в 1C
    const payload = {
      name: firstName,
      last_name: lastName,
      phone: normalizedPhone,
      email: data.email || '',
      comment: data.comment || (data.subject ? `Тема заявки: ${data.subject}` : 'Новая заявка с сайта'),
      ...analytics,
    };
    
    console.log('[LeadService] Отправка заявки в 1C:', payload);
    
    // Отправляем через прокси
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    console.log('[LeadService] Ответ сервера:', response.status, response.statusText);
    
    // Проверяем статус ответа
    const responseText = await response.text().catch(() => '');
    
    console.log('[LeadService] Полный ответ от 1C:', responseText);
    
    // Если ответ не OK, возвращаем ошибку
    if (!response.ok) {
      console.error('Failed to send lead:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText
      });
      return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
    }
    
    // Пытаемся распарсить JSON ответ (может быть пустой или не JSON)
    let result;
    try {
      result = responseText ? JSON.parse(responseText) : {};
      console.log('[LeadService] Распарсенный ответ от 1C:', result);
    } catch (e) {
      // Если ответ не JSON, но статус OK - считаем успехом
      console.log('[LeadService] Ответ не JSON, но статус OK. Текст ответа:', responseText);
      result = {};
    }
    
    // Если 1C вернул ошибку в JSON
    if (result.error) {
      console.error('1C returned error:', result.error);
      return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
    }
    
    // Проверяем есть ли в ответе информация об успехе или ошибке
    if (result.success === false || result.status === 'error') {
      console.error('1C returned error in response:', result);
      return { success: false, message: result.message || 'Ошибка отправки заявки. Попробуйте позже.' };
    }
    
    // Отправляем событие в Яндекс.Метрику
    if (typeof window !== 'undefined' && (window as any).ym) {
      try {
        (window as any).ym(94603976, 'reachGoal', 'form_submit', {
          formSubject: data.subject || 'Заявка',
          phone: normalizedPhone.substring(0, 3) + '***' + normalizedPhone.slice(-2) // Частично скрытый телефон
        });
      } catch (e) {
        console.warn('Failed to send Yandex Metrika event:', e);
      }
    }
    
    // Отправляем заявку в Calltouch API
    try {
      await sendLeadToCalltouch({
        name: firstName,
        lastName: lastName,
        phone: normalizedPhone,
        email: data.email || '',
        comment: data.comment || (data.subject ? `Тема заявки: ${data.subject}` : 'Новая заявка с сайта'),
        subject: data.subject || 'Заявка с сайта',
      });
    } catch (error) {
      // Не блокируем успех, если Calltouch не ответил
      console.warn('[LeadService] Ошибка отправки в Calltouch API (не критично):', error);
    }
    
    // Отправляем событие в Calltouch (клиентское)
    if (typeof window !== 'undefined' && (window as any).ct) {
      try {
        (window as any).ct('event', 'form_submit');
      } catch (e) {
        console.warn('Failed to send Calltouch event:', e);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending lead to 1C:', error);
    return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
  }
};
