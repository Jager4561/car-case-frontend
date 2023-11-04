export interface Account {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  date_created: string;
  last_password_change: string;
}