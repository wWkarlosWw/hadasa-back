import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { OrgType } from '@prisma/client';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(OrgType)
  @IsOptional()
  type?: OrgType;

  @IsString()
  address: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
