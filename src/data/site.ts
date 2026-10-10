// Datos generales del grupo. Si cambia un enlace o un texto, se cambia aquí y se actualiza en toda la página.
// El equipo, las alianzas y los eventos también se pueden editar desde Strapi (cms/): si Strapi tiene contenido,
// scripts/fetch-cms.mjs lo guarda en cms.json al compilar y tiene prioridad sobre lo que está escrito aquí.
import cms from './cms.json';
export const site = {
  nombre: 'AWS Student Builder Group UNISTMO',
  corto: 'AWS SBG UNISTMO',
  lema: 'Cloud, IA y comunidad desde el Istmo',
  descripcion:
    'Comunidad estudiantil de AWS en la Universidad del Istmo, Campus Tehuantepec. Talleres, eventos y proyectos de cloud computing e inteligencia artificial.',
  campus: 'Universidad del Istmo · Campus Tehuantepec, Oaxaca',
  meetup: 'https://www.meetup.com/aws-sbg-at-university-of-the-isthmus-tehuantepec-campus/',
  correo: 'aws.unistmo@gmail.com',
  github: 'https://github.com/aws-sbg-unistmo',
  // Invitación a la comunidad de WhatsApp. No caduca mientras nadie la restablezca en WhatsApp; si se restablece,
  // se cambia aquí y se actualizan el botón, el QR y el enlace corto /whatsapp.
  whatsapp: 'https://chat.whatsapp.com/HV8T0piGjky8Iq7ttQ7R36',
  // La mascota lleva el logo de AWS en la playera: se usa mientras el Account Manager la apruebe.
  // Para quitarla de toda la página basta con poner false.
  usarMascota: true,
};

// Barra de aviso arriba de toda la página (como la de aws.amazon.com). Con texto vacío no se muestra.
export const anuncio = {
  etiqueta: 'Nuevo',
  texto: 'Ya somos AWS Student Builder Group en la UNISTMO. Únete al Meetup para el primer evento',
  corto: 'Únete al Meetup para el primer evento',
  url: 'https://www.meetup.com/aws-sbg-at-university-of-the-isthmus-tehuantepec-campus/',
};

export const redes = [
  { tipo: 'instagram', nombre: 'Instagram', usuario: '@aws.unistmo', url: 'https://www.instagram.com/aws.unistmo/' },
  { tipo: 'tiktok', nombre: 'TikTok', usuario: '@awssbg_unistmo', url: 'https://www.tiktok.com/@awssbg_unistmo' },
  { tipo: 'facebook', nombre: 'Facebook', usuario: 'AWS SBG Unistmo', url: 'https://www.facebook.com/profile.php?id=61594785430906' },
  { tipo: 'youtube', nombre: 'YouTube', usuario: '@aws_sbg.unistmo', url: 'https://www.youtube.com/@aws_sbg.unistmo' },
  { tipo: 'linkedin', nombre: 'LinkedIn', usuario: 'AWS SBG UNISTMO', url: 'https://www.linkedin.com/company/aws-sbg-unistmo/' },
  { tipo: 'github', nombre: 'GitHub', usuario: 'aws-sbg-unistmo', url: 'https://github.com/aws-sbg-unistmo' },
] as const;

export const navegacion = [
  { texto: 'Inicio', url: '/' },
  { texto: 'Aprende', url: '/aprende/' },
  { texto: 'Eventos', url: '/eventos/' },
  { texto: 'Nosotros', url: '/nosotros/' },
  { texto: 'Contacto', url: '/contacto/' },
];

// Lo que hace el grupo. El icono es el nombre de un trazo SVG de src/components/Icono.astro.
export const actividades = [
  {
    icono: 'taller',
    titulo: 'Talleres prácticos',
    texto: 'Construimos en la consola de AWS desde el primer día: servidores, sitios web, bases de datos e IA generativa.',
  },
  {
    icono: 'evento',
    titulo: 'Eventos y charlas',
    texto: 'Traemos a profesionales de AWS y de la comunidad tech para que conozcas cómo se trabaja de verdad en la nube.',
  },
  {
    icono: 'proyecto',
    titulo: 'Proyectos en equipo',
    texto: 'Armamos proyectos reales para tu portafolio, como esta misma página, que corre en S3, CloudFront y Lambda.',
  },
  {
    icono: 'certificado',
    titulo: 'Rumbo a certificarte',
    texto: 'Te acompañamos a preparar tu primera certificación de AWS y a aprovechar los beneficios para estudiantes.',
  },
];

// Servicios que se mencionan en la cinta animada. Solo texto: los iconos oficiales de AWS no se usan como decoración.
export const servicios = [
  'Amazon S3', 'AWS Lambda', 'Amazon EC2', 'Amazon DynamoDB', 'Amazon Bedrock', 'Amazon CloudFront',
  'Amazon API Gateway', 'AWS IAM', 'Amazon RDS', 'Amazon SageMaker', 'Amazon VPC', 'AWS Amplify',
];

