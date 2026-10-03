// Descarga el calendario público (iCal) del Meetup del grupo y lo guarda en src/data/events.json.
// Lo ejecuta GitHub Actions antes de cada compilación. Si Meetup no responde, deja el archivo como estaba
// para que la página nunca se quede sin eventos por un fallo temporal.
//
// Uso: node scripts/fetch-meetup-events.mjs [--archivo prueba.ics]
import { readFile, writeFile } from 'node:fs/promises';

const GRUPO = 'aws-sbg-at-university-of-the-isthmus-tehuantepec-campus';
const URL_ICAL = `https://www.meetup.com/${GRUPO}/events/ical/`;
const DESTINO = new URL('../src/data/events.json', import.meta.url);

// --- lectura del iCal -------------------------------------------------------

// Las líneas largas de iCal se parten y continúan con un espacio o tabulador al inicio.
const desplegar = (texto) => texto.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');

const desescapar = (valor) =>
  valor.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\').trim();

// Diferencia en ms entre la hora local de una zona y UTC en un instante dado.
function desfase(instante, zona) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: zona, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(new Date(instante)).map((p) => [p.type, p.value]),
  );
  const comoUTC = Date.UTC(+partes.year, +partes.month - 1, +partes.day, +partes.hour, +partes.minute, +partes.second);
  return comoUTC - instante;
}

// "20261015T170000" + zona -> ISO en UTC. Con "Z" al final ya viene en UTC.
function aISO(valor, zona) {
  const m = valor.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!m) return null;
  const [, a, mes, d, h = '00', mi = '00', s = '00', z] = m;
  const comoUTC = Date.UTC(+a, +mes - 1, +d, +h, +mi, +s);
  if (z || !zona) return new Date(comoUTC).toISOString();
  let utc = comoUTC - desfase(comoUTC, zona);
  utc = comoUTC - desfase(utc, zona); // segunda pasada por si cae en un cambio de horario
  return new Date(utc).toISOString();
}

export function leerICal(texto) {
  const eventos = [];
  for (const bloque of desplegar(texto).split('BEGIN:VEVENT').slice(1)) {
    const cuerpo = bloque.split('END:VEVENT')[0];
    const campos = {};
    for (const linea of cuerpo.split('\n')) {
      const i = linea.indexOf(':');
      if (i < 1) continue;
      const [nombre, ...params] = linea.slice(0, i).split(';');
      campos[nombre.toUpperCase()] = { valor: linea.slice(i + 1), params };
    }
    const zonaDe = (campo) => campo?.params.find((p) => p.startsWith('TZID='))?.slice(5);
    const inicio = campos.DTSTART && aISO(campos.DTSTART.valor, zonaDe(campos.DTSTART));
    if (!campos.SUMMARY || !inicio) continue;
    const descripcion = campos.DESCRIPTION ? desescapar(campos.DESCRIPTION.valor) : '';
    eventos.push({
      id: campos.UID ? desescapar(campos.UID.valor) : inicio,
      titulo: desescapar(campos.SUMMARY.valor),
      inicio,
      fin: campos.DTEND ? aISO(campos.DTEND.valor, zonaDe(campos.DTEND)) ?? undefined : undefined,
      lugar: campos.LOCATION ? desescapar(campos.LOCATION.valor) : undefined,
      url: campos.URL ? desescapar(campos.URL.valor) : undefined,
      descripcion: descripcion.length > 320 ? `${descripcion.slice(0, 317).trimEnd()}…` : descripcion,
    });
  }
  return eventos.sort((a, b) => a.inicio.localeCompare(b.inicio));
}

// --- ejecución --------------------------------------------------------------

async function obtenerTexto() {
  const i = process.argv.indexOf('--archivo');
  if (i > -1) return readFile(process.argv[i + 1], 'utf8');
  const res = await fetch(URL_ICAL, {
    headers: { 'User-Agent': 'aws-sbg-unistmo-web (+https://github.com/aws-sbg-unistmo)' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`Meetup respondió ${res.status}`);
  return res.text();
}

async function main() {
  let texto;
  try {
    texto = await obtenerTexto();
  } catch (err) {
    console.warn(`⚠️  No se pudo leer el calendario de Meetup (${err.message}). Se conservan los eventos anteriores.`);
    return;
  }
  if (!texto.includes('BEGIN:VCALENDAR')) {
    console.warn('⚠️  La respuesta de Meetup no es un calendario iCal. Se conservan los eventos anteriores.');
    return;
  }
  const eventos = leerICal(texto);
  await writeFile(DESTINO, `${JSON.stringify(eventos, null, 2)}\n`);
  console.log(`✅ ${eventos.length} evento(s) guardados en src/data/events.json`);
}

// Solo corre al ejecutarse directo; al importarlo (por ejemplo, en una prueba) no descarga nada.
if (process.argv[1]?.endsWith('fetch-meetup-events.mjs')) await main();
