// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL la pone GitHub Actions (la URL de CloudFront o el dominio propio). Sirve para los enlaces canónicos
// y la imagen al compartir en redes.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
});
