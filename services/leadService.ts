/**
 * Сервис для отправки лидов в Calltouch API
 * Calltouch автоматически отправляет заявки в 1C через настроенный вебхук
 */

export interface LeadData {
  name?: string;
  last_name?: string;
  phone: string;
  email?: string;
  comment?: string;
  subject?: string; // Тема заявки
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
 * Отправляет лид в Calltouch API
 * Calltouch автоматически отправляет заявки в 1C через настроенный вебхук
 */
export const sendLeadTo1C = async (data: LeadData): Promise<{ success: boolean; message?: string }> => {
  try {
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
    
    // Настройки Calltouch
    const calltouchSiteId = '52898';
    const calltouchModId = 'r2kmsp7t';
    
    // Получаем sessionId из Calltouch скрипта
    let calltouchSessionId = undefined;
    if (typeof window !== 'undefined' && (window as any).ct) {
      try {
        const ctParams = (window as any).ct('calltracking_params', calltouchModId);
        calltouchSessionId = ctParams?.sessionId;
      } catch (e) {
        // Игнорируем ошибку, sessionId не обязателен
      }
    }
    
    // Формируем данные для Calltouch
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
    
    // Отправляем в Calltouch
    try {
      const calltouchResponse = await fetch(`https://api.calltouch.ru/calls-service/RestAPI/requests/${calltouchSiteId}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: calltouchData.toString(),
      });
      
      if (!calltouchResponse.ok) {
        const errorText = await calltouchResponse.text().catch(() => '');
        console.error('[LeadService] Calltouch error:', calltouchResponse.status, errorText);
        return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
      }
      
      await calltouchResponse.json().catch(() => null);
    } catch (error: any) {
      console.error('[LeadService] Calltouch error:', error);
      return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
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
    console.error('Error sending lead to Calltouch:', error);
    return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
  }
};
