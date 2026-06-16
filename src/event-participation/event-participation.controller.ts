import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { EventParticipationService } from './event-participation.service';
import { CreateEventParticipationDto } from './dto/create-event-participation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('event-participation')
@UseGuards(JwtAuthGuard)
export class EventParticipationController {
  constructor(
    private readonly eventParticipationService: EventParticipationService,
  ) {}

  @Post()
  create(
    @Body() createEventParticipationDto: CreateEventParticipationDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.eventParticipationService.create(
      createEventParticipationDto,
      user.userId,
    );
  }

  @Get()
  findAll(@CurrentUser() user: { userId: string; role: string }) {
    return this.eventParticipationService.findAll(user.userId, user.role);
  }

  @Get('event/:eventId')
  findByEvent(@Param('eventId') eventId: string) {
    return this.eventParticipationService.findByEvent(eventId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.eventParticipationService.findOne(id, user.userId, user.role);
  }

  @Patch(':id/attend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERVISOR', 'ADMIN')
  attend(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.eventParticipationService.attend(id, user.userId);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.eventParticipationService.cancel(id, user.userId, user.role);
  }
}
