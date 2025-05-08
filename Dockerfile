# Etapa de construcción
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