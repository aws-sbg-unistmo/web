// Arranque del CMS del grupo:
// 1. Condición "Es su tarjeta": cada integrante (rol Author) edita y publica solo la tarjeta con su correo.
// 2. Permisos del rol Author: su tarjeta, sus eventos y sus alianzas, incluido publicar.
// 3. Datos iniciales (equipo y alianzas de la página) la primera vez, con sus fotos.
// 4. Token de solo lectura "web" para que GitHub Actions lea el contenido al compilar.
// 5. Al publicar o borrar algo, pide a GitHub que recompile la página (si hay GITHUB_TOKEN_DESPLIEGUE, un token
//    fine-grained con permiso "Actions: Read and write": solo puede lanzar el flujo, no cambiar el código).
import type { Core } from '@strapi/strapi';
import fs from 'node:fs';
import path from 'node:path';

const TIPOS = ['api::integrante.integrante', 'api::evento.evento', 'api::alianza.alianza'] as const;
const ACCIONES = ['create', 'read', 'update', 'delete', 'publish'].map((a) => `plugin::content-manager.explorer.${a}`);

const mime = (archivo: string) =>
  ({ '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' })[path.extname(archivo).toLowerCase()] ??
  'application/octet-stream';

async function registrarCondicion(strapi: Core.Strapi) {
  await strapi.service('admin::permission').conditionProvider.register({
    displayName: 'Es su tarjeta (mismo correo)',
    name: 'es-su-tarjeta',
    // Las condiciones se evalúan en memoria: solo admiten operadores simples ($in, $eq…)
    handler: (user: { email: string }) => ({ correoEditor: { $in: [user.email, user.email.toLowerCase()] } }),
  });
}

// Se aplica una sola vez (queda marcado en la base). Después se puede ajustar desde Ajustes → Roles.
async function permisosAutor(strapi: Core.Strapi) {
  const almacen = strapi.store({ type: 'core', name: 'aws-sbg' });
  if (await almacen.get({ key: 'permisos-autor-v1' })) return;
  const rol = await strapi.service('admin::role').findOne({ code: 'strapi-author' });
  if (!rol) return;
  const actuales = await strapi.service('admin::permission').findMany({ where: { role: { id: rol.id } } });
  const ajenos = actuales.filter((p: { subject?: string }) => !TIPOS.includes(p.subject as (typeof TIPOS)[number]));
  const nuevos = TIPOS.flatMap((subject) =>
    ACCIONES.map((action) => ({
      action,
      subject,
      properties: {},
      conditions: subject === 'api::integrante.integrante' ? ['admin::is-creator', 'api::es-su-tarjeta'] : ['admin::is-creator'],
    })),
  );
  await strapi.service('admin::role').assignPermissions(rol.id, [
    ...ajenos.map(({ action, subject, properties, conditions }: Record<string, unknown>) => ({ action, subject, properties, conditions })),
    ...nuevos,
  ]);
  await almacen.set({ key: 'permisos-autor-v1', value: true });
  strapi.log.info('Rol Author: puede editar y publicar su tarjeta, sus eventos y sus alianzas.');
}

