## Proyecto

Página del AWS Student Builder Group UNISTMO. Todo el contenido, los nombres de variables y los comentarios están en español.

- El contenido editable vive en `src/data/site.ts`. `src/data/events.json` lo genera `scripts/fetch-meetup-events.mjs`; no se edita a mano.
- Animaciones:
  - Lo que se ve al cargar (portada y encabezados) usa CSS: clases `entrada` y `palabra-css`, para no retrasar el LCP.
  - Lo que está más abajo usa atributos `data-*` que procesa `src/scripts/animaciones.ts`.
- Respeta `prefers-reduced-motion`. No uses iconos oficiales de AWS ni la fuente Amazon Ember en el sitio: ambos son activos del programa bajo NDA.
- Backend: `backend/template.yaml` (AWS SAM) y `backend/src/forms/index.mjs`. Valida la plantilla con `cfn-lint`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
