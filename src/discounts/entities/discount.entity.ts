export class DiscountEntity {
  id: string;
  code: string;
  description: string;
  discount: number;
  pointsRequired: number;
  isActive: boolean;
  organizationId: string;

  constructor(partial: Partial<DiscountEntity>) {
    Object.assign(this, partial);
  }
}
