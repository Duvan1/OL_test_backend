# Etapa de construcción
<<<<<<< HEAD
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig*.json ./

# Limpiar caché y módulos existentes
RUN rm -rf node_modules package-lock.json && \
    npm cache clean --force

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Construir la aplicación
RUN npm run build

# Limpiar archivos innecesarios
RUN rm -rf node_modules && \
    npm ci --only=production

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
=======
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar archivos necesarios desde la etapa de construcción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Instalar solo dependencias de producción
RUN npm install --only=production

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=8000

# Exponer el puerto
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["npm", "start"] 
>>>>>>> db521fafc5fc842a1de41edf7e01866a45f3fd95
