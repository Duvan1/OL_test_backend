import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from '@users/domain/entities/user.entity';
import { Merchant } from '@merchants/domain/entities/merchant.entity';
import { Establishment } from '@establishments/domain/entities/establishment.entity';
import { UsersModule } from '@users/users.module';
import { AuthModule } from '@auth/auth.module';
import { MerchantsModule } from '@merchants/merchants.module';
import { EstablishmentsModule } from '@establishments/establishments.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_DATABASE || 'OL',
      entities: [User, Merchant, Establishment],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    AuthModule,
    MerchantsModule,
    EstablishmentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
