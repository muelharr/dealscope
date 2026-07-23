import { User } from './User';

export interface Session {
  id: string;
  user: User;
  token: string;
  expiresAt: string;
  createdAt: string;
}
