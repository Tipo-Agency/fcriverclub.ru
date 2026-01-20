/**
 * Маска для русского номера телефона: +7 (XXX) XXX-XX-XX
 */

export const formatPhoneInput = (value: string): string => {
  // Убираем все, кроме цифр
  const digits = value.replace(/\D/g, '');
  
  // Если начинается с 8, заменяем на 7
  let phoneDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
  
  // Если не начинается с 7, добавляем 7
  if (phoneDigits && !phoneDigits.startsWith('7')) {
    phoneDigits = '7' + phoneDigits;
  }
  
  // Ограничиваем до 11 цифр (7 + 10)
  phoneDigits = phoneDigits.slice(0, 11);
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  if (phoneDigits.length === 0) {
    return '';
  }
  
  if (phoneDigits.length <= 1) {
    return `+${phoneDigits}`;
  }
  
  if (phoneDigits.length <= 4) {
    return `+7 (${phoneDigits.slice(1)}`;
  }
  
  if (phoneDigits.length <= 7) {
    return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4)}`;
  }
  
  if (phoneDigits.length <= 9) {
    return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7)}`;
  }
  
  return `+7 (${phoneDigits.slice(1, 4)}) ${phoneDigits.slice(4, 7)}-${phoneDigits.slice(7, 9)}-${phoneDigits.slice(9, 11)}`;
};

export const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, setPhone: (value: string) => void) => {
  const formatted = formatPhoneInput(e.target.value);
  setPhone(formatted);
};
