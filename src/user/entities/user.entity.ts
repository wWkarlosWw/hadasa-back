import { UserRole } from '@prisma/client';

export class UserEntity {
  id: string;
  ci: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  phone: string;
  address: string;
  isActive: boolean;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
