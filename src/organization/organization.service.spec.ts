import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrganizationService', () => {
  let service: OrganizationService;

  const mockPrisma = {
    organization: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockOrganization = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test Org',
    email: 'test@org.com',
    address: 'Test Address',
    phone: '123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Test Org',
      email: 'test@org.com',
      password: 'password123',
      address: 'Test Address',
    };

    it('should create an organization', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);
      mockPrisma.organization.create.mockResolvedValue(mockOrganization);

      const result = await service.create(createDto);

      expect(mockPrisma.organization.findUnique).toHaveBeenCalledWith({
        where: { email: createDto.email },
      });
      expect(mockPrisma.organization.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockOrganization);
    });

    it('should throw BadRequestException when email already exists', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrganization);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      mockPrisma.organization.findMany.mockResolvedValue([mockOrganization]);

      const result = await service.findAll();

      expect(mockPrisma.organization.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockOrganization]);
    });

    it('should return empty array when no organizations exist', async () => {
      mockPrisma.organization.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return an organization by id', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrganization);

      const result = await service.findOne(validId);

      expect(mockPrisma.organization.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(result).toEqual(mockOrganization);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const validId = '507f1f77bcf86cd799439011';
    const updateDto = { name: 'Updated Org' };

    it('should update an organization', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrganization);
      mockPrisma.organization.update.mockResolvedValue({
        ...mockOrganization,
        ...updateDto,
      });

      const result = await service.update(validId, updateDto);

      expect(mockPrisma.organization.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(mockPrisma.organization.update).toHaveBeenCalledWith({
        where: { id: validId },
        data: updateDto,
      });
      expect(result.name).toBe('Updated Org');
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.update(validId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should delete an organization', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrganization);
      mockPrisma.organization.delete.mockResolvedValue(mockOrganization);

      const result = await service.remove(validId);

      expect(mockPrisma.organization.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(mockPrisma.organization.delete).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(result).toEqual(mockOrganization);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when organization not found', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);

      await expect(service.remove(validId)).rejects.toThrow(NotFoundException);
    });
  });
});
