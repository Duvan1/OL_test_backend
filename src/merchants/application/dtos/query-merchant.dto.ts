import { IsOptional, IsString, IsDateString, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class QueryMerchantDto {
  @ApiProperty({ description: 'Nombre o razón social del comerciante', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Fecha de registro del comerciante', required: false })
  @IsOptional()
  @IsDateString()
  registration_date?: Date;

  @ApiProperty({ description: 'Estado del comerciante', enum: ['ACTIVE', 'INACTIVE'], required: false })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({ description: 'Número de página', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({ description: 'Registros por página', default: 5 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 5;
} 