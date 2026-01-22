/**
 * Сервис для отправки лидов в 1C через прокси и Calltouch API
 */

import { collectAnalyticsData } from '../utils/analytics';

// URL прокси endpoint (будет проксировать на 1C)
const PROXY_ENDPOINT = '/api/lead-proxy';

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
    
    console.log('[LeadService] Полный ответ от сервера (1C + Calltouch):', responseText);
    
    // Если ответ не OK, возвращаем ошибку
    if (!response.ok) {
      console.error('[LeadService] ❌ Ошибка отправки заявки:', {
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
      console.log('[LeadService] Распарсенный ответ от сервера:', result);
      
      // Логируем информацию о 1C
      if (result.success !== undefined) {
        console.log('[LeadService] 1C:', result.success ? '✅ Заявка отправлена' : '❌ Ошибка отправки', {
          data: result.data
        });
      }
      
      // Логируем информацию о Calltouch
      if (result.calltouch) {
        console.log('[LeadService] 📞 Calltouch статус:', {
          sent: result.calltouch.sent,
          http_code: result.calltouch.http_code,
          error: result.calltouch.error,
          response: result.calltouch.response,
          debug: result.calltouch.debug
        });
        
        if (result.calltouch.sent) {
          console.log('[LeadService] ✅ Calltouch: заявка успешно отправлена в Calltouch API');
        } else {
          console.error('[LeadService] ❌ Calltouch: ошибка отправки в Calltouch API', {
            http_code: result.calltouch.http_code,
            error: result.calltouch.error,
            response: result.calltouch.response,
            debug_url: result.calltouch.debug?.url
          });
        }
      } else {
        console.warn('[LeadService] ⚠️ Calltouch: информация отсутствует в ответе сервера');
      }
    } catch (e) {
      // Если ответ не JSON, но статус OK - считаем успехом
      console.log('[LeadService] Ответ не JSON, но статус OK. Текст ответа:', responseText);
      console.warn('[LeadService] ⚠️ Не удалось распарсить ответ как JSON, информация о Calltouch недоступна');
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
    
    // Отправка в Calltouch API через отдельный endpoint
    try {
      // Формируем payload для Calltouch с дополнительными полями
      const calltouchPayload = {
        ...payload,
        subject: data.subject || 'Заявка с сайта fcriverclub.ru',
        requestUrl: typeof window !== 'undefined' ? window.location.href : '',
        // Получаем sessionId из Calltouch скрипта, если доступен
        sessionId: typeof window !== 'undefined' && (window as any).ct 
          ? (window as any).ct('calltracking_params', 'r2kmsp7t')?.sessionId 
          : undefined,
      };
      
      const calltouchResponse = await fetch('/api/calltouch-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calltouchPayload),
      });
      
      const calltouchResult = await calltouchResponse.json().catch(() => ({}));
      console.log('[LeadService] 📞 Calltouch результат:', calltouchResult);
      
      if (calltouchResult.success) {
        console.log('[LeadService] ✅ Calltouch: заявка успешно отправлена');
      } else {
        console.error('[LeadService] ❌ Calltouch: ошибка отправки', calltouchResult);
      }
    } catch (error) {
      console.warn('[LeadService] ⚠️ Ошибка отправки в Calltouch (не критично):', error);
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
