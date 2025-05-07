import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/domain/entities/user.entity';
import { UserController } from '@users/infrastructure/controllers/user.controller';
import { UserRepository } from '@users/infrastructure/repositories/user.repository';
import { CreateUserUseCase } from '@users/application/use-cases/create-user.use-case';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    CreateUserUseCase,
  ],
  exports: ['IUserRepository', UserRepository, CreateUserUseCase],
})
export class UsersModule {} 