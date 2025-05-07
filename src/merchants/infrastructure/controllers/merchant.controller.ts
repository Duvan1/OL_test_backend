import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Inject, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@auth/infrastructure/decorators/roles.decorator';
import { CreateMerchantUseCase } from '@merchants/application/use-cases/create-merchant.use-case';
import { CreateMerchantDto } from '@merchants/application/dtos/create-merchant.dto';
import { Merchant } from '@prisma/client';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';

@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MerchantController {
  constructor(
    @Inject('IMerchantRepository')
    private readonly merchantRepository: IMerchantRepository,
    private readonly createMerchantUseCase: CreateMerchantUseCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  async create(@Body() createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    return this.createMerchantUseCase.execute(createMerchantDto);
  }

  @Get()
  @Roles('ADMIN')
  async findAll(): Promise<Merchant[]> {
    return this.merchantRepository.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }
    return merchant;
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateMerchantDto: Partial<CreateMerchantDto>,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }
    return this.merchantRepository.update(parseInt(id), updateMerchantDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async remove(@Param('id') id: string): Promise<void> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }
    await this.merchantRepository.delete(parseInt(id));
  }
} 