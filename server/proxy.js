/**
 * Серверный прокси для отправки лидов в 1C
 * Используется в production для обхода CORS
 */

const WEBHOOK_URL = 'https://cloud.1c.fitness/api/hs/lead/Webhook/570b6605-5cae-4211-b7b8-6422e15375df';

// Для Vercel / Netlify Functions / Cloudflare Workers
export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1C Webhook error:', errorText);
      res.status(response.status).json({ error: 'Failed to send lead to 1C' });
      return;
    }

    const result = await response.text();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
