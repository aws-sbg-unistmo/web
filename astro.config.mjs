// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE_URL la pone GitHub Actions (la URL de CloudFront o el dominio propio). Sirve para los enlaces canónicos
// y la imagen al compartir en redes.
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // El sitemap solo se genera cuando se conoce la URL pública (SITE_URL)
  integrations: process.env.SITE_URL ? [sitemap({ filter: (pagina) => !pagina.includes('/404') })] : [],
  vite: {
    plugins: [tailwindcss()],
  },
});
