import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { MerchantsModule } from '@merchants/merchants.module';
import { EstablishmentsModule } from '@establishments/establishments.module';
import { MunicipalitiesModule } from '@municipalities/municipalities.module';
import { SharedModule } from '@shared/shared.module';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hora en segundos
    }),
    SharedModule,
    UsersModule,
    AuthModule,
    MerchantsModule,
    EstablishmentsModule,
    MunicipalitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
