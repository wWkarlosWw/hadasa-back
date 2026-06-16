import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsNumber()
  @Min(0)
  pointsRequired: number;

  @IsString()
  organizationId: string;
}
