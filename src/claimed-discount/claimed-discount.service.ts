import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClaimedDiscountDto } from './dto/create-claimed-discount.dto';
import { Types } from 'mongoose';

@Injectable()
export class ClaimedDiscountService {
  private readonly logger = new Logger(ClaimedDiscountService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(
    createClaimedDiscountDto: CreateClaimedDiscountDto,
    userId: string,
  ) {
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format');
    }
    if (!this.isValidObjectId(createClaimedDiscountDto.discountId)) {
      throw new BadRequestException('Invalid discountId format');
    }

    const discount = await this.prisma.discounts.findUnique({
      where: { id: createClaimedDiscountDto.discountId },
    });
    if (!discount) {
      throw new NotFoundException(
        `Discount with ID "${createClaimedDiscountDto.discountId}" not found`,
      );
    }
    if (!discount.isActive) {
      throw new BadRequestException('Discount is not active');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    if (user.points < discount.pointsRequired) {
      throw new BadRequestException(
        `Insufficient points. Required: ${discount.pointsRequired}, Available: ${user.points}`,
      );
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { points: { decrement: discount.pointsRequired } },
    });

    return this.prisma.claimedDiscount.create({
      data: {
        pointsSpent: discount.pointsRequired,
        userId,
        discountId: createClaimedDiscountDto.discountId,
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where: any = {};
    if (role === 'USER') {
      where.userId = userId;
    }
    return this.prisma.claimedDiscount.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        discount: {
          select: {
            id: true,
            code: true,
            description: true,
            discount: true,
            pointsRequired: true,
          },
        },
      },
    });
  }
}
