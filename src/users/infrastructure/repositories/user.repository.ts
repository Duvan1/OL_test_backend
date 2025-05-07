import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IUserRepository } from '@users/domain/repositories/user.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.prisma.user.create({
      data: userData as any,
    });
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        updated_at: new Date(),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
} 