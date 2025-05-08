import { Module } from '@nestjs/common';
import { EstablishmentController } from './infrastructure/controllers/establishment.controller';
import { EstablishmentRepository } from './infrastructure/repositories/establishment.repository';
import { CreateEstablishmentUseCase } from './application/use-cases/create-establishment.use-case';

@Module({
  controllers: [EstablishmentController],
  providers: [
    EstablishmentRepository,
    {
      provide: 'IEstablishmentRepository',
      useClass: EstablishmentRepository,
    },
    CreateEstablishmentUseCase,
  ],
  exports: ['IEstablishmentRepository', EstablishmentRepository, CreateEstablishmentUseCase],
})
export class EstablishmentsModule {} 