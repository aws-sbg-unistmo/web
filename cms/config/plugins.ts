import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedTypes = [
  'image/svg+xml',
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

// En Heroku el disco se borra en cada reinicio: las imágenes van a Cloudinary (plan gratis, sin tarjeta).
// CLOUDINARY_URL acepta dos formas:
//   - la «API environment variable» completa: cloudinary://<api_key>:<api_secret>@<cloud_name>
//   - solo el API Secret: la cuenta y el API Key (que no son secretos) salen de CLOUDINARY_CLOUD_NAME y
//     CLOUDINARY_API_KEY, o de los valores de la cuenta del grupo de abajo.
// Todo se guarda en la carpeta CLOUDINARY_FOLDER (por defecto «aws-sbg-unistmo»), así la misma cuenta puede
// servir para otros proyectos sin mezclar archivos.
// Sin CLOUDINARY_URL, o si viene mal, se guardan en public/uploads (local o AWS) y se avisa en el log.
const cuentaDelGrupo = { cloud: 'ecmkeirx', key: '995361137633893' };
const cloudinary = (url?: string, carpeta = 'aws-sbg-unistmo', cloud = cuentaDelGrupo.cloud, key = cuentaDelGrupo.key) => {
  const valor = url?.trim();
  if (!valor) return {};
  let datos: { cloud_name: string; api_key: string; api_secret: string };
  try {
    if (valor.startsWith('cloudinary://')) {
      const { username, password, hostname } = new URL(valor);
      if (!username || !password || !hostname) throw new Error('formato');
      datos = { cloud_name: hostname, api_key: decodeURIComponent(username), api_secret: decodeURIComponent(password) };
    } else if (/^[A-Za-z0-9_-]{20,}$/.test(valor)) {
      datos = { cloud_name: cloud, api_key: key, api_secret: valor };
      // La librería de Cloudinary lee CLOUDINARY_URL al cargarse y exige el formato completo: se lo armamos
      process.env.CLOUDINARY_URL = `cloudinary://${key}:${valor}@${cloud}`;
    } else {
      throw new Error('formato');
    }
  } catch {
    console.warn('CLOUDINARY_URL no es ni cloudinary://<key>:<secret>@<cloud> ni un API Secret; las imágenes se guardan en el disco.');
    delete process.env.CLOUDINARY_URL;
    return {};
  }
  const opciones = { folder: carpeta };
  return { provider: 'cloudinary', providerOptions: datos, actionOptions: { upload: opciones, uploadStream: opciones, delete: {} } };
};

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  'users-permissions': {
    config: {
      jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },
    },
  },
  upload: {
    config: {
      ...cloudinary(env('CLOUDINARY_URL'), env('CLOUDINARY_FOLDER', 'aws-sbg-unistmo'), env('CLOUDINARY_CLOUD_NAME', cuentaDelGrupo.cloud), env('CLOUDINARY_API_KEY', cuentaDelGrupo.key)),
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
