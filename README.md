# API de Gestión de Comerciantes

API REST desarrollada con NestJS para la gestión de comerciantes y establecimientos.

## 🚀 Características

- Autenticación JWT
- Control de acceso basado en roles (RBAC)
- Gestión de usuarios
- Gestión de comerciantes
- Gestión de establecimientos
- Documentación con Swagger
- Validación de datos
- Manejo de errores centralizado
- Logging de operaciones
- Seguridad mejorada con Helmet y CORS
- Base de datos PostgreSQL con Prisma ORM

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```
Edita el archivo `.env` con tus configuraciones.

4. Ejecutar migraciones de la base de datos:
```bash
npx prisma migrate dev
```

5. Poblar la base de datos con datos iniciales:
```bash
npm run prisma:seed
```

## 🚀 Ejecución

### Desarrollo
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

## 📚 Documentación de la API

La documentación de la API está disponible en Swagger UI cuando el servidor está en ejecución:
```
http://localhost:3000/docs
```

## 🔐 Autenticación

La API utiliza autenticación JWT. Para acceder a los endpoints protegidos:

1. Obtén un token mediante el endpoint de login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@comercio.com", "password": "password123"}'
```

2. Usa el token recibido en el header de las siguientes peticiones:
```
Authorization: Bearer <tu-token>
```

## 👥 Roles de Usuario

La aplicación maneja dos roles principales:

- **Administrador**: Acceso completo a todas las funcionalidades
- **Auxiliar de Registro**: Acceso limitado a funciones de consulta y registro básico

## 📁 Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
├── users/               # Módulo de usuarios
├── merchants/           # Módulo de comerciantes
├── establishments/      # Módulo de establecimientos
├── municipalities/      # Módulo de municipios
└── shared/             # Módulos y utilidades compartidas
```

## 🛠️ Tecnologías Principales

- [NestJS](https://nestjs.com/) - Framework para construir aplicaciones del lado del servidor
- [Prisma](https://www.prisma.io/) - ORM moderno para Node.js y TypeScript
- [PostgreSQL](https://www.postgresql.org/) - Sistema de gestión de base de datos
- [JWT](https://jwt.io/) - Autenticación basada en tokens
- [Swagger](https://swagger.io/) - Documentación de API
- [Class Validator](https://github.com/typestack/class-validator) - Validación de datos
- [Helmet](https://helmetjs.github.io/) - Seguridad HTTP
- [Passport](https://www.passportjs.org/) - Autenticación

## 🔒 Seguridad

- Autenticación JWT
- Protección contra ataques comunes (Helmet)
- Validación de datos de entrada
- Control de acceso basado en roles
- Rate limiting
- Sanitización de datos
- Headers de seguridad

## 📝 Scripts Disponibles

- `npm run start:dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila el proyecto
- `npm run start:prod` - Inicia el servidor en modo producción
- `npm run test` - Ejecuta las pruebas unitarias
- `npm run test:e2e` - Ejecuta las pruebas end-to-end
- `npm run lint` - Ejecuta el linter
- `npm run prisma:seed` - Pobla la base de datos con datos iniciales

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Agradecimientos

- NestJS por su excelente framework
- Prisma por su potente ORM
- La comunidad de código abierto por sus contribuciones
