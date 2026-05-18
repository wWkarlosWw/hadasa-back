import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';

describe('EventController', () => {
  let controller: EventController;

  const mockEventService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByOrganization: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const createEventDto = {
        name: 'Test Event',
        description: 'Test',
        organizationId: '123',
      };
      const expectedResult = { id: '1', ...createEventDto };

      mockEventService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createEventDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const expectedResult = [{ id: '1', name: 'Event 1' }];

      mockEventService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();
      expect(result).toEqual(expectedResult);
    });

    it('should return events by organization', async () => {
      const organizationId = '123';
      const expectedResult = [{ id: '1', organizationId }];

      mockEventService.findByOrganization.mockResolvedValue(expectedResult);

      const result = await controller.findAll(organizationId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return an event', async () => {
      const eventId = '123';
      const expectedResult = { id: eventId, name: 'Test Event' };

      mockEventService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(eventId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const eventId = '123';
      const updateEventDto = { name: 'Updated Event' };
      const expectedResult = { id: eventId, ...updateEventDto };

      mockEventService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(eventId, updateEventDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete an event', async () => {
      const eventId = '123';
      const expectedResult = { id: eventId };

      mockEventService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(eventId);
      expect(result).toEqual(expectedResult);
    });
  });
});
