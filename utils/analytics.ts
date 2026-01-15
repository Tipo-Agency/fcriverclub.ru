/**
 * Утилиты для сбора UTM параметров и данных аналитики
 */

/**
 * Получает UTM параметры из URL
 */
export const getUTMParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((param) => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
};

/**
 * Получает Google Analytics Client ID
 */
export const getGAClientId = (): string => {
  try {
    // Пытаемся получить из gtag
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gaId = (window as any).ga?.getAll?.()?.[0]?.get?.('clientId');
      if (gaId) return gaId;
    }
    
    // Пытаемся получить из localStorage/cookie
    const gaCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_ga='));
    
    if (gaCookie) {
      const parts = gaCookie.split('.');
      if (parts.length >= 4) {
        return `${parts[2]}.${parts[3]}`;
      }
    }
  } catch (e) {
    console.warn('Failed to get GA Client ID:', e);
  }
  
  return '';
};

/**
 * Получает Yandex Metrika Client ID
 */
export const getYMClientId = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).ym) {
      const counterId = (window as any).ym?.a?.map?.((c: any) => c.id)?.[0];
      if (counterId) {
        const ymId = (window as any).ym?.(counterId, 'getClientID');
        if (ymId) return String(ymId);
      }
    }
    
    // Пытаемся получить из cookie
    const ymCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('_ym_') || row.startsWith('_ym'));
    
    if (ymCookie) {
      const match = ymCookie.match(/_ym_(\d+)/);
      if (match) {
        const counterId = match[1];
        const clientIdCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`_ym_${counterId}_uid=`));
        if (clientIdCookie) {
          const parts = clientIdCookie.split('=');
          if (parts.length >= 2) {
            return parts[1];
          }
        }
      }
    }
  } catch (e) {
    console.warn('Failed to get YM Client ID:', e);
  }
  
  return '';
};

/**
 * Получает Roistat Client ID
 */
export const getRoistatClientId = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).roistat) {
      const visitId = (window as any).roistat?.getVisitId?.();
      if (visitId) return String(visitId);
    }
    
    // Пытаемся получить из localStorage
    const roistatVisit = localStorage.getItem('roistat_visit');
    if (roistatVisit) {
      try {
        const visit = JSON.parse(roistatVisit);
        if (visit?.client_id) return String(visit.client_id);
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    console.warn('Failed to get Roistat Client ID:', e);
  }
  
  return '';
};

/**
 * Получает Roistat Visit ID
 */
export const getRoistatVisitId = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).roistat) {
      const visitId = (window as any).roistat?.getVisitId?.();
      if (visitId) return String(visitId);
    }
    
    const roistatVisit = localStorage.getItem('roistat_visit');
    if (roistatVisit) {
      try {
        const visit = JSON.parse(roistatVisit);
        if (visit?.visit_id) return String(visit.visit_id);
      } catch (e) {
        // ignore
      }
    }
  } catch (e) {
    console.warn('Failed to get Roistat Visit ID:', e);
  }
  
  return '';
};

/**
 * Получает Calltouch Client ID
 */
export const getCalltouchClientId = (): string => {
  try {
    if (typeof window !== 'undefined' && (window as any).ct) {
      const ctId = (window as any).ct?.getClientId?.();
      if (ctId) return String(ctId);
    }
    
    // Пытаемся получить из cookie
    const ctCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('ct_client_id=') || row.startsWith('_ct'));
    
    if (ctCookie) {
      const parts = ctCookie.split('=');
      if (parts.length >= 2) {
        return parts[1];
      }
    }
  } catch (e) {
    console.warn('Failed to get Calltouch Client ID:', e);
  }
  
  return '';
};

/**
 * Собирает все аналитические данные для отправки в 1C
 */
export const collectAnalyticsData = () => {
  const utm = getUTMParams();
  
  return {
    utm_source: utm.utm_source || '',
    utm_medium: utm.utm_medium || '',
    utm_campaign: utm.utm_campaign || '',
    utm_term: utm.utm_term || '',
    utm_content: utm.utm_content || '',
    ga_cid: getGAClientId(),
    ym_cid: getYMClientId(),
    rs_cid: getRoistatClientId(),
    rs_vid: getRoistatVisitId(),
    ct_cid: getCalltouchClientId(),
  };
};
