import type { UserRole } from '@/constants/UserRole';

export interface UserSignupForm {
  username: string;
  email: string;
  password: string;
  name: string;
  date: string;
  address: string;
  role: UserRole;
  avatar: string;
}
