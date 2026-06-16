import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateDonationDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  organizationId: string;

  @IsString()
  @IsOptional()
  eventId?: string;
}
