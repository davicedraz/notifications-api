export class CreateNotificationDTO {
  title: string;
  content: string;
  imageUrl: string;
  channel: string;
  userEmail: string;
  sendAfter: Date;
}