/**
 * API Route для проксирования запросов к 1C
 * Используется в production для обхода CORS
 */

const WEBHOOK_URL = 'https://cloud.1c.fitness/api/hs/lead/Webhook/570b6605-5cae-4211-b7b8-6422e15375df';

// Для Vercel / Netlify Functions
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('1C Webhook error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send lead to 1C' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.text();
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Обработка OPTIONS для CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
