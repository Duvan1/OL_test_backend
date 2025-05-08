import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';
import { IMerchant } from '@merchants/domain/entities/merchant.entity';
import type { Prisma } from '@prisma/client';

@Injectable()
export class MerchantRepository implements IMerchantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<IMerchant | null> {
    if (!id) {
      throw new Error('ID is required');
    }
    return this.prisma.merchant.findUnique({
      where: { id: Number(id) },
      include: {
        establishments: {
          include: {
            municipality: true
          }
        }
      }
    });
  }

  async findAll(): Promise<IMerchant[]> {
    return this.prisma.merchant.findMany({
      where: {
        status: 'ACTIVE'
      },
      include: {
        establishments: {
          include: {
            municipality: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async findAllPaginated(skip: number, take: number, filters?: any): Promise<any[]> {
    const where = this.buildWhereClause(filters);
    return this.prisma.merchant.findMany({
      skip,
      take,
      where,
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async count(filters?: any): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.merchant.count({ where });
  }

  async create(merchantData: any): Promise<any> {
    const { id, created_at, updated_at, ...data } = merchantData;
    return this.prisma.merchant.create({
      data: {
        name: data.name!,
        document_type: data.document_type!,
        document_number: data.document_number!,
        phone: data.phone!,
        email: data.email!,
        status: data.status || 'ACTIVE'
      }
    });
  }

  async update(id: number, merchantData: any): Promise<any> {
    const { id: _, created_at, updated_at, ...data } = merchantData;
    return this.prisma.merchant.update({
      where: { id: Number(id) },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.merchant.delete({
      where: { id: Number(id) }
    });
  }

  private buildWhereClause(filters?: any) {
    const where: any = {};

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive'
      };
    }

    if (filters?.registration_date) {
      where.created_at = {
        gte: new Date(filters.registration_date),
        lt: new Date(new Date(filters.registration_date).setDate(new Date(filters.registration_date).getDate() + 1))
      };
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return where;
  }
} 