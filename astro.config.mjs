// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  // Update this to your real deployed domain. Used to build canonical and
  // Open Graph absolute URLs.
  site: 'https://haraldmorjan.dev',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap(), react(), vue()],
});