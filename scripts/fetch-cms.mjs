// Lee el contenido editable de Strapi (equipo, eventos y alianzas) y lo guarda en src/data/cms.json.
// Las imágenes se descargan a public/cms/ para servirlas desde el mismo sitio (S3 + CloudFront) y no depender de Strapi.
//
// Variables: STRAPI_URL (p. ej. https://d123.cloudfront.net) y STRAPI_TOKEN (token de solo lectura de Strapi).
// Sin STRAPI_URL no hace nada y la página usa los datos de src/data/site.ts.
// Si Strapi no responde, conserva el cms.json anterior para no borrar contenido de la página.
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.STRAPI_URL?.replace(/\/$/, '');
const TOKEN = process.env.STRAPI_TOKEN;
const SALIDA = 'src/data/cms.json';
const MEDIOS = 'public/cms';

if (!BASE) {
  console.log('Sin STRAPI_URL: la página usa los datos de src/data/site.ts.');
  process.exit(0);
}

const cabeceras = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};

async function api(ruta) {
  const res = await fetch(`${BASE}/api/${ruta}`, { headers: cabeceras, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${ruta}: HTTP ${res.status}`);
  return (await res.json()).data ?? [];
}

// Descarga una imagen de Strapi y devuelve su ruta dentro del sitio (/cms/…)
async function imagen(media) {
  if (!media?.url) return undefined;
  const origen = media.url.startsWith('http') ? media.url : `${BASE}${media.url}`;
  const nombre = `${media.hash ?? path.basename(media.url, media.ext)}${media.ext ?? path.extname(media.url)}`;
  const destino = path.join(MEDIOS, nombre);
  try {
    await fs.access(destino);
  } catch {
    const res = await fetch(origen, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) throw new Error(`imagen ${origen}: HTTP ${res.status}`);
    await fs.writeFile(destino, Buffer.from(await res.arrayBuffer()));
  }
  return `/cms/${nombre}`;
}

const lista = (texto) => (texto ?? '').split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
const redes = (r) => (r ?? []).filter((x) => x?.tipo && x?.url).map((x) => ({ tipo: x.tipo, url: x.url }));

try {
  await fs.mkdir(MEDIOS, { recursive: true });
  const [integrantes, eventos, alianzas] = await Promise.all([
    api('integrantes?populate=*&sort=orden:asc&pagination[pageSize]=100'),
    api('eventos?populate=*&sort=inicio:asc&pagination[pageSize]=200'),
    api('alianzas?populate=*&sort=orden:asc&pagination[pageSize]=100'),
  ]);

  const datos = {
    equipo: await Promise.all(
      integrantes.map(async (p) => ({
        nombre: p.nombre,
        rol: p.rol,
        carrera: p.carrera || undefined,
        descripcion: p.descripcion || undefined,
        ficha: (p.ficha ?? []).map((b) => ({ titulo: b.titulo, items: lista(b.elementos) })).filter((b) => b.items.length),
        fotos: (await Promise.all([p.foto, ...(p.fotosExtra ?? [])].map(imagen))).filter(Boolean),
        redes: redes(p.redes),
      })),
    ),
    eventos: await Promise.all(
      eventos.map(async (e) => ({
        id: `cms-${e.documentId}`,
        titulo: e.titulo,
        inicio: e.inicio,
        fin: e.fin || undefined,
        lugar: e.lugar || undefined,
        url: e.enlace || undefined,
        descripcion: e.descripcion || undefined,
        imagen: await imagen(e.imagen),
      })),
    ),
    alianzas: await Promise.all(
      alianzas.map(async (a) => ({
        nombre: a.nombre,
        tipo: a.tipo === 'Institucion' ? 'Institución' : a.tipo,
        texto: a.texto,
        lema: a.lema || undefined,
        url: a.url || undefined,
        logo: await imagen(a.logo),
        redes: redes(a.redes),
      })),
    ),
  };
  await fs.writeFile(SALIDA, `${JSON.stringify(datos, null, 2)}\n`);
  console.log(`Strapi: ${datos.equipo.length} integrantes, ${datos.eventos.length} eventos, ${datos.alianzas.length} alianzas.`);
} catch (error) {
  // Si Strapi falla, la compilación sigue con el contenido anterior
  console.warn(`No se pudo leer Strapi (${error.message}); se conserva ${SALIDA}.`);
}
