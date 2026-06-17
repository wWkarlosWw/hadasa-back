import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Types } from 'mongoose';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  private isValidObjectId(id: string): boolean {
    if (!Types.ObjectId.isValid(id)) return false;
    return new Types.ObjectId(id).toString() === id;
  }

  async create(createOrganizationDto: CreateOrganizationDto) {
    const existing = await this.prisma.organization.findUnique({
      where: { email: createOrganizationDto.email },
    });
    if (existing) {
      throw new BadRequestException(
        `Organization with email "${createOrganizationDto.email}" already exists`,
      );
    }
    return this.prisma.organization.create({
      data: createOrganizationDto,
    });
  }

  async findAll() {
    const organizations = await this.prisma.organization.findMany();

    const raisedByOrg = await this.prisma.donation.groupBy({
      by: ['organizationId'],
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    });

    const raisedMap = new Map<string, number>(
      raisedByOrg.map((r) => [r.organizationId, r._sum.amount ?? 0]),
    );

    return organizations.map((org) => ({
      ...org,
      password: undefined,
      raised: raisedMap.get(org.id) ?? 0,
      donors: 0,
    }));
  }

  async findOne(id: string) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
      });
      if (!organization) {
        throw new NotFoundException(`Organization with ID "${id}" not found`);
      }
      const raisedAgg = await this.prisma.donation.aggregate({
        where: { organizationId: id, status: 'APPROVED' },
        _sum: { amount: true },
      });
      return {
        ...organization,
        password: undefined,
        raised: raisedAgg._sum.amount ?? 0,
        donors: 0,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Database error');
    }
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    if (!this.isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id },
      });
      if (!organization) {
        throw new NotFoundException(`Organization with ID "${id}" not found`);
      }
      return this.prisma.organization.update({
        where: { id },
        data: updateOrganizationDto,
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
      const organization = await this.prisma.organization.findUnique({
        where: { id },
      });
      if (!organization) {
        throw new NotFoundException(`Organization with ID "${id}" not found`);
      }
      return this.prisma.organization.delete({
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
