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
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
