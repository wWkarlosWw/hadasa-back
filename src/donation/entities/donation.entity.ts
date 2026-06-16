export class DonationEntity {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  organizationId: string;
  eventId?: string;
  validatedBy?: string;

  constructor(partial: Partial<DonationEntity>) {
    Object.assign(this, partial);
  }
}
