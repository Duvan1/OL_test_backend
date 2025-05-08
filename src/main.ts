import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { TransformInterceptor } from './shared/infrastructure/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/infrastructure/interceptors/logging.interceptor';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configurar CORS para desarrollo
  app.enableCors({
    origin: true, // Permite todas las origenes en desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Configurar prefijo global solo para rutas que no sean de autenticación
  app.setGlobalPrefix('api', {
    exclude: ['/auth/(.*)'],
  });

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar interceptores globales
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new LoggingInterceptor(),
  );

  // Configurar middleware de seguridad
  app.use(helmet());
  app.use(compression());

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Comerciantes')
    .setDescription('API para la gestión de comerciantes y establecimientos')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('merchants', 'Gestión de comerciantes')
    .addTag('establishments', 'Gestión de establecimientos')
    .addTag('users', 'Gestión de usuarios')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Configurar límites de tamaño de payload
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  const port = configService.get('PORT', 3000);
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`Servidor iniciado en: ${url}`);
  console.log(`Documentación Swagger disponible en: ${url}/docs`);
}
bootstrap();
