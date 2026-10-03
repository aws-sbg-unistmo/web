// Personalización del panel de Strapi: logo y colores del grupo, y español como idioma.
import type { StrapiApp } from '@strapi/strapi/admin';
// @ts-ignore: Vite resuelve la imagen al compilar el panel
import logo from './logo.png';

const magenta = {
  primary100: '#ffe8fb',
  primary200: '#ffbdf4',
  primary500: '#ff57e9',
  primary600: '#e03ccb',
  primary700: '#b8239f',
  buttonPrimary500: '#ff57e9',
  buttonPrimary600: '#e03ccb',
};

export default {
  config: {
    locales: ['es'],
    auth: { logo },
    menu: { logo },
    head: { favicon: logo, title: 'CMS · AWS SBG UNISTMO' },
    theme: { light: { colors: magenta }, dark: { colors: magenta } },
    tutorials: false,
    notifications: { releases: false },
    translations: {
      es: {
        'Auth.form.welcome.title': 'CMS de AWS SBG UNISTMO',
        'Auth.form.welcome.subtitle': 'Entra para editar tu tarjeta del equipo, los eventos y las alianzas',
        'app.components.HomePage.welcome.again': 'Hola de nuevo',
      },
    },
  },
  bootstrap(_app: StrapiApp) {},
};
