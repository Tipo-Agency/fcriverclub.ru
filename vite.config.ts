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
          '/api/lead-proxy': {
            target: 'https://cloud.1c.fitness/api/hs/lead/Webhook/570b6605-5cae-4211-b7b8-6422e15375df',
            changeOrigin: true,
            rewrite: (path) => '', // Убираем /api/lead-proxy из пути
            secure: true,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
