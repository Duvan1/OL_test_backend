import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MunicipalitiesService } from '@municipalities/application/services/municipalities.service';
import { JwtAuthGuard } from '@auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/infrastructure/guards/roles.guard';
import { Roles } from '@auth/infrastructure/decorators/roles.decorator';

@ApiTags('Municipios')
@Controller('municipalities')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MunicipalitiesController {
  constructor(private readonly municipalitiesService: MunicipalitiesService) {}

  @Get()
  @Roles('ADMIN', 'AUXILIAR')
  @ApiOperation({ summary: 'Obtener lista de municipios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de municipios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Barranquilla' }
            }
          }
        },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll() {
    const municipalities = await this.municipalitiesService.findAll();
    return {
      success: true,
      data: municipalities,
      message: 'Lista de municipios obtenida exitosamente'
    };
  }
} 