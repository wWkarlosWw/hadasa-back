import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Types } from 'mongoose';

@Injectable()
export class DiscountsService {
  private readonly logger = new Logger(DiscountsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createDiscountDto: CreateDiscountDto) {
    if (!this.isValidObjectId(createDiscountDto.organizationId)) {
      throw new BadRequestException('Invalid organizationId format');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: createDiscountDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID "${createDiscountDto.organizationId}" not found`,
      );
    }

    return this.prisma.discounts.create({
      data: createDiscountDto,
    });
  }

  async findAll() {
    return this.prisma.discounts.findMany({
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const discount = await this.prisma.discounts.findUnique({
        where: { id },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });
      if (!discount) {
        throw new NotFoundException(`Discount with ID "${id}" not found`);
      }
      return discount;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async update(id: string, updateDiscountDto: UpdateDiscountDto) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (
      updateDiscountDto.organizationId &&
      !this.isValidObjectId(updateDiscountDto.organizationId)
    ) {
      throw new BadRequestException('Invalid organizationId format');
    }

    try {
      const discount = await this.prisma.discounts.findUnique({
        where: { id },
      });
      if (!discount) {
        throw new NotFoundException(`Discount with ID "${id}" not found`);
      }

      if (updateDiscountDto.organizationId) {
        const organization = await this.prisma.organization.findUnique({
          where: { id: updateDiscountDto.organizationId },
        });
        if (!organization) {
          throw new NotFoundException(
            `Organization with ID "${updateDiscountDto.organizationId}" not found`,
          );
        }
      }

      return this.prisma.discounts.update({
        where: { id },
        data: updateDiscountDto,
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
      const discount = await this.prisma.discounts.findUnique({
        where: { id },
      });
      if (!discount) {
        throw new NotFoundException(`Discount with ID "${id}" not found`);
      }
      return this.prisma.discounts.delete({
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
