export class ClaimedDiscountEntity {
  id: string;
  pointsSpent: number;
  status: string;
  claimedAt: Date;
  userId: string;
  discountId: string;

  constructor(partial: Partial<ClaimedDiscountEntity>) {
    Object.assign(this, partial);
  }
}
