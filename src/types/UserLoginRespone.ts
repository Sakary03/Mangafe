import type { UserRole } from '@/constants/UserRole';

export interface UserLoginResponse {
  userID: number;
  username: string;
  name: string;
  dob: Date;
  email: string;
  avatar: string;
  role: UserRole;
}
