export class EventSupervisorEntity {
  id: string;
  createdAt: Date;
  userId: string;
  eventId: string;

  constructor(partial: Partial<EventSupervisorEntity>) {
    Object.assign(this, partial);
  }
}
