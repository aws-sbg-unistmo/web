import datos from '../data/events.json';

// events.json lo genera scripts/fetch-meetup-events.mjs a partir del calendario del Meetup del grupo.
export interface Evento {
  id: string;
  titulo: string;
  inicio: string; // ISO 8601 en UTC
  fin?: string;
  lugar?: string;
  url?: string;
  descripcion?: string;
}

const eventos = (datos as Evento[]).slice().sort((a, b) => a.inicio.localeCompare(b.inicio));
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
