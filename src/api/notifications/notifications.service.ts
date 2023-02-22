import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { Notification } from 'src/database/schemas/notification.schema';
import { NotificationsRepository } from './notifications.repository';
import { UpdateNotification } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {

  constructor(private readonly notificationsRepository: NotificationsRepository) { }

  async getNotificationById(notificationId: string): Promise<Notification> {
    return this.notificationsRepository.findOne({ notificationId })
  }

  async listNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find({});
  }

  async createNotification(title: string, content: string, userEmail: string, imageUrl: string,
    channel: string, scheduledAt: Date): Promise<Notification> {

    return this.notificationsRepository.create({
      id: uuidv4(),
      title,
      content,
      userEmail,
      imageUrl,
      channel,
      scheduledAt,
      sentAt: undefined
    })
  }

  async updateNotification(notificationId: string, notificationUpdates: UpdateNotification): Promise<Notification> {
    return this.notificationsRepository.findOneAndUpdate({ notificationId }, notificationUpdates);
  }

}
