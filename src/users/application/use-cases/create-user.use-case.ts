import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IUserRepository } from '@users/domain/repositories/user.repository.interface';
import { User } from '@users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userData: Partial<User>): Promise<User> {
    if (!userData.email) {
      throw new BadRequestException('El email es requerido');
    }

    // Validar que el email no exista
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Validar el formato del email
    if (!userData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new BadRequestException('El formato del email no es válido');
    }

    // Validar el rol
    if (!userData.role || !['Administrador', 'Auxiliar de Registro'].includes(userData.role)) {
      throw new BadRequestException('El rol no es válido');
    }

    // Encriptar la contraseña si se proporciona
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Crear el usuario
    return this.userRepository.create(userData);
  }
} 