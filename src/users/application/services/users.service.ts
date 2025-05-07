import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '@users/domain/repositories/user.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.create(userData);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    return this.userRepository.update(id, userData);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
} 