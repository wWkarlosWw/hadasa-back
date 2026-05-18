import { UserRole } from '@prisma/client';

export class AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}
