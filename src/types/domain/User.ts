export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  plan?: 'FREE' | 'PRO';
  createdAt: string;
  updatedAt: string;
}
