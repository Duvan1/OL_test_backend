import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, NotFoundException, Inject } from '@nestjs/common';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { CreateUserUseCase } from '@users/application/use-cases/create-user.use-case';
import { User } from '@users/domain/entities/user.entity';
import { IUserRepository } from '@users/domain/repositories/user.repository.interface';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@auth/infrastructure/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @Roles('Administrador')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(createUserDto);
  }

  @Get()
  @Roles('Administrador', 'Auxiliar de Registro')
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  @Get(':id')
  @Roles('Administrador', 'Auxiliar de Registro')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userRepository.findById(+id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  @Put(':id')
  @Roles('Administrador')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.userRepository.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('Administrador')
  async remove(@Param('id') id: string): Promise<void> {
    return this.userRepository.delete(+id);
  }
} 