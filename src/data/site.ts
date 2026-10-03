// Datos generales del grupo. Si cambia un enlace o un texto, se cambia aquí y se actualiza en toda la página.
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
  { nombre: 'Instagram', usuario: '@aws.unistmo', url: 'https://www.instagram.com/aws.unistmo/' },
  { nombre: 'TikTok', usuario: '@awssbg_unistmo', url: 'https://www.tiktok.com/@awssbg_unistmo' },
  { nombre: 'Facebook', usuario: 'AWS SBG Unistmo', url: 'https://www.facebook.com/profile.php?id=61594785430906' },
  { nombre: 'YouTube', usuario: '@aws_sbg.unistmo', url: 'https://www.youtube.com/@aws_sbg.unistmo' },
  { nombre: 'LinkedIn', usuario: 'AWS SBG UNISTMO', url: 'https://www.linkedin.com/company/aws-sbg-unistmo/' },
  { nombre: 'GitHub', usuario: 'aws-sbg-unistmo', url: 'https://github.com/aws-sbg-unistmo' },
];

export const navegacion = [
  { texto: 'Inicio', url: '/' },
  { texto: 'Aprende', url: '/aprende/' },
  { texto: 'Eventos', url: '/eventos/' },
  { texto: 'Nosotros', url: '/nosotros/' },
  { texto: 'Únete', url: '/unete/' },
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
export type Integrante = { nombre: string; rol: string; carrera?: string; descripcion?: string; fotos?: string[]; redes?: Red[] };
export const equipo: Integrante[] = [
  {
    nombre: 'Jean Paul Gallegos Cruz',
    rol: 'Student Builder Group Leader',
    carrera: 'Ingeniería en Computación',
    descripcion:
      'Fundé el AWS Student Builder Group de la UNISTMO. También soy Google Student Ambassador ’26 y parte de Nexis Oaxaca Tech. Comparto lo que aprendo en los programas tech: cloud, seguridad y backend.',
    fotos: ['/img/equipo/jean-paul.webp', '/img/equipo/jean-paul-2.webp', '/img/equipo/jean-paul-3.webp'],
    redes: [
      { tipo: 'linkedin', url: 'https://www.linkedin.com/in/jeanpaulgc' },
      { tipo: 'github', url: 'https://github.com/Jean1722343' },
      { tipo: 'instagram', url: 'https://www.instagram.com/jpgallegosc' },
      { tipo: 'tiktok', url: 'https://www.tiktok.com/@jpgallegosc' },
      { tipo: 'facebook', url: 'https://www.facebook.com/profile.php?id=61593415306721' },
    ],
  },
  { nombre: 'Joan Garfias', rol: 'Core Team', redes: [{ tipo: 'instagram', url: 'https://www.instagram.com/joangarfias_/' }] },
  { nombre: 'Jeovani Pacheco Bautista', rol: 'Core Team', redes: [{ tipo: 'instagram', url: 'https://www.instagram.com/jeovanipachecobautista/' }] },
  { nombre: 'Gerónimo', rol: 'Core Team' },
];

// Comunidades, empresas e instituciones aliadas. Con la lista vacía la página muestra cómo ser aliado.
// Ejemplo: { nombre: 'Nombre', tipo: 'Comunidad', texto: 'Qué hacemos juntos', url: 'https://…', logo: '/img/alianzas/nombre.png' }
export type Alianza = { nombre: string; tipo: 'Comunidad' | 'Empresa' | 'Institución' | 'Medio'; texto: string; url?: string; logo?: string };
export const alianzas: Alianza[] = [];
