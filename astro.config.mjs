import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  output: isProduction ? 'static' : 'server',
  adapter: isProduction ? cloudflare({
    imageService: 'cloudflare',
    platformProxy: {
      enabled: true,
    },
  }) : undefined,
  integrations: [
    react(),
    mdx(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});