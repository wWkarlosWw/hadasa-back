import { PartialType } from '@nestjs/mapped-types';
import { CreateEventSupervisorDto } from './create-event-supervisor.dto';

export class UpdateEventSupervisorDto extends PartialType(
  CreateEventSupervisorDto,
) {}
