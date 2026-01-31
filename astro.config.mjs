import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [
    react(),
    mdx(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
    },
  },
});