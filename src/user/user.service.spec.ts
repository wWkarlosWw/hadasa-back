import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    ci: '12345678',
    password: 'password123',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Test User',
      email: 'test@example.com',
      ci: '12345678',
      password: 'password123',
    };

    it('should create a user', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);

      const result = await service.create(createDto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: createDto.email },
      });
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: createDto,
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when CI already exists', async () => {
      mockPrisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(
        `User with ci "${createDto.ci}" already exists`,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockPrisma.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(mockPrisma.user.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });

    it('should return empty array when no users exist', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(validId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const validId = '507f1f77bcf86cd799439011';
    const updateDto = { name: 'Updated User' };

    it('should update a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });

      const result = await service.update(validId, updateDto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: validId },
        data: updateDto,
      });
      expect(result.name).toBe('Updated User');
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.update(validId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should delete a user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(validId);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: validId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for invalid id format', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(validId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return user info on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login(loginDto.email, loginDto.password);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login(loginDto.email, loginDto.password),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login(loginDto.email, 'wrongpassword'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
