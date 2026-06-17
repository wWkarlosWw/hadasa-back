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
import * as bcrypt from 'bcryptjs';

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

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        ci: true,
        name: true,
        email: true,
        role: true,
        points: true,
        createdAt: true,
        phone: true,
        address: true,
        isActive: true,
      },
    });
  }

  async findOne(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          ci: true,
          name: true,
          email: true,
          role: true,
          points: true,
          createdAt: true,
          phone: true,
          address: true,
          isActive: true,
        },
      });
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
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }

      const updateData = { ...updateUserDto };
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      return this.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          ci: true,
          name: true,
          email: true,
          role: true,
          points: true,
          createdAt: true,
          phone: true,
          address: true,
          isActive: true,
        },
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
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
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
}
