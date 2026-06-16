export class EventParticipationEntity {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  eventId: string;
  validatedBy?: string;

  constructor(partial: Partial<EventParticipationEntity>) {
    Object.assign(this, partial);
  }
}
