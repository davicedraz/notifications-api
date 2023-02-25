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
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class NotificationsService {

  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly userService: UsersService,
    @Inject(AMQP_SERVICE) private amqpService: ClientProxy,
    private readonly notificationsRepository: NotificationsRepository,
  ) { }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async checkPendingNotifications() {
    const now = new Date();
    this.logger.log(`Checking database for pending notifications`);
    const pendingNotifications = await this.notificationsRepository.findAllPendingNotifications();

    if (!pendingNotifications.length) {
      this.logger.log(`No pending notifications to send`);
      return;
    }

    for (const notification of pendingNotifications) {
      try {
        if (notification.scheduledAt <= now) {
          const user = await this.userService.getUserByEmail(notification.userEmail);
          this.logger.log(`Sending notification ${notification.id} scheduled at ${notification.scheduledAt}`);
          await this.sendNotification(user, notification);
        }
      } catch (error) {
        this.logger.error(`Error while sending notification ${notification.id}: ${error.message}`);
      }
    }
  }

  shouldSendNotificationNow(notification: Notification) {
    const now = new Date();
    const shouldSendLater = notification.scheduledAt && notification.scheduledAt >= now;
    return !shouldSendLater;
  }

  async sendNotification(user: User, notification: Notification): Promise<Notification> {
    const notificationDTO = NotificationDTO.fromEntity(notification);
    this.amqpService.send('create-new-notification',
      { notification: notificationDTO, user: UserDTO.fromEntity(user) }
    ).subscribe();

    notification = await this.notificationsRepository.updateSentAt(notification);
    this.logger.log(`Notification ${notification.id} sent at ${notification.sentAt}`);
    return notification;
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
