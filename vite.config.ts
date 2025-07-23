/// <reference types="vitest/config" />
/// <reference types='vite/client' />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const serverOtions = {
  watch: {
    usePolling: true, // Включить polling
    // interval: 1000,    // Проверять изменения каждые 1000 мс
  },
  cors: true,
  proxy: undefined,
};

if (process.env.PROXY) {
  // сюда добовляем пути для api например app-list/_api
  serverOtions.proxy = {
    '/_api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      rewrite: (path: string): string => {
        return path.replace(/^\/_api/, '/_api');
      },
    },
}

// https://vitejs.dev/config/  /app-pages
export default defineConfig({
  // base: '/teamplet-assets',
  plugins: [react()],
  server: serverOtions,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
