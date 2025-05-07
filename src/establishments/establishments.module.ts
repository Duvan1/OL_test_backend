import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Establishment } from '@establishments/domain/entities/establishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class EstablishmentsModule {} 