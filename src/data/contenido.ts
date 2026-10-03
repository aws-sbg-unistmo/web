// Contenido informativo de la página. Datos verificados en fuentes públicas (oct-2026).

// Colores por categoría, al estilo de los diagramas de arquitectura de AWS.
export const categorias = {
  computo: { nombre: 'Cómputo', color: '#ED7100', icono: 'rayo' },
  almacenamiento: { nombre: 'Almacenamiento', color: '#7AA116', icono: 'nube' },
  bases: { nombre: 'Bases de datos', color: '#C925D1', icono: 'base' },
  ia: { nombre: 'IA y machine learning', color: '#01A88D', icono: 'chispa' },
  redes: { nombre: 'Redes y entrega', color: '#8C4FFF', icono: 'globo' },
  seguridad: { nombre: 'Seguridad e identidad', color: '#DD344C', icono: 'escudo' },
} as const;
export type Categoria = keyof typeof categorias;

export const temas: { categoria: Categoria; servicios: { nombre: string; texto: string }[] }[] = [
  {
    categoria: 'computo',
    servicios: [
      { nombre: 'Amazon EC2', texto: 'Servidores virtuales que enciendes en minutos y pagas por segundo de uso.' },
      { nombre: 'AWS Lambda', texto: 'Ejecuta código sin administrar servidores: solo pagas cuando se ejecuta.' },
      { nombre: 'AWS Fargate', texto: 'Corre contenedores sin preocuparte por las máquinas que hay debajo.' },
    ],
  },
  {
    categoria: 'almacenamiento',
    servicios: [
      { nombre: 'Amazon S3', texto: 'Guarda archivos de cualquier tamaño y publica sitios web estáticos.' },
      { nombre: 'Amazon EBS', texto: 'Discos de alto rendimiento para tus servidores de EC2.' },
      { nombre: 'Amazon EFS', texto: 'Un sistema de archivos que comparten varios servidores a la vez.' },
    ],
  },
  {
    categoria: 'bases',
    servicios: [
      { nombre: 'Amazon DynamoDB', texto: 'Base de datos NoSQL sin servidores, con respuesta en milisegundos.' },
      { nombre: 'Amazon RDS', texto: 'MySQL, PostgreSQL y más, con respaldos y actualizaciones automáticas.' },
      { nombre: 'Amazon Aurora', texto: 'Base de datos relacional de alto rendimiento hecha para la nube.' },
    ],
  },
  {
    categoria: 'ia',
    servicios: [
      { nombre: 'Amazon Bedrock', texto: 'Acceso a modelos fundacionales para crear asistentes y agentes con IA generativa.' },
      { nombre: 'Amazon SageMaker AI', texto: 'Prepara datos, entrena y despliega tus propios modelos de machine learning.' },
      { nombre: 'Amazon Rekognition', texto: 'Analiza imágenes y video: detecta objetos, texto y rostros.' },
    ],
  },
  {
    categoria: 'redes',
    servicios: [
      { nombre: 'Amazon VPC', texto: 'Tu propia red privada en la nube, con subredes y reglas de acceso.' },
      { nombre: 'Amazon CloudFront', texto: 'Entrega tu contenido rápido en todo el mundo desde ubicaciones cercanas.' },
      { nombre: 'Amazon API Gateway', texto: 'Crea, publica y protege APIs para tus aplicaciones.' },
    ],
  },
  {
    categoria: 'seguridad',
    servicios: [
      { nombre: 'AWS IAM', texto: 'Decide quién puede hacer qué en tu cuenta, con el mínimo privilegio.' },
      { nombre: 'Amazon Cognito', texto: 'Registro e inicio de sesión de usuarios para tus apps.' },
      { nombre: 'AWS WAF', texto: 'Protege tus aplicaciones web de ataques y bots.' },
    ],
  },
];

export const beneficios = [
  { icono: 'taller', titulo: 'Aprende gratis y practicando', texto: 'Talleres guiados donde construyes en AWS desde el primer día.' },
  { icono: 'certificado', titulo: 'Prepárate para certificarte', texto: 'Grupos de estudio para tu primera certificación de AWS.' },
  { icono: 'proyecto', titulo: 'Proyectos para tu portafolio', texto: 'Sales con proyectos reales que puedes mostrar a reclutadores.' },
  { icono: 'usuarios', titulo: 'Red de contactos', texto: 'Conoce a estudiantes, profesionales y comunidades tech de México.' },
  { icono: 'evento', titulo: 'Eventos con expertos', texto: 'Charlas y talleres con gente que trabaja en la nube todos los días.' },
  { icono: 'globo', titulo: 'Comunidad global', texto: 'Formas parte de una red de grupos estudiantiles de AWS en todo el mundo.' },
] as const;

