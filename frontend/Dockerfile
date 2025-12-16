# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código fuente y compilar
COPY . .
ARG BUILD_CONFIG=docker
RUN npm run build -- --configuration=${BUILD_CONFIG}

# Etapa 2: Production con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Eliminar archivos predeterminados de nginx
RUN rm -rf ./*

# Copiar la aplicación compilada desde la etapa de build
COPY --from=build /app/dist/myjobs-frontend/browser .

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 8080 (requerido por Cloud Run)
EXPOSE 8080

# Nginx se ejecuta automáticamente
CMD ["nginx", "-g", "daemon off;"]
