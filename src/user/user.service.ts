import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createUserDto: CreateUserDto) {
    const existingByEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingByEmail) {
      throw new BadRequestException(
        `User with email "${createUserDto.email}" already exists`,
      );
    }
    const existingByCi = await this.prisma.user.findUnique({
      where: { ci: createUserDto.ci },
    });
    if (existingByCi) {
      throw new BadRequestException(
        `User with ci "${createUserDto.ci}" already exists`,
      );
    }
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async remove(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      return this.prisma.user.delete({
        where: { id },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    if (user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
