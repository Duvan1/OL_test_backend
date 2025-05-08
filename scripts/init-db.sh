#!/bin/bash

# Colores para mensajes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Iniciando configuración de la base de datos...${NC}"

# Generar Prisma Client
echo "Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones
echo "Ejecutando migraciones..."
npx prisma migrate deploy

# Verificar si hay datos de seed
if [ -f "prisma/seed.ts" ]; then
    echo "Ejecutando seed..."
    npx prisma db seed
fi

echo -e "${GREEN}¡Configuración de la base de datos completada!${NC}" 