// Se carga una sola vez (queda marcado en la base). Si el servidor se reinicia a la mitad, al volver
// solo crea lo que falte, buscando por nombre; después de terminar ya no recrea lo que borren.
async function datosIniciales(strapi: Core.Strapi) {
  const almacen = strapi.store({ type: 'core', name: 'aws-sbg' });
  if (await almacen.get({ key: 'datos-iniciales-v1' })) return;
  const archivo = path.join(process.cwd(), 'datos-iniciales.json');
  if (!fs.existsSync(archivo)) return;
  const datos = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const existe = async (uid: 'api::integrante.integrante' | 'api::alianza.alianza', nombre: string) =>
    Boolean(await strapi.documents(uid).findFirst({ filters: { nombre } }));

  const subir = async (ruta?: string) => {
    if (!ruta) return undefined;
    const completa = path.resolve(process.cwd(), ruta);
    if (!fs.existsSync(completa)) return undefined;
    const [subido] = await strapi.plugin('upload').service('upload').upload({
      data: {},
      files: { filepath: completa, originalFilename: path.basename(completa), mimetype: mime(completa), size: fs.statSync(completa).size },
    });
    return subido?.id;
  };

  for (const [i, p] of (datos.equipo ?? []).entries()) {
    if (await existe('api::integrante.integrante', p.nombre)) continue;
    const [foto, ...extra] = await Promise.all((p.fotos ?? []).map(subir));
    await strapi.documents('api::integrante.integrante').create({
      data: {
        nombre: p.nombre,
        rol: p.rol,
        carrera: p.carrera,
        descripcion: p.descripcion,
        correoEditor: p.correoEditor,
        foto,
        fotosExtra: extra.filter(Boolean),
        ficha: (p.ficha ?? []).map((b: { titulo: string; items: string[] }) => ({ titulo: b.titulo, elementos: b.items.join('\n') })),
        redes: p.redes ?? [],
        orden: (i + 1) * 10,
      },
      status: 'published',
    });
  }

  for (const [i, a] of (datos.alianzas ?? []).entries()) {
    if (await existe('api::alianza.alianza', a.nombre)) continue;
    await strapi.documents('api::alianza.alianza').create({
      data: { nombre: a.nombre, tipo: a.tipo, lema: a.lema, texto: a.texto, url: a.url, logo: await subir(a.logo), redes: a.redes ?? [], orden: (i + 1) * 10 },
      status: 'published',
    });
  }

  await almacen.set({ key: 'datos-iniciales-v1', value: true });
  strapi.log.info(`Datos iniciales: ${datos.equipo?.length ?? 0} integrantes y ${datos.alianzas?.length ?? 0} alianzas.`);
}

// Token de solo lectura para compilar la página. Se guarda una vez en .tmp/token-web.txt (no se sube a git).
async function tokenWeb(strapi: Core.Strapi) {
  const tokens = strapi.service('admin::api-token-content-api');
  if (await tokens.getByName('web')) return;
  const token = await tokens.create({ name: 'web', description: 'Lectura del contenido para compilar la página (GitHub Actions)', type: 'read-only', lifespan: null });
  try {
    const carpeta = path.join(process.cwd(), '.tmp');
    fs.mkdirSync(carpeta, { recursive: true });
    fs.writeFileSync(path.join(carpeta, 'token-web.txt'), `${token.accessKey}\n`, { mode: 0o600 });
    strapi.log.info('Token de lectura "web" creado y guardado en .tmp/token-web.txt (cópialo al secreto STRAPI_TOKEN de GitHub).');
  } catch {
    // En Heroku el disco no se puede usar: el token se copia desde el panel
    strapi.log.info('Token de lectura "web" creado: cópialo desde Ajustes → API Tokens → web al secreto STRAPI_TOKEN de GitHub.');
  }
}

// Pide a GitHub que recompile la página. Espera 45 s para juntar varios cambios seguidos en una sola compilación.
function avisarAGitHub(strapi: Core.Strapi) {
  const token = process.env.GITHUB_TOKEN_DESPLIEGUE;
  const repo = process.env.GITHUB_REPO || 'aws-sbg-unistmo/web';
  if (!token) {
    strapi.log.info('Sin GITHUB_TOKEN_DESPLIEGUE: la página se actualiza en la siguiente compilación programada (cada 6 h).');
    return;
  }
  let espera: NodeJS.Timeout | undefined;
  const pedir = () => {
    clearTimeout(espera);
    espera = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/desplegar.yml/dispatches`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'User-Agent': 'cms-aws-sbg-unistmo' },
          body: JSON.stringify({ ref: 'main', inputs: { origen: 'cms' } }),
        });
        strapi.log.info(`GitHub: recompilación pedida (HTTP ${res.status}).`);
      } catch (error) {
        strapi.log.warn(`GitHub: no se pudo pedir la recompilación (${(error as Error).message}).`);
      }
    }, 45_000);
  };
  // Solo cuentan los cambios en versiones publicadas (los borradores no salen en la página)
  const siPublicado = (evento: { result?: { publishedAt?: string | null } }) => {
    if (evento?.result?.publishedAt) pedir();
  };
  strapi.db.lifecycles.subscribe({ models: [...TIPOS], afterCreate: siPublicado, afterUpdate: siPublicado, afterDelete: siPublicado });
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await registrarCondicion(strapi);
    await permisosAutor(strapi);
    await tokenWeb(strapi);
    avisarAGitHub(strapi);
    // Sin await: subir las fotos iniciales tarda, y Heroku exige que el servidor responda en menos de 60 s
    datosIniciales(strapi).catch((error) => strapi.log.error(`Datos iniciales: ${(error as Error).message}`));
  },
};
