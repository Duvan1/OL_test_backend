import { Module } from '@nestjs/common';
import { MerchantController } from '@merchants/infrastructure/controllers/merchant.controller';
import { CreateMerchantUseCase } from '@merchants/application/use-cases/create-merchant.use-case';
import { MerchantRepository } from '@merchants/infrastructure/repositories/merchant.repository';
import { MerchantReportService } from '@merchants/application/services/merchant-report.service';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [MerchantController],
  providers: [
    CreateMerchantUseCase,
    MerchantReportService,
    PrismaService,
    {
      provide: 'IMerchantRepository',
      useClass: MerchantRepository,
    },
  ],
  exports: ['IMerchantRepository'],
})
export class MerchantsModule {} 