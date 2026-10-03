import datos from '../data/events.json';
import cms from '../data/cms.json';

// events.json lo genera scripts/fetch-meetup-events.mjs a partir del calendario del Meetup del grupo.
// cms.json trae los eventos creados en Strapi (scripts/fetch-cms.mjs). Se juntan ambos; si un evento de Strapi
// enlaza al mismo Meetup que uno del calendario, se queda el de Strapi (que puede traer imagen y más datos).
export interface Evento {
  id: string;
  titulo: string;
  inicio: string; // ISO 8601 en UTC
  fin?: string;
  lugar?: string;
  url?: string;
  descripcion?: string;
  imagen?: string;
}

const deStrapi = cms.eventos as Evento[];
const enlaces = new Set(deStrapi.map((e) => e.url).filter(Boolean));
const eventos = [...(datos as Evento[]).filter((e) => !e.url || !enlaces.has(e.url)), ...deStrapi]
  .sort((a, b) => a.inicio.localeCompare(b.inicio));
const ahora = new Date().toISOString();

// "Ahora" es el momento de la compilación: la página se recompila cada 6 h con GitHub Actions.
export const proximos = eventos.filter((e) => (e.fin ?? e.inicio) >= ahora);
export const pasados = eventos.filter((e) => (e.fin ?? e.inicio) < ahora).reverse();

const zona = 'America/Mexico_City';

export const fechaLarga = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', { dateStyle: 'full', timeZone: zona }).format(new Date(iso));

export const hora = (iso: string) =>
  new Intl.DateTimeFormat('es-MX', { timeStyle: 'short', timeZone: zona }).format(new Date(iso));

export const diaYMes = (iso: string) => {
  const partes = new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', timeZone: zona }).formatToParts(new Date(iso));
  return {
    dia: partes.find((p) => p.type === 'day')?.value ?? '',
    mes: (partes.find((p) => p.type === 'month')?.value ?? '').replace('.', '').toUpperCase(),
  };
};
