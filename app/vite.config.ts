import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';
import { VitePWA } from 'vite-plugin-pwa';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['vue', 'vue-router'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [
    vue(),
    WindiCSS(),
    PurgeIcons(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      strategies: 'generateSW',
      workbox: {
        globIgnores: ['_redirects'],
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: false,
      },
      manifest: {
        scope: '.',
        name: 'Furikaeru',
        short_name: 'Furikaeru',
        description: 'A look back.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#e2f3f5',
        theme_color: '#22d1ee',
        icons: [
          {
            src: '/icon-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/icon-72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icon-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icon-144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
