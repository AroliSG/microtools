import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/pfpfinder/user': {
            target: 'https://pfpfinder.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/pfpfinder\/user/, '/api/discord/user'),
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
