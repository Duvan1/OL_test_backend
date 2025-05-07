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

  async findAllPaginated(skip: number, take: number, filters?: any): Promise<Merchant[]> {
    const where = this.buildWhereClause(filters);
    return this.prisma.merchant.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: 'desc' },
    });
  }

  async count(filters?: any): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.merchant.count({ where });
  }

  async create(merchantData: Partial<Merchant>): Promise<Merchant> {
    const now = new Date();
    return this.prisma.merchant.create({
      data: {
        ...merchantData,
        created_at: now,
        updated_at: now,
      } as any,
    });
  }

  async update(id: number, merchantData: Partial<Merchant>): Promise<Merchant> {
    const now = new Date();
    return this.prisma.merchant.update({
      where: { id },
      data: {
        ...merchantData,
        updated_at: now,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.merchant.delete({
      where: { id },
    });
  }

  private buildWhereClause(filters?: any) {
    if (!filters) return {};

    const where: any = {};

    if (filters.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    if (filters.registration_date) {
      where.registration_date = {
        equals: new Date(filters.registration_date),
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }
} 