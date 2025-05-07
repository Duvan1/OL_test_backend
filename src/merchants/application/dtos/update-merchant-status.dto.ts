import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMerchantStatusDto {
  @ApiProperty({ description: 'Estado del comerciante', enum: ['ACTIVE', 'INACTIVE'] })
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsEnum(['ACTIVE', 'INACTIVE'], { message: 'El estado debe ser ACTIVE o INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';
} 