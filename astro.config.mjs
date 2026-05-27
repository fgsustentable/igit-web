// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://igit.gal';

// https://astro.build
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  adapter: vercel({
    // Rexión UE (Frankfurt) — requisito do blueprint
    isr: false,
  }),
  i18n: {
    defaultLocale: 'gl',
    locales: ['gl', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
