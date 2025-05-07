import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMerchantDto {
  @ApiProperty({ description: 'Nombre o razón social del comerciante' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ description: 'Tipo de documento' })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsString({ message: 'El tipo de documento debe ser una cadena de texto' })
  document_type: string;

  @ApiProperty({ description: 'Número de documento' })
  @IsNotEmpty({ message: 'El número de documento es requerido' })
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  document_number: string;

  @ApiProperty({ description: 'ID del municipio' })
  @IsNotEmpty({ message: 'El municipio es requerido' })
  @IsString({ message: 'El municipio debe ser una cadena de texto' })
  municipality_id: number;

  @ApiProperty({ description: 'Teléfono del comerciante', required: false })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  phone?: string;

  @ApiProperty({ description: 'Correo electrónico del comerciante', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email?: string;

  @ApiProperty({ description: 'Fecha de registro del comerciante' })
  @IsNotEmpty({ message: 'La fecha de registro es requerida' })
  @IsDateString({}, { message: 'La fecha de registro debe tener un formato válido' })
  registration_date: Date;

  @ApiProperty({ description: 'Estado del comerciante', enum: ['ACTIVE', 'INACTIVE'] })
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsEnum(['ACTIVE', 'INACTIVE'], { message: 'El estado debe ser ACTIVE o INACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';
} 