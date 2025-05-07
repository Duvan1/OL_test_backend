import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateEstablishmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  revenue: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  employee_count: number;

  @IsNotEmpty()
  @IsNumber()
  municipality_id: number;

  @IsNotEmpty()
  @IsNumber()
  merchant_id: number;
} 