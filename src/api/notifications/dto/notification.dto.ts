import { Notification } from "src/database/schemas/notification.schema";

export class NotificationDTO {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  channel: string;
  userEmail: string;
  sendAfter: Date;
  sentAt: Date;

  public static fromJSON(partialNotification: Partial<NotificationDTO>): NotificationDTO {
    const notificationDTO = new NotificationDTO();

    notificationDTO.id = partialNotification.id;
    notificationDTO.title = partialNotification.title;
    notificationDTO.content = partialNotification.content;
    notificationDTO.imageUrl = partialNotification.imageUrl;
    notificationDTO.channel = partialNotification.channel;
    notificationDTO.userEmail = partialNotification.userEmail;
    notificationDTO.sendAfter = partialNotification.sendAfter;
    notificationDTO.sentAt = partialNotification.sentAt;

    return notificationDTO;
  }

  public static fromEntity(notification: Notification): NotificationDTO {
    return this.fromJSON({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      imageUrl: notification.imageUrl,
      channel: notification.channel,
      userEmail: notification.userEmail,
      sendAfter: notification.scheduledAt,
      sentAt: notification.sentAt,
    });
  }

  public toEntity(): Notification {
    const notification = new Notification();

    notification.id = this.id;
    notification.title = this.title;
    notification.content = this.content;
    notification.imageUrl = this.imageUrl;
    notification.channel = this.channel;
    notification.userEmail = this.userEmail;
    notification.scheduledAt = this.sendAfter;
    notification.sentAt = this.sentAt;


    return notification;
  }
}