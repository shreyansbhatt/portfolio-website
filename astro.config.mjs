import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'cloudflare',
  }),
  integrations: [
    react(),
    mdx(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['linkedin.com', 'media.licdn.com'],
  },
  site: 'https://shreyansbhatt.com',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  experimental: {
    clientPrerender: true,
  },
});
