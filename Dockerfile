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

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Limpiar archivos innecesarios y reinstalar solo dependencias de producción
RUN rm -rf node_modules && \
    npm install --only=production

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

# Limpiar caché de npm
RUN npm cache clean --force

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"] 
