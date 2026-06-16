import { IsString } from 'class-validator';

export class CreateEventSupervisorDto {
  @IsString()
  userId: string;

  @IsString()
  eventId: string;
}
