import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Merchant, Establishment],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
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
