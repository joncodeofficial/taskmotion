/// <reference types="vitest" />

import { defineConfig } from 'vite';
import type { UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

const manifest: Partial<ManifestOptions> = {
  display: 'standalone',
  display_override: ['window-controls-overlay'],
  orientation: 'portrait',
  lang: 'en',
  name: 'Taskmotion',
  short_name: 'Taskmotion',
  theme_color: '#0f0f0f',
  background_color: '#0f0f0f',
  icons: [
    {
      src: 'favicon-64x64.png',
      sizes: '64x64',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'favicon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
  ],
};

export default defineConfig({
  plugins:
    process.env.NODE_ENV !== 'production'
      ? [tailwindcss(), react()]
      : [
          tailwindcss(),
          react(),
          VitePWA({
            manifest,
            registerType: 'autoUpdate',
            workbox: {
              cacheId: 'taskmotion_v1.6.15',
              cleanupOutdatedCaches: true,
            },
          }),
        ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './setup.ts',
  },
} as UserConfig);
