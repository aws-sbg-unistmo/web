import type { APIRoute } from 'astro';

// robots.txt con la ubicación del sitemap (solo si se conoce la URL pública)
export const GET: APIRoute = ({ site }) => {
  const base = site ? new URL(site.href.replace(/\/?$/, '/')) : null;
  const lineas = ['User-agent: *', 'Allow: /'];
  if (base) lineas.push(`Sitemap: ${new URL('sitemap-index.xml', base).href}`);
  return new Response(`${lineas.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
