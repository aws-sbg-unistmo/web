# Imagen del CMS (Strapi). Se compila en GitHub Actions y el servidor solo la descarga y la ejecuta:
#  - Heroku (amd64): base de datos en Heroku Postgres e imágenes en Cloudinary.
#  - AWS (arm64): SQLite e imágenes en volúmenes de la instancia, no dentro de la imagen.
FROM node:22-alpine AS compilacion
RUN apk add --no-cache python3 make g++ vips-dev
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine
RUN apk add --no-cache vips
WORKDIR /opt/app
ENV NODE_ENV=production
# Con un usuario sin carpeta propia (Heroku), la línea de comandos de Strapi guarda su configuración aquí
ENV HOME=/tmp
COPY --from=compilacion /opt/app ./
# Heroku no corre el contenedor como root: estas carpetas deben poder escribirse con cualquier usuario
RUN mkdir -p .tmp public/uploads && chmod 777 .tmp public/uploads
EXPOSE 1337
# Sin npm de por medio: Strapi recibe directo las señales de apagado
CMD ["node_modules/.bin/strapi", "start"]