// Recursos públicos y gratuitos de AWS para empezar por tu cuenta
export const recursos = [
  { nombre: 'AWS Skill Builder', texto: 'Cursos y laboratorios en línea, muchos gratuitos, para todos los niveles.', url: 'https://skillbuilder.aws', etiqueta: 'Cursos' },
  { nombre: 'AWS Builder Center', texto: 'La comunidad de builders: artículos, eventos y el espacio de los Student Builder Groups.', url: 'https://builder.aws.com', etiqueta: 'Comunidad' },
  { nombre: 'Capa gratuita de AWS', texto: 'Prueba servicios de AWS sin costo dentro de los límites de la capa gratuita.', url: 'https://aws.amazon.com/es/free/', etiqueta: 'Práctica' },
  { nombre: 'Documentación de AWS', texto: 'Guías y tutoriales oficiales de cada servicio, muchos en español.', url: 'https://docs.aws.amazon.com/es_es/', etiqueta: 'Guías' },
  { nombre: 'Certificaciones de AWS', texto: 'Conoce los exámenes, sus temas y cómo prepararte.', url: 'https://aws.amazon.com/es/certification/', etiqueta: 'Certificación' },
  { nombre: 'AWS Educate', texto: 'Contenido de aprendizaje gratuito pensado para estudiantes.', url: 'https://aws.amazon.com/es/education/awseducate/', etiqueta: 'Estudiantes' },
] as const;

export const certificaciones = [
  {
    nombre: 'AWS Certified Cloud Practitioner',
    nivel: 'Fundamental',
    texto: 'Valida que entiendes la nube de AWS: servicios principales, seguridad, precios y soporte. Ideal como primera certificación, sin experiencia técnica previa.',
    temas: ['Conceptos de la nube', 'Seguridad y cumplimiento', 'Tecnología y servicios', 'Facturación y precios'],
  },
  {
    nombre: 'AWS Certified AI Practitioner',
    nivel: 'Fundamental',
    texto: 'Valida que conoces los conceptos de IA, machine learning e IA generativa, y cómo usarlos de forma responsable con servicios de AWS.',
    temas: ['Fundamentos de IA y ML', 'IA generativa', 'Modelos fundacionales', 'IA responsable'],
  },
] as const;

export const glosario = [
  { t: 'Región', d: 'Ubicación geográfica con varios centros de datos de AWS. México tiene la suya: mx-central-1, en Querétaro.' },
  { t: 'Zona de disponibilidad', d: 'Uno o más centros de datos aislados dentro de una región. Usar varias protege tu app si una falla.' },
  { t: 'Instancia', d: 'Un servidor virtual de Amazon EC2 que puedes encender, apagar y redimensionar.' },
  { t: 'Bucket', d: 'Un contenedor de Amazon S3 donde guardas archivos (objetos).' },
  { t: 'Serverless', d: 'Forma de construir apps sin administrar servidores: AWS se encarga y tú pagas por uso.' },
  { t: 'IAM', d: 'El servicio que controla quién puede acceder a qué en tu cuenta de AWS.' },
  { t: 'Mínimo privilegio', d: 'Dar a cada usuario o servicio solo los permisos que necesita, nada más.' },
  { t: 'Escalabilidad', d: 'La capacidad de crecer o reducir recursos según la demanda, de forma automática.' },
  { t: 'Alta disponibilidad', d: 'Diseñar para que tu servicio siga funcionando aunque falle una parte.' },
  { t: 'Infraestructura como código', d: 'Describir tu infraestructura en archivos (por ejemplo, con AWS SAM o CloudFormation) en lugar de crearla a mano.' },
  { t: 'Modelo fundacional', d: 'Un modelo de IA grande, entrenado con muchos datos, que se adapta a muchas tareas (texto, imágenes, código).' },
  { t: 'CDN', d: 'Red de distribución de contenido: entrega archivos desde servidores cercanos al usuario, como Amazon CloudFront.' },
] as const;

