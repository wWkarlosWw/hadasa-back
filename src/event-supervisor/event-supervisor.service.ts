import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventSupervisorDto } from './dto/create-event-supervisor.dto';
import { Types } from 'mongoose';

@Injectable()
export class EventSupervisorService {
  private readonly logger = new Logger(EventSupervisorService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createEventSupervisorDto: CreateEventSupervisorDto) {
    if (!this.isValidObjectId(createEventSupervisorDto.userId)) {
      throw new BadRequestException('Invalid userId format');
    }
    if (!this.isValidObjectId(createEventSupervisorDto.eventId)) {
      throw new BadRequestException('Invalid eventId format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: createEventSupervisorDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID "${createEventSupervisorDto.userId}" not found`,
      );
    }

    const event = await this.prisma.event.findUnique({
      where: { id: createEventSupervisorDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Event with ID "${createEventSupervisorDto.eventId}" not found`,
      );
    }

    const existing = await this.prisma.eventSupervisor.findUnique({
      where: {
        userId_eventId: {
          userId: createEventSupervisorDto.userId,
          eventId: createEventSupervisorDto.eventId,
        },
      },
    });
    if (existing) {
      throw new BadRequestException(
        'User is already assigned as supervisor for this event',
      );
    }

    return this.prisma.eventSupervisor.create({
      data: createEventSupervisorDto,
    });
  }

  async findAll() {
    return this.prisma.eventSupervisor.findMany({
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
    return this.prisma.eventSupervisor.findMany({
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

  async remove(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const supervisor = await this.prisma.eventSupervisor.findUnique({
        where: { id },
      });
      if (!supervisor) {
        throw new NotFoundException(
          `Event supervisor assignment with ID "${id}" not found`,
        );
      }
      return this.prisma.eventSupervisor.delete({
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
