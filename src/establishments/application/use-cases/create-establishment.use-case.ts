import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IEstablishmentRepository } from '@establishments/domain/repositories/establishment.repository.interface';
import { Establishment } from '@prisma/client';
import { CreateEstablishmentDto } from '../dtos/create-establishment.dto';

@Injectable()
export class CreateEstablishmentUseCase {
  constructor(
    @Inject('IEstablishmentRepository')
    private readonly establishmentRepository: IEstablishmentRepository
  ) {}

  async execute(establishmentData: CreateEstablishmentDto): Promise<Establishment> {
    if (!establishmentData.name) {
      throw new BadRequestException('El nombre es requerido');
    }

    if (!establishmentData.revenue || establishmentData.revenue < 0) {
      throw new BadRequestException('El ingreso anual debe ser un número positivo');
    }

    if (!establishmentData.employee_count || establishmentData.employee_count < 1) {
      throw new BadRequestException('El número de empleados debe ser al menos 1');
    }

    if (!establishmentData.municipality_id) {
      throw new BadRequestException('El municipio es requerido');
    }

    if (!establishmentData.merchant_id) {
      throw new BadRequestException('El comerciante es requerido');
    }

    // Crear el establecimiento con los campos de fecha correctos
    const now = new Date();
    return this.establishmentRepository.create({
      ...establishmentData,
      created_at: now,
      updated_at: now,
    });
  }
} 