import { Module } from '@nestjs/common';
import { MerchantController } from './infrastructure/controllers/merchant.controller';
import { MerchantRepository } from './infrastructure/repositories/merchant.repository';
import { CreateMerchantUseCase } from './application/use-cases/create-merchant.use-case';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [MerchantController],
  providers: [
    CreateMerchantUseCase,
    PrismaService,
    {
      provide: 'IMerchantRepository',
      useClass: MerchantRepository,
    },
  ],
  exports: ['IMerchantRepository'],
})
export class MerchantsModule {} 