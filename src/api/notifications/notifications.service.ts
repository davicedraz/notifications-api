import { AMQP_SERVICE } from './../../../util/constants';
import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Notification } from 'src/database/schemas/notification.schema';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationsRepository } from './notifications.repository';
import { ClientProxy } from '@nestjs/microservices';
import { UsersService } from '../users/users.service';
import { User } from 'src/database/schemas/user.schema';
import { UserDTO } from '../users/dto/user.dto';

@Injectable()
export class NotificationsService {

  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly userService: UsersService,
    @Inject(AMQP_SERVICE) private amqpService: ClientProxy
  ) { }

  async sendNotification(user: User, notification: Notification): Promise<Notification> {
    const notificationDTO = NotificationDTO.fromEntity(notification);

    if (this.userService.shouldSendNotification(user, notification)) {
      this.amqpService.send('create-new-notification',
        { notification: notificationDTO, user: UserDTO.fromEntity(user) }
      ).subscribe();

      notification = await this.updateSentAt(notificationDTO);
      this.logger.log(`Notification ${notification.id} sent at ${notification.sentAt}`);
      return notification;
    }
    this.logger.log(`[NOT SEND]: User ${user.id} ("${user.name}") opted-out for ${notification.channel} notifications`);
    return notification;
  }

  async updateSentAt(notification: NotificationDTO): Promise<Notification> {
    notification.sentAt = new Date();
    return this.updateNotification(notification.id, notification);
  }

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

  async deleteNotification(notificationId: string): Promise<Notification> {
    return this.notificationsRepository.deleteOne({ notificationId });
  }

  async updateNotification(notificationId: string, notificationUpdates: Partial<NotificationDTO>): Promise<Notification> {
    return this.notificationsRepository.findOneAndUpdate({ notificationId }, notificationUpdates);
  }

}
