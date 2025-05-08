import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, NotFoundException, Inject } from '@nestjs/common';
import { CreateEstablishmentDto } from '@establishments/application/dtos/create-establishment.dto';
import { CreateEstablishmentUseCase } from '@establishments/application/use-cases/create-establishment.use-case';
import { Establishment } from '@prisma/client';
import { IEstablishmentRepository } from '@establishments/domain/repositories/establishment.repository.interface';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';

@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentController {
  constructor(
    @Inject('IEstablishmentRepository')
    private readonly establishmentRepository: IEstablishmentRepository,
    private readonly createEstablishmentUseCase: CreateEstablishmentUseCase,
  ) {}

  @Post()
  async create(@Body() createEstablishmentDto: CreateEstablishmentDto): Promise<Establishment> {
    return this.createEstablishmentUseCase.execute(createEstablishmentDto);
  }

  @Get()
  async findAll(): Promise<Establishment[]> {
    return this.establishmentRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Establishment> {
    const establishment = await this.establishmentRepository.findById(+id);
    if (!establishment) {
      throw new NotFoundException(`Establecimiento con ID ${id} no encontrado`);
    }
    return establishment;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEstablishmentDto: Partial<CreateEstablishmentDto>,
  ): Promise<Establishment> {
    const now = new Date();
    return this.establishmentRepository.update(+id, {
      ...updateEstablishmentDto,
      updated_at: now,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.establishmentRepository.delete(+id);
  }
} 