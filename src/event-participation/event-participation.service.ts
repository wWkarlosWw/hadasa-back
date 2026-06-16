import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventParticipationDto } from './dto/create-event-participation.dto';
import { Types } from 'mongoose';

@Injectable()
export class EventParticipationService {
  private readonly logger = new Logger(EventParticipationService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(
    createEventParticipationDto: CreateEventParticipationDto,
    userId: string,
  ) {
    if (!this.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format');
    }
    if (!this.isValidObjectId(createEventParticipationDto.eventId)) {
      throw new BadRequestException('Invalid eventId format');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: createEventParticipationDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Event with ID "${createEventParticipationDto.eventId}" not found`,
      );
    }

    const existing = await this.prisma.eventParticipation.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId: createEventParticipationDto.eventId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException('Already registered for this event');
    }

    return this.prisma.eventParticipation.create({
      data: {
        userId,
        eventId: createEventParticipationDto.eventId,
      },
    });
  }

  async findAll(userId: string, role: string) {
    const where: any = {};
    if (role === 'USER') {
      where.userId = userId;
    }
    return this.prisma.eventParticipation.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            name: true,
            date: true,
          },
        },
      },
    });
  }

  async findByEvent(eventId: string) {
    if (!this.isValidObjectId(eventId)) {
      throw new BadRequestException('Invalid eventId format');
    }
    return this.prisma.eventParticipation.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
      const participation = await this.prisma.eventParticipation.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              date: true,
            },
          },
        },
      });
      if (!participation) {
        throw new NotFoundException(
          `Event participation with ID "${id}" not found`,
        );
      }
      if (role === 'USER' && participation.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view this participation',
        );
      }
      return participation;
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

  async attend(id: string, validatedBy: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const participation = await this.prisma.eventParticipation.findUnique({
        where: { id },
      });
      if (!participation) {
        throw new NotFoundException(
          `Event participation with ID "${id}" not found`,
        );
      }
      if (participation.status !== 'REGISTERED') {
        throw new BadRequestException(
          `Participation is already ${participation.status}`,
        );
      }

      await this.prisma.user.update({
        where: { id: participation.userId },
        data: { points: { increment: 50 } },
      });

      return this.prisma.eventParticipation.update({
        where: { id },
        data: {
          status: 'ATTENDED',
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

  async cancel(id: string, userId: string, role: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const participation = await this.prisma.eventParticipation.findUnique({
        where: { id },
      });
      if (!participation) {
        throw new NotFoundException(
          `Event participation with ID "${id}" not found`,
        );
      }
      if (role === 'USER' && participation.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to cancel this participation',
        );
      }
      if (participation.status === 'CANCELLED') {
        throw new BadRequestException('Participation is already cancelled');
      }

      return this.prisma.eventParticipation.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Database error');
    }
  }
}
