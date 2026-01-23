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
    
    // Получаем sessionId из Calltouch скрипта, если доступен
    let sessionId = undefined;
    if (typeof window !== 'undefined' && (window as any).ct) {
      try {
        sessionId = (window as any).ct('calltracking_params', 'r2kmsp7t')?.sessionId;
      } catch (e) {
        console.warn('[LeadService] Не удалось получить sessionId из Calltouch:', e);
      }
    }
    
    // Отправляем в Calltouch напрямую с клиента (как в документации)
    const calltouchSiteId = '52898';
    const calltouchModId = 'r2kmsp7t';
    
    // Получаем sessionId из Calltouch скрипта
    let calltouchSessionId = undefined;
    if (typeof window !== 'undefined' && (window as any).ct) {
      try {
        const ctParams = (window as any).ct('calltracking_params', calltouchModId);
        calltouchSessionId = ctParams?.sessionId;
        console.log('[LeadService] Calltouch sessionId:', calltouchSessionId);
      } catch (e) {
        console.warn('[LeadService] Не удалось получить sessionId из Calltouch:', e);
      }
    }
    
    // Формируем данные для Calltouch (согласно документации)
    const fio = `${firstName} ${lastName}`.trim() || firstName || 'Клиент';
    const calltouchData = new URLSearchParams();
    calltouchData.append('fio', fio);
    calltouchData.append('phoneNumber', normalizedPhone);
    calltouchData.append('email', data.email || '');
    calltouchData.append('subject', data.subject || 'Заявка с сайта fcriverclub.ru');
    calltouchData.append('comment', data.comment || (data.subject ? `Тема заявки: ${data.subject}` : 'Новая заявка с сайта'));
    calltouchData.append('targetRequest', 'true');
    if (calltouchSessionId) {
      calltouchData.append('sessionId', calltouchSessionId);
    }
    if (typeof window !== 'undefined') {
      calltouchData.append('requestUrl', window.location.href);
    }
    
    console.log('[LeadService] Отправка в Calltouch:', {
      fio,
      phoneNumber: normalizedPhone,
      email: data.email || '',
      subject: data.subject || 'Заявка с сайта fcriverclub.ru',
      sessionId: calltouchSessionId || 'не указан'
    });
    
    // Отправляем в Calltouch напрямую (ОБЯЗАТЕЛЬНО с await!)
    let calltouchSuccess = false;
    let calltouchError = null;
    try {
      const calltouchUrl = `https://api.calltouch.ru/calls-service/RestAPI/requests/${calltouchSiteId}/register/`;
      console.log('[LeadService] Calltouch URL:', calltouchUrl);
      
      const calltouchResponse = await fetch(calltouchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: calltouchData.toString(),
      });
      
      console.log('[LeadService] Calltouch response status:', calltouchResponse.status, calltouchResponse.statusText);
      
      if (calltouchResponse.ok) {
        calltouchSuccess = true;
        const calltouchResult = await calltouchResponse.json().catch(() => {
          const text = calltouchResponse.text();
          console.warn('[LeadService] Calltouch ответ не JSON:', text);
          return null;
        });
        console.log('[LeadService] ✅ Calltouch: заявка успешно отправлена', calltouchResult);
      } else {
        const errorText = await calltouchResponse.text().catch(() => '');
        calltouchError = `HTTP ${calltouchResponse.status}: ${errorText}`;
        console.error('[LeadService] ❌ Calltouch: ошибка', calltouchResponse.status, errorText);
      }
    } catch (error: any) {
      calltouchError = error.message || String(error);
      console.error('[LeadService] ❌ Calltouch: ошибка отправки', error);
      
      // Проверяем если это CORS ошибка
      if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
        console.error('[LeadService] ❌ Calltouch заблокирован CORS! Нужен серверный прокси.');
      }
    }
    
    if (!calltouchSuccess) {
      console.error('[LeadService] ⚠️ Calltouch: заявка НЕ отправлена!', calltouchError);
    }
    
    // Формируем данные для отправки в 1C
    const payload = {
      name: firstName,
      last_name: lastName,
      phone: normalizedPhone,
      email: data.email || '',
      comment: data.comment || (data.subject ? `Тема заявки: ${data.subject}` : 'Новая заявка с сайта'),
      subject: data.subject || 'Заявка с сайта fcriverclub.ru',
      requestUrl: typeof window !== 'undefined' ? window.location.href : '',
      sessionId: sessionId,
      ...analytics,
    };
    
    console.log('[LeadService] Отправка заявки в 1C:', payload);
    
    // Отправляем в 1C через прокси
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
      
      // Calltouch уже отправлен напрямую с клиента выше
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
