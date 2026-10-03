# CMS del grupo (Strapi)

Panel para editar, sin tocar código, lo que más cambia en la página:

| Colección | Quién la edita | Qué aparece en la página |
|---|---|---|
| **Integrante del equipo** | Cada integrante, solo su tarjeta | Nosotros → «Quién está detrás» |
| **Evento** | Cualquier integrante (los suyos) | Inicio y Eventos, junto con los de Meetup |
| **Alianza** | Cualquier integrante (las suyas) | Nosotros → Alianzas |

Al **publicar** algo, Strapi lanza el flujo «Desplegar página» de GitHub y en 2–3 minutos se ve en la página.
Los borradores no salen.

## Permisos

- **Super Admin** (Group Leader): todo, incluidos usuarios y ajustes.
- **Editor**: edita y publica todo el contenido.
- **Author** (cada integrante del Core Team):
  - Edita y publica **solo su tarjeta**: la que tiene su correo en el campo «Correo del editor».
  - Crea y publica sus propios eventos y alianzas.
  - No puede tocar lo de los demás.

Para dar acceso a alguien:
1. Ajustes → Usuarios → Invitar, con rol **Author**.
2. Escribe ese mismo correo en «Correo del editor» de su tarjeta.

## Trabajar en local

```sh
cd cms
npm install
npm run develop        # http://localhost:1337/admin
```

- La primera vez carga el equipo y las alianzas de `datos-iniciales.json` y crea el token de lectura `web` en `.tmp/token-web.txt`.
- Para probar la página con este contenido:

```sh
cd ..
STRAPI_URL=http://localhost:1337 STRAPI_TOKEN=$(cat cms/.tmp/token-web.txt) node scripts/fetch-cms.mjs
npm run dev
```

Vuelve a dejar `src/data/cms.json` vacío antes de subir cambios. Si no, la página usará esos datos de prueba.

## En AWS

Lo despliega GitHub Actions con `infra/cms.yaml`:
- Strapi corre en Docker con SQLite en una instancia EC2 ARM t4g.micro.
- CloudFront le da HTTPS.
- La imagen se guarda en ECR.

Se administra con Systems Manager, sin SSH. Los pasos para activarlo están en el README principal, en «CMS (Strapi)».

Costo aproximado: unos US$11 al mes (t4g.micro ~US$6, IP pública ~US$3.6 y disco de 20 GB ~US$1.6).
CloudFront entra en la capa gratuita.
