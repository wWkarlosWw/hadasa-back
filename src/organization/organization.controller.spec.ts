import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('OrganizationController', () => {
  let controller: OrganizationController;

  const mockOrganization = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test Org',
    email: 'test@org.com',
    address: 'Test Address',
    phone: '123456789',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [{ provide: OrganizationService, useValue: mockService }],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Test Org',
      email: 'test@org.com',
      password: 'password123',
      address: 'Test Address',
    };

    it('should create an organization', async () => {
      mockService.create.mockResolvedValue(mockOrganization);

      const result = await controller.create(createDto);

      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockOrganization);
    });

    it('should throw BadRequestException when email exists', async () => {
      mockService.create.mockRejectedValue(
        new BadRequestException('Email already exists'),
      );

      await expect(controller.create(createDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of organizations', async () => {
      mockService.findAll.mockResolvedValue([mockOrganization]);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockOrganization]);
    });

    it('should return empty array when no organizations exist', async () => {
      mockService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return an organization by id', async () => {
      mockService.findOne.mockResolvedValue(mockOrganization);

      const result = await controller.findOne(validId);

      expect(mockService.findOne).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockOrganization);
    });

    it('should throw BadRequestException for invalid id', async () => {
      mockService.findOne.mockRejectedValue(
        new BadRequestException('Invalid ID format'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when not found', async () => {
      mockService.findOne.mockRejectedValue(
        new NotFoundException('Organization not found'),
      );

      await expect(controller.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const validId = '507f1f77bcf86cd799439011';
    const updateDto = { name: 'Updated Org' };

    it('should update an organization', async () => {
      mockService.update.mockResolvedValue({
        ...mockOrganization,
        ...updateDto,
      });

      const result = await controller.update(validId, updateDto);

      expect(mockService.update).toHaveBeenCalledWith(validId, updateDto);
      expect(result.name).toBe('Updated Org');
    });

    it('should throw NotFoundException when not found', async () => {
      mockService.update.mockRejectedValue(
        new NotFoundException('Organization not found'),
      );

      await expect(controller.update(validId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should delete an organization', async () => {
      mockService.remove.mockResolvedValue(mockOrganization);

      const result = await controller.remove(validId);

      expect(mockService.remove).toHaveBeenCalledWith(validId);
      expect(result).toEqual(mockOrganization);
    });

    it('should throw NotFoundException when not found', async () => {
      mockService.remove.mockRejectedValue(
        new NotFoundException('Organization not found'),
      );

      await expect(controller.remove(validId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
