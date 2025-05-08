# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./

# Limpiar caché y módulos existentes
RUN rm -rf node_modules && \
    npm cache clean --force

# Instalar dependencias con legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación con más información de depuración
RUN npm run build || (echo "Error en la construcción" && cat /app/npm-debug.log && exit 1)

# Limpiar archivos innecesarios y reinstalar solo dependencias de producción
RUN rm -rf node_modules && \
    npm install --omit=dev --legacy-peer-deps

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Instalar dependencias necesarias para Prisma en producción
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Hacer el script de inicialización ejecutable
RUN chmod +x ./scripts/init-db.sh

# Limpiar caché de npm
RUN npm cache clean --force

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Script de inicio que ejecuta la inicialización de la base de datos y luego inicia la aplicación
CMD ["./scripts/init-db.sh"] && ["npm", "run", "start:prod"] 
