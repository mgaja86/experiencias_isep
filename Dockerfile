# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código y construir
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Etapa de runtime (Nginx)
FROM nginx:alpine
# Copiar build de Angular
COPY --from=builder /app/dist/dyad-angular-template /usr/share/nginx/html
# Configuración Nginx con fallback a index.html para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]