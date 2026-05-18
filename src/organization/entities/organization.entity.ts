import { OrgType } from '@prisma/client';

export class OrganizationEntity {
  id: string;
  name: string;
  email: string;
  type: OrgType;
  createdAt: Date;
  address: string;
  isActive: boolean;

  constructor(partial: Partial<OrganizationEntity>) {
    Object.assign(this, partial);
  }
}
