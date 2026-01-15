/**
 * Сервис для отправки лидов в 1C через прокси
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
    
    // Отправляем через прокси
    const response = await fetch(PROXY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('Failed to send lead:', errorText);
      return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error sending lead to 1C:', error);
    return { success: false, message: 'Ошибка отправки заявки. Попробуйте позже.' };
  }
};