// Core Team. Para agregar a alguien basta con sumar un objeto.
// "fotos": la primera es la principal (vertical 4:5, en public/img/equipo/); las demás flotan alrededor.
export type Red = { tipo: 'linkedin' | 'instagram' | 'github' | 'youtube' | 'tiktok' | 'x' | 'facebook' | 'web'; url: string };
// "ficha": bloques cortos (especialidad, intereses, credenciales, stack…) que se muestran como etiquetas.
export type Integrante = {
  nombre: string;
  rol: string;
  carrera?: string;
  descripcion?: string;
  ficha?: { titulo: string; items: string[] }[];
  fotos?: string[];
  redes?: Red[];
};
const equipoLocal: Integrante[] = [
  {
    nombre: 'Jean Paul Gallegos Cruz',
    rol: 'Student Builder Group Leader',
    carrera: 'Ingeniería en Computación',
    descripcion:
      'Fundé el AWS Student Builder Group de la UNISTMO. Me enfoco en la seguridad en la nube —AWS, Google Cloud y Azure— y en backend con Python y Laravel, con la IA como hilo que lo une todo. Soy Google Student Ambassador ’26, de la primera generación en México, y organizo eventos con Nexis Oaxaca Tech.',
    ficha: [
      { titulo: 'Especialidad', items: ['Cloud Security', 'Ciberseguridad multinube', 'Backend'] },
      { titulo: 'Me apasiona', items: ['IA', 'Cloud', 'Ciberseguridad', 'Automatización', 'Robótica'] },
      { titulo: 'Credenciales', items: ['Google Student Ambassador ’26', 'Google Cloud Cybersecurity', 'Google Cloud Computing Foundations', 'Cédula técnica en programación'] },
      { titulo: 'Stack', items: ['Python', 'PHP · Laravel', 'C', 'Dart', 'Docker', 'Bash', 'AWS', 'Google Cloud'] },
    ],
    fotos: ['/img/equipo/jean-paul.webp', '/img/equipo/jean-paul-2.webp', '/img/equipo/jean-paul-3.webp'],
    redes: [
      { tipo: 'linkedin', url: 'https://www.linkedin.com/in/jeanpaulgc' },
      { tipo: 'github', url: 'https://github.com/Jean1722343' },
      { tipo: 'instagram', url: 'https://www.instagram.com/jpgallegosc' },
      { tipo: 'tiktok', url: 'https://www.tiktok.com/@jpgallegosc' },
      { tipo: 'facebook', url: 'https://www.facebook.com/profile.php?id=61593415306721' },
    ],
  },
  {
    nombre: 'Joan Garfias',
    rol: 'Core Team',
    descripcion: 'Desarrollador backend y cofundador de Nexis Oaxaca Tech. Hoy está aprendiendo cloud computing.',
    ficha: [{ titulo: 'Especialidad', items: ['Backend', 'Cloud computing'] }],
    fotos: ['/img/equipo/joan.webp'],
    redes: [
      { tipo: 'linkedin', url: 'https://www.linkedin.com/in/joangarfias/' },
      { tipo: 'github', url: 'https://github.com/JoanGarfias' },
      { tipo: 'instagram', url: 'https://www.instagram.com/joangarfias_/' },
    ],
  },
  { nombre: 'Gerónimo', rol: 'Core Team' },
];

// Voluntarios: ayudan con su tiempo y conocimiento. Es un rol sin beneficios (ver Nosotros → Voluntariado).
const voluntariosLocal: Integrante[] = [
  {
    nombre: 'Jeovani Pacheco Rueda',
    rol: 'Voluntario',
    carrera: 'Programador full stack',
    descripcion: 'Programador full stack en Onexo y estudiante de la UNISTMO en Tehuantepec. Apoya en los talleres y en los proyectos del grupo.',
    fotos: ['/img/equipo/jeovani.webp'],
    redes: [
      { tipo: 'linkedin', url: 'https://www.linkedin.com/in/jeovanipacheco/' },
      { tipo: 'github', url: 'https://github.com/JeovaniPacheco' },
      { tipo: 'instagram', url: 'https://www.instagram.com/jeovanipachecobautista/' },
    ],
  },
];

// Comunidades, empresas e instituciones aliadas. Con la lista vacía la página muestra cómo ser aliado.
// Ejemplo: { nombre: 'Nombre', tipo: 'Comunidad', texto: 'Qué hacemos juntos', url: 'https://…', logo: '/img/alianzas/nombre.png' }
// "redes": todas sus redes; se muestran en una ventana al tocar su tarjeta.
export type Alianza = { nombre: string; tipo: 'Comunidad' | 'Empresa' | 'Institución' | 'Medio'; texto: string; lema?: string; url?: string; logo?: string; redes?: Red[] };
const alianzasLocal: Alianza[] = [
  {
    nombre: 'Nexis Oaxaca Tech',
    tipo: 'Comunidad',
    lema: 'Aprende · Conecta · Construye',
    texto:
      'Comunidad de Oaxaca que conecta a estudiantes, desarrolladores y personas apasionadas por la tecnología para aprender, compartir conocimiento y crear proyectos reales.',
    url: 'https://nexisoaxaca.tech/',
    logo: '/img/alianzas/nexis.webp',
    redes: [
      { tipo: 'web', url: 'https://nexisoaxaca.tech/' },
      { tipo: 'instagram', url: 'https://www.instagram.com/nexis.oaxaca' },
      { tipo: 'facebook', url: 'https://www.facebook.com/nexisoaxaca' },
      { tipo: 'linkedin', url: 'https://www.linkedin.com/company/nexis-oaxaca/' },
      { tipo: 'youtube', url: 'https://www.youtube.com/@NexisOaxaca' },
      { tipo: 'github', url: 'https://github.com/Nexis-Oaxaca' },
    ],
  },
];

// Lo que viene de Strapi tiene prioridad; si está vacío, se usa lo escrito arriba
export const equipo: Integrante[] = cms.equipo.length ? (cms.equipo as Integrante[]) : equipoLocal;
export const alianzas: Alianza[] = cms.alianzas.length ? (cms.alianzas as Alianza[]) : alianzasLocal;
export const voluntarios: Integrante[] = cms.voluntarios?.length ? (cms.voluntarios as Integrante[]) : voluntariosLocal;
