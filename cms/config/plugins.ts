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

// En Heroku el disco se borra en cada reinicio: las imágenes van a Cloudinary (plan gratis).
// CLOUDINARY_URL es la «API environment variable» del panel de Cloudinary: cloudinary://<key>:<secret>@<cloud>
// Sin ella (local o AWS) se guardan en public/uploads.
const cloudinary = (url?: string) => {
  if (!url) return {};
  const { username, password, hostname } = new URL(url);
  return {
    provider: 'cloudinary',
    providerOptions: { cloud_name: hostname, api_key: decodeURIComponent(username), api_secret: decodeURIComponent(password) },
    actionOptions: { upload: {}, uploadStream: {}, delete: {} },
  };
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
      ...cloudinary(env('CLOUDINARY_URL')),
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes,
      },
    },
  },
});

export default config;
