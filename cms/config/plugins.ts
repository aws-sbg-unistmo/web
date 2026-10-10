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
// CLOUDINARY_URL es la «API environment variable» del panel de Cloudinary: cloudinary://<key>:<secret>@<cloud>
// Todo se guarda en la carpeta CLOUDINARY_FOLDER (por defecto «aws-sbg-unistmo»), así la misma cuenta puede
// servir para otros proyectos (un portafolio, por ejemplo) sin mezclar archivos.
// Sin CLOUDINARY_URL, o si viene mal escrita, se guardan en public/uploads (local o AWS) y se avisa en el log.
const cloudinary = (url?: string, carpeta = 'aws-sbg-unistmo') => {
  if (!url) return {};
  try {
    const { protocol, username, password, hostname } = new URL(url.trim());
    if (protocol !== 'cloudinary:' || !username || !password || !hostname) throw new Error('formato');
    const opciones = { folder: carpeta };
    return {
      provider: 'cloudinary',
      providerOptions: { cloud_name: hostname, api_key: decodeURIComponent(username), api_secret: decodeURIComponent(password) },
      actionOptions: { upload: opciones, uploadStream: opciones, delete: {} },
    };
  } catch {
    console.warn('CLOUDINARY_URL no tiene el formato cloudinary://<key>:<secret>@<cloud>; las imágenes se guardan en el disco.');
    return {};
  }
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
      ...cloudinary(env('CLOUDINARY_URL'), env('CLOUDINARY_FOLDER', 'aws-sbg-unistmo')),
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
