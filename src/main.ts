import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';
import { TransformInterceptor } from './shared/infrastructure/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors();

  // Configurar prefijo global
  app.setGlobalPrefix('api');

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configurar filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar interceptor global
  app.useGlobalInterceptors(new TransformInterceptor());

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Comerciantes')
    .setDescription('API para la gestión de comerciantes y establecimientos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
  console.log(`Aplicación corriendo en: ${await app.getUrl()}`);
}
bootstrap();
