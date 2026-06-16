import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EventSupervisorService } from './event-supervisor.service';
import { CreateEventSupervisorDto } from './dto/create-event-supervisor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('event-supervisor')
@UseGuards(JwtAuthGuard)
export class EventSupervisorController {
  constructor(
    private readonly eventSupervisorService: EventSupervisorService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() createEventSupervisorDto: CreateEventSupervisorDto) {
    return this.eventSupervisorService.create(createEventSupervisorDto);
  }

  @Get()
  findAll() {
    return this.eventSupervisorService.findAll();
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventSupervisorService.findByEvent(eventId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.eventSupervisorService.remove(id);
  }
}
