import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Inject, NotFoundException, Query, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@auth/infrastructure/decorators/roles.decorator';
import { CreateMerchantUseCase } from '@merchants/application/use-cases/create-merchant.use-case';
import { CreateMerchantDto } from '@merchants/application/dtos/create-merchant.dto';
import { QueryMerchantDto } from '@merchants/application/dtos/query-merchant.dto';
import { UpdateMerchantStatusDto } from '@merchants/application/dtos/update-merchant-status.dto';
import { Merchant } from '@prisma/client';
import { IMerchantRepository } from '@merchants/domain/repositories/merchant.repository.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Comerciantes')
@Controller('merchants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MerchantController {
  constructor(
    @Inject('IMerchantRepository')
    private readonly merchantRepository: IMerchantRepository,
    private readonly createMerchantUseCase: CreateMerchantUseCase,
  ) {}

  @Get()
  @Roles('ADMIN', 'AUXILIAR')
  @ApiOperation({ summary: 'Obtener lista paginada de comerciantes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comerciantes obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              municipality_id: { type: 'number' },
              phone: { type: 'string' },
              email: { type: 'string' },
              registration_date: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'] },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' }
          }
        },
        message: { type: 'string' }
      }
    }
  })
  async findAll(@Query() query: QueryMerchantDto) {
    const { page, limit, ...filters } = query;
    const skip = (page - 1) * limit;

    const [merchants, total] = await Promise.all([
      this.merchantRepository.findAllPaginated(skip, limit, filters),
      this.merchantRepository.count(filters)
    ]);

    return {
      success: true,
      data: merchants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: 'Lista de comerciantes obtenida exitosamente'
    };
  }

  @Get(':id')
  @Roles('ADMIN', 'AUXILIAR')
  @ApiOperation({ summary: 'Obtener un comerciante por ID' })
  @ApiResponse({
    status: 200,
    description: 'Comerciante encontrado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Comerciante no encontrado' })
  async findOne(@Param('id') id: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }
    return merchant;
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Crear un nuevo comerciante' })
  @ApiResponse({
    status: 201,
    description: 'Comerciante creado exitosamente'
  })
  async create(@Body() createMerchantDto: CreateMerchantDto): Promise<Merchant> {
    return this.createMerchantUseCase.execute(createMerchantDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar un comerciante' })
  @ApiResponse({
    status: 200,
    description: 'Comerciante actualizado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Comerciante no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateMerchantDto: Partial<CreateMerchantDto>,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }

    const now = new Date();
    return this.merchantRepository.update(parseInt(id), {
      ...updateMerchantDto,
      updated_at: now,
    });
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Actualizar el estado de un comerciante' })
  @ApiResponse({
    status: 200,
    description: 'Estado del comerciante actualizado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Comerciante no encontrado' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateMerchantStatusDto,
  ): Promise<Merchant> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }

    const now = new Date();
    return this.merchantRepository.update(parseInt(id), {
      status: updateStatusDto.status,
      updated_at: now,
    });
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar un comerciante' })
  @ApiResponse({
    status: 200,
    description: 'Comerciante eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Comerciante no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    const merchant = await this.merchantRepository.findById(parseInt(id));
    if (!merchant) {
      throw new NotFoundException(`Comerciante con ID ${id} no encontrado`);
    }
    await this.merchantRepository.delete(parseInt(id));
  }
} 