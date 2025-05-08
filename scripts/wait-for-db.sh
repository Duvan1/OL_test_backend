#!/bin/sh

# Dirección del servicio de la base de datos
DB_HOST="postgres.railway.internal"  # Nombre del contenedor de PostgreSQL en Railway, probablemente "postgres"
DB_PORT="5432"

# Espera hasta que la base de datos esté disponible
echo "Esperando a que la base de datos esté disponible en $DB_HOST:$DB_PORT..."

# Comando para comprobar si el puerto de la base de datos está abierto
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Base de datos disponible. Iniciando la aplicación..."

# Inicia la aplicación
npm run start:prod
