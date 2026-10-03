# Imagen del CMS (Strapi). Se compila en GitHub Actions (arm64) y la instancia de AWS solo la descarga y la ejecuta.
# La base de datos (SQLite) y las imágenes subidas viven en volúmenes de la instancia, no dentro de la imagen.
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
COPY --from=compilacion /opt/app ./
RUN mkdir -p .tmp public/uploads
EXPOSE 1337
CMD ["npm", "run", "start"]
