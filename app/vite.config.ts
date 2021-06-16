import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import WindiCSS from 'vite-plugin-windicss';
import PurgeIcons from 'vite-plugin-purge-icons';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4000,
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
        // icons: [
        //   {
        //     src: '/icon.png',
        //     sizes: '96x96',
        //     type: 'image/png',
        //   },
        // ],
      },
    }),
  ],
  resolve: {
    alias: {
      src: '/src',
    },
  },
});
