// Solo para la vista previa en GitHub Pages, que sirve el sitio en /<repo>/ y no en la raíz.
// Antepone esa ruta base a las URLs absolutas ("/img/...", "/eventos/") del HTML y CSS ya compilados en dist/.
// La versión de AWS no lo necesita: CloudFront sirve el sitio en la raíz del dominio.
//
// Uso: node scripts/prefijar-base.mjs /web
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!base.startsWith('/')) {
  console.error('Indica la ruta base, por ejemplo: node scripts/prefijar-base.mjs /web');
  process.exit(1);
}
const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

async function* archivos(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) yield* archivos(ruta);
    else yield ruta;
  }
}

let cambiados = 0;
for await (const ruta of archivos(dist)) {
  let texto;
  if (ruta.endsWith('.html')) {
    texto = (await readFile(ruta, 'utf8')).replace(
      /\b(href|src|poster|data-src|content|action)="\/(?!\/)/g,
      (_, attr) => `${attr}="${base}/`,
    );
  } else if (ruta.endsWith('.css')) {
    texto = (await readFile(ruta, 'utf8')).replace(/url\(\/(?!\/)/g, `url(${base}/`);
  } else if (ruta.endsWith('.js')) {
    // Rutas de imágenes y videos escritas dentro de los scripts
    texto = (await readFile(ruta, 'utf8')).replace(/(["'`])\/(img|video|_astro)\//g, `$1${base}/$2/`);
  } else {
    continue;
  }
  await writeFile(ruta, texto);
  cambiados++;
}
console.log(`✅ Ruta base ${base} aplicada a ${cambiados} archivos de dist/`);
