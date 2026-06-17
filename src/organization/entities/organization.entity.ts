import { OrgType } from '@prisma/client';

export class OrganizationEntity {
  id: string;
  name: string;
  email: string;
  type: OrgType;
  createdAt: Date;
  address: string;
  isActive: boolean;
  goal?: number;
  raised?: number;
  donors?: number;
  image?: string;
  coverImage?: string;
  tagline?: string;
  category?: string;
  location?: string;
  featured?: boolean;
  beneficiaries?: number;

  constructor(partial: Partial<OrganizationEntity>) {
    Object.assign(this, partial);
  }
}
