import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '^/api/lead-proxy': {
            target: 'https://cloud.1c.fitness',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/lead-proxy/, '/api/hs/lead/Webhook/9a93d939-e1e3-49b9-be61-0439957207f4'),
            secure: true,
            configure: (proxy, _options) => {
              proxy.on('proxyReq', (proxyReq, req, _res) => {
                console.log('[Vite Proxy] POST Request:', req.method, req.url, '->', proxyReq.path);
              });
              proxy.on('proxyRes', (proxyRes, req, _res) => {
                console.log('[Vite Proxy] Response:', proxyRes.statusCode, req.method, req.url);
                proxyRes.headers['access-control-allow-origin'] = '*';
                proxyRes.headers['access-control-allow-methods'] = 'POST, OPTIONS, GET';
                proxyRes.headers['access-control-allow-headers'] = 'Content-Type';
              });
            },
          },
          // Интеграция с 1C для расписания - можно удалить через: bash scripts/remove-1c-integration.sh
          '/api/schedule': {
            target: 'http://opb.kb.ru:8081/FitnesRiver/hs/api/v3',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/schedule/, '/classes'),
            secure: false,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_CALLTOUCH_API_TOKEN': JSON.stringify(env.VITE_CALLTOUCH_API_TOKEN)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
