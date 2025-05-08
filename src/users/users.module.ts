import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UsersService } from './application/services/users.service';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [
    UsersService,
    CreateUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    PrismaService,
  ],
  exports: [UsersService],
})
export class UsersModule {} 