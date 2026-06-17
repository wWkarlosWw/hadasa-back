import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { Types } from 'mongoose';

@Injectable()
export class DonationService {
  private readonly logger = new Logger(DonationService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createDonationDto: CreateDonationDto, userId: string) {
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format');
    }
    if (!this.isValidObjectId(createDonationDto.organizationId)) {
      throw new BadRequestException('Invalid organizationId format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: createDonationDto.organizationId },
    });
    if (!organization) {
      throw new NotFoundException(
        `Organization with ID "${createDonationDto.organizationId}" not found`,
      );
    }

    if (createDonationDto.eventId) {
      if (!this.isValidObjectId(createDonationDto.eventId)) {
        throw new BadRequestException('Invalid eventId format');
      }
      const event = await this.prisma.event.findUnique({
        where: { id: createDonationDto.eventId },
      });
      if (!event) {
        throw new NotFoundException(
          `Event with ID "${createDonationDto.eventId}" not found`,
        );
      }
    }

    return this.prisma.donation.create({
      data: {
        amount: createDonationDto.amount,
        userId,
        organizationId: createDonationDto.organizationId,
        eventId: createDonationDto.eventId,
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where: any = {};
    if (role === 'USER') {
      where.userId = userId;
    }
    return this.prisma.donation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const donation = await this.prisma.donation.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!donation) {
        throw new NotFoundException(`Donation with ID "${id}" not found`);
      }
      if (role === 'USER' && donation.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view this donation',
        );
      }
      return donation;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async approve(id: string, validatedBy: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const donation = await this.prisma.donation.findUnique({
        where: { id },
      });
      if (!donation) {
        throw new NotFoundException(`Donation with ID "${id}" not found`);
      }
      if (donation.status !== 'PENDING') {
        throw new BadRequestException(`Donation is already ${donation.status}`);
      }

      await this.prisma.user.update({
        where: { id: donation.userId },
        data: { points: { increment: donation.amount * 10 } },
      });

      return this.prisma.donation.update({
        where: { id },
        data: {
          status: 'APPROVED',
          validatedBy,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async reject(id: string, validatedBy: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const donation = await this.prisma.donation.findUnique({
        where: { id },
      });
      if (!donation) {
        throw new NotFoundException(`Donation with ID "${id}" not found`);
      }
      if (donation.status !== 'PENDING') {
        throw new BadRequestException(`Donation is already ${donation.status}`);
      }

      return this.prisma.donation.update({
        where: { id },
        data: {
          status: 'REJECTED',
          validatedBy,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Database error');
    }
  }
}
