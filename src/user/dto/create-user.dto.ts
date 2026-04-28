import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsBoolean,
  MinLength,
} from 'class-validator';
import { userRole } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  ci: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(userRole)
  @IsOptional()
  role?: userRole;

  @IsString()
  phone: string;

  @IsString()
  address: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
