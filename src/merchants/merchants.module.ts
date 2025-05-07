import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from '@merchants/domain/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule]
})
export class MerchantsModule {} 