import { IsString } from 'class-validator';

export class CreateEventParticipationDto {
  @IsString()
  eventId: string;
}
