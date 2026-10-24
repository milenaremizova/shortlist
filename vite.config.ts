/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const STYLES_DIR = path.resolve(import.meta.dirname, './src/styles');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Миксины доступны в каждом *.module.scss без импорта.
        // Файлы из src/styles пропускаем, иначе mixins.scss подключит сам себя.
        additionalData: (source: string, filename: string) =>
          filename.startsWith(STYLES_DIR) ? source : `@use "@/styles/mixins" as *;\n${source}`,
      },
    },
  },
  server: {
    // в разработке /api уходит в прокси из server/, ключ API в браузер не попадает
    proxy: { '/api': 'http://localhost:3001' },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
