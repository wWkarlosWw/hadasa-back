import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Types } from 'mongoose';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createEventDto: CreateEventDto) {
    if (!this.isValidObjectId(createEventDto.organizationId)) {
      throw new BadRequestException('Invalid organizationId format');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: createEventDto.organizationId },
    });

    if (!organization) {
      throw new NotFoundException(
        `Organization with ID "${createEventDto.organizationId}" not found`,
      );
    }

    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async findAll() {
    return this.prisma.event.findMany({
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

  async findByOrganization(organizationId: string) {
    if (!this.isValidObjectId(organizationId)) {
      throw new BadRequestException('Invalid organizationId format');
    }

    return this.prisma.event.findMany({
      where: { organizationId },
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
      const event = await this.prisma.event.findUnique({
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
      if (!event) {
        throw new NotFoundException(`Event with ID "${id}" not found`);
      }
      return event;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    if (
      updateEventDto.organizationId &&
      !this.isValidObjectId(updateEventDto.organizationId)
    ) {
      throw new BadRequestException('Invalid organizationId format');
    }

    try {
      const event = await this.prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException(`Event with ID "${id}" not found`);
      }

      if (updateEventDto.organizationId) {
        const organization = await this.prisma.organization.findUnique({
          where: { id: updateEventDto.organizationId },
        });
        if (!organization) {
          throw new NotFoundException(
            `Organization with ID "${updateEventDto.organizationId}" not found`,
          );
        }
      }

      return this.prisma.event.update({
        where: { id },
        data: updateEventDto,
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
      const event = await this.prisma.event.findUnique({
        where: { id },
      });
      if (!event) {
        throw new NotFoundException(`Event with ID "${id}" not found`);
      }
      return this.prisma.event.delete({
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
