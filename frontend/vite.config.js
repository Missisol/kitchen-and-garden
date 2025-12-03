import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// Plugin to dynamically set favicon based on environment variable
function faviconPlugin() {
  return {
    name: 'favicon-plugin',
    transformIndexHtml(html, { mode }) {
      // eslint-disable-next-line no-undef
      const env = loadEnv(mode, process.cwd(), '')
      const faviconPath = env.VITE_APP_FAVICON_PATH || '/favicon.svg'
      
      // Determine .ico path based on .svg path
      const faviconIcoPath = faviconPath.replace('.svg', '.ico')
      
      // Replace favicon links in HTML
      return html
        .replace(/href="\/favicon\.svg"/g, `href="${faviconPath}"`)
        .replace(/href="\/favicon\.ico"/g, `href="${faviconIcoPath}"`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      faviconPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'favicon-dev.svg', 'robots.txt', 'safari-pinned-tab.svg'],
        manifest: {
          name: 'Кухня и сад',
          short_name: 'Кухня и сад',
          description: 'Приложение для рецептов и садоводства',
          theme_color: '#f38d49',
          background_color: '#0f1115',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/maskable_icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/maskable_icon.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
      build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
