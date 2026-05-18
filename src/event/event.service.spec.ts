import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('EventService', () => {
  let service: EventService;
  const mockPrismaService = {
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    organization: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        organizationId: '507f1f77bcf86cd799439011',
      };
      const expectedResult = {
        id: '123',
        ...createEventDto,
        date: new Date(),
        isActive: true,
        createdAt: new Date(),
      };

      mockPrismaService.organization.findUnique.mockResolvedValue({
        id: '507f1f77bcf86cd799439011',
      });
      mockPrismaService.event.create.mockResolvedValue(expectedResult);

      const result = await service.create(createEventDto);
      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.organization.findUnique).toHaveBeenCalledWith({
        where: { id: createEventDto.organizationId },
      });
      expect(mockPrismaService.event.create).toHaveBeenCalledWith({
        data: createEventDto,
      });
    });

    it('should throw BadRequestException for invalid organizationId', async () => {
      const createEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        organizationId: 'invalid-id',
      };

      await expect(service.create(createEventDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if organization does not exist', async () => {
      const createEventDto = {
        name: 'Test Event',
        description: 'Test Description',
        organizationId: '507f1f77bcf86cd799439011',
      };

      mockPrismaService.organization.findUnique.mockResolvedValue(null);

      await expect(service.create(createEventDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const expectedResult = [
        { id: '1', name: 'Event 1' },
        { id: '2', name: 'Event 2' },
      ];

      mockPrismaService.event.findMany.mockResolvedValue(expectedResult);

      const result = await service.findAll();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const eventId = '507f1f77bcf86cd799439011';
      const expectedResult = { id: eventId, name: 'Test Event' };

      mockPrismaService.event.findUnique.mockResolvedValue(expectedResult);

      const result = await service.findOne(eventId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if event not found', async () => {
      const eventId = '507f1f77bcf86cd799439011';

      mockPrismaService.event.findUnique.mockResolvedValue(null);

      await expect(service.findOne(eventId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const eventId = '507f1f77bcf86cd799439011';
      const updateEventDto = { name: 'Updated Event' };
      const expectedResult = { id: eventId, name: 'Updated Event' };

      mockPrismaService.event.findUnique.mockResolvedValue({ id: eventId });
      mockPrismaService.event.update.mockResolvedValue(expectedResult);

      const result = await service.update(eventId, updateEventDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const eventId = '507f1f77bcf86cd799439011';
      const expectedResult = { id: eventId, name: 'Deleted Event' };

      mockPrismaService.event.findUnique.mockResolvedValue({ id: eventId });
      mockPrismaService.event.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(eventId);
      expect(result).toEqual(expectedResult);
    });
  });
});
