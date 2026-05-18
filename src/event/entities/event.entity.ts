export class EventEntity {
  id: string;
  name: string;
  description: string;
  date: Date;
  createdAt: Date;
  isActive: boolean;
  organizationId: string;

  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }
}
