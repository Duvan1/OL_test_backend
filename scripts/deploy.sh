#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Iniciando proceso de despliegue...${NC}"

# Limpiar caché y módulos
echo "Limpiando caché y módulos..."
rm -rf node_modules
npm cache clean --force

# Instalar dependencias
echo "Instalando dependencias..."
npm install --no-audit --no-fund

# Generar Prisma Client
echo "Generando Prisma Client..."
npx prisma generate

# Construir la aplicación
echo "Construyendo la aplicación..."
npm run build

# Verificar la construcción
if [ $? -eq 0 ]; then
    echo -e "${GREEN}¡Construcción exitosa!${NC}"
else
    echo -e "${RED}Error en la construcción${NC}"
    exit 1
fi

# Verificar variables de entorno
echo "Verificando variables de entorno..."
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL no está definida${NC}"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}Error: JWT_SECRET no está definida${NC}"
    exit 1
fi

echo -e "${GREEN}¡Despliegue completado!${NC}" 