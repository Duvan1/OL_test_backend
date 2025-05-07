import { Module } from '@nestjs/common';
import { UsersService } from './application/services/users.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';

@Module({
  providers: [
    UsersService,
    PrismaService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {} 