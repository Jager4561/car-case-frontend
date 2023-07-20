export interface Notification {
  id: number,
  category: string,
  date: Date,
  content: string,
  read: boolean,
  image: string | null
}