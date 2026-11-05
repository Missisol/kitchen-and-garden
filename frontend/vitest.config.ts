import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Отдельный конфиг вместо vite.config.ts: там подключены VitePWA и vue-devtools,
// которые генерируют service worker и меняют HTML — в тестах это только мешает.
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{spec,test}.{ts,tsx}'],
    // apiUrls собирает адреса из import.meta.env.VITE_API_BASE_URL,
    // без этого значения в тестах получались бы URL вида "undefined/reserves".
    env: {
      VITE_API_BASE_URL: '/api',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/**/*.d.ts',
        'src/test/**',
        'src/main.ts',
      ],
    },
  },
})