// Datos de la universidad: sitio oficial (unistmo.edu.mx) y Wikipedia, consultados en oct-2026.
export const universidad = {
  nombre: 'Universidad del Istmo (UNISTMO)',
  texto:
    'Universidad pública del Gobierno del Estado de Oaxaca, parte del Sistema de Universidades Estatales de Oaxaca (SUNEO). Se creó por decreto el 18 de junio de 2002, empezó a dar clases en julio de ese año y tiene campus en Santo Domingo Tehuantepec, Ciudad Ixtepec y Juchitán de Zaragoza.',
  lema: { latin: 'Voluntas totum potest', zapoteco: "Guiraa zanda ne guendaracala'dxi", significado: 'Todo lo puedes si tú lo quieres' },
  datos: [
    { valor: '2002', texto: 'año de fundación' },
    { valor: '3', texto: 'campus en el Istmo de Tehuantepec' },
    { valor: '13', texto: 'licenciaturas en total' },
    { valor: '7', texto: 'ingenierías y licenciaturas en el Campus Tehuantepec' },
  ],
  carrerasTehuantepec: [
    'Ingeniería en Computación',
    'Ingeniería en Diseño',
    'Ingeniería en Energías Renovables',
    'Ingeniería Química',
    'Ingeniería de Petróleos',
    'Ingeniería Industrial',
    'Licenciatura en Matemáticas Aplicadas',
  ],
  campus: [
    {
      nombre: 'Tehuantepec',
      direccion: 'Ciudad Universitaria s/n, Barrio Santa Cruz Tagolaba, C.P. 70760, Santo Domingo Tehuantepec, Oaxaca',
      mapa: 'https://www.google.com/maps/search/?api=1&query=16.2910,-95.2390',
      aqui: true,
    },
    {
      nombre: 'Ixtepec',
      direccion: 'Carretera Chihuitán–Ixtepec s/n, C.P. 70110, Ciudad Ixtepec, Oaxaca',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Universidad+del+Istmo+Campus+Ixtepec',
    },
    {
      nombre: 'Juchitán',
      direccion: 'Carretera Transístmica Juchitán–La Ventosa km 14, La Ventosa, Juchitán, Oaxaca',
      mapa: 'https://www.google.com/maps/search/?api=1&query=Universidad+del+Istmo+Campus+Juchit%C3%A1n',
    },
  ],
  // Punto central del Campus Tehuantepec (Circuito Universitario, OpenStreetMap)
  coordenadas: { lat: 16.291, lon: -95.239 },
  // Fotos con licencia libre de Wikimedia Commons. La licencia pide dar crédito y enlazarla.
  fotos: [
    {
      src: '/img/unistmo/entrada-tehuantepec.webp', ancho: 724, alto: 347,
      titulo: 'Entrada del Campus Tehuantepec',
      autor: 'Universidad del Istmo', licencia: 'CC BY-SA 4.0', licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
      fuente: 'https://commons.wikimedia.org/wiki/File:Unistmo.jpg',
    },
    {
      src: '/img/unistmo/entrada-ixtepec.webp', ancho: 800, alto: 450,
      titulo: 'Entrada del Campus Ixtepec',
      autor: 'Luixlaag', licencia: 'CC BY-SA 4.0', licenciaUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
      fuente: 'https://commons.wikimedia.org/wiki/File:Unistmo_Ixtepec.jpg',
    },
    {
      src: '/img/unistmo/biblioteca-tehuantepec.webp', ancho: 960, alto: 720,
      titulo: 'Biblioteca Pública de la UNISTMO en el centro de Tehuantepec',
      autor: 'Adam Jones', licencia: 'CC BY-SA 2.0', licenciaUrl: 'https://creativecommons.org/licenses/by-sa/2.0/deed.es',
      fuente: 'https://commons.wikimedia.org/wiki/File:Facade_of_University_of_the_Isthmus_Library_-_Tehuantepec_-_Isthmus_Region_-_Oaxaca_-_Mexico_-_01_(6541222857).jpg',
    },
  ],
};

export const regionMexico = {
  codigo: 'mx-central-1',
  nombre: 'AWS Región México (Central)',
  lugar: 'Querétaro',
  apertura: 'enero de 2025',
  zonas: 3,
};
