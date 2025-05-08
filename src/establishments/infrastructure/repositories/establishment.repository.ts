import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IEstablishmentRepository } from '../../domain/repositories/establishment.repository.interface';
import { Establishment } from '@prisma/client';

@Injectable()
export class EstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Establishment | null> {
    return this.prisma.establishment.findUnique({ where: { id } });
  }

  async findAll(): Promise<Establishment[]> {
    return this.prisma.establishment.findMany();
  }

  async create(establishmentData: Partial<Establishment>): Promise<Establishment> {
    return this.prisma.establishment.create({ data: establishmentData as any });
  }

  async update(id: number, establishmentData: Partial<Establishment>): Promise<Establishment> {
    try {
      return await this.prisma.establishment.update({
        where: { id },
        data: establishmentData,
      });
    } catch (error) {
      throw new NotFoundException(`Establecimiento con ID ${id} no encontrado`);
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.establishment.delete({ where: { id } });
  }
} 