import { Module } from '@nestjs/common';
import { MunicipalitiesController } from './infrastructure/controllers/municipalities.controller';
import { MunicipalitiesService } from './application/services/municipalities.service';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [MunicipalitiesController],
  providers: [MunicipalitiesService, PrismaService],
  exports: [MunicipalitiesService],
})
export class MunicipalitiesModule {} 