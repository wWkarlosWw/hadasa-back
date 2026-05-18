import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  organizationId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
