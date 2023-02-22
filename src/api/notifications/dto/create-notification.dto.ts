export interface CreateNotification {
  title: string;
  content: string;
  image_url: string;
  channel: string;
  user_email: string;
  send_after: Date;
}