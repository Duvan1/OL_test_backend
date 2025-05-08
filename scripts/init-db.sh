#!/bin/sh

echo "🔄 Iniciando script init-db.sh..."

# Verifica que DATABASE_URL está definido
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: La variable DATABASE_URL no está definida."
  exit 1
fi

# Ejecuta migraciones de producción
echo "📦 Ejecutando migraciones Prisma..."
npx prisma migrate deploy

# Verifica si las migraciones fallaron
if [ $? -ne 0 ]; then
  echo "❌ ERROR: Fallo al ejecutar las migraciones Prisma."
  exit 1
fi

# Inicia la aplicación
echo "🚀 Iniciando la aplicación..."
exec npm run start
