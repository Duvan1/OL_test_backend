import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';
import { Merchant } from '@prisma/client';

@Injectable()
export class MerchantRepository implements IMerchantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Merchant | null> {
    return this.prisma.merchant.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Merchant[]> {
    return this.prisma.merchant.findMany();
  }

  async create(merchantData: any): Promise<Merchant> {
    return this.prisma.merchant.create({
      data: merchantData,
    });
  }

  async update(id: number, merchantData: any): Promise<Merchant> {
    return this.prisma.merchant.update({
      where: { id },
      data: {
        ...merchantData,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.merchant.delete({
      where: { id },
    });
  }
} 