import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';
import { Merchant } from '@prisma/client';
import { CreateMerchantDto } from '../dtos/create-merchant.dto';

@Injectable()
export class CreateMerchantUseCase {
  constructor(
    @Inject('IMerchantRepository')
    private readonly merchantRepository: IMerchantRepository
  ) {}

  async execute(merchantData: CreateMerchantDto): Promise<Merchant> {
    if (!merchantData.name) {
      throw new BadRequestException('El nombre es requerido');
    }

    if (!merchantData.document_type) {
      throw new BadRequestException('El tipo de documento es requerido');
    }

    if (!merchantData.document_number) {
      throw new BadRequestException('El número de documento es requerido');
    }

    if (!merchantData.phone) {
      throw new BadRequestException('El teléfono es requerido');
    }

    if (!merchantData.email) {
      throw new BadRequestException('El email es requerido');
    }

    if (!merchantData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new BadRequestException('El formato del email no es válido');
    }

    if (!merchantData.status || !['ACTIVE', 'INACTIVE'].includes(merchantData.status)) {
      throw new BadRequestException('El estado debe ser ACTIVE o INACTIVE');
    }

    // Crear el comerciante con los campos de fecha correctos
    const now = new Date();
    return this.merchantRepository.create({
      ...merchantData,
      created_at: now,
      updated_at: now,
    } as any);
  }
} 