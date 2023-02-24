import { Body, Controller, Delete, Get, Inject, Logger, Param, Post, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationDTO } from './dto/notification.dto';
import { AMQP_SERVICE } from 'util/constants';

@Controller('notifications')
export class NotificationsController {

  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(AMQP_SERVICE) private amqpService: ClientProxy
  ) { }

  @Get(':id')
  async getUser(@Param('id') notificationId: string): Promise<NotificationDTO> {
    const notification = await this.notificationsService.getNotificationById(notificationId);
    return NotificationDTO.fromEntity(notification);
  }

  @Get()
  async getNotifications(): Promise<NotificationDTO[]> {
    const notificationsList = await this.notificationsService.listNotifications();
    return notificationsList.map(notification => NotificationDTO.fromEntity(notification));
  }

  @Post()
  async createNotification(@Body(ValidationPipe) newNotification: CreateNotificationDTO): Promise<NotificationDTO> {
    let notification = await this.notificationsService.createNotification(
      newNotification.title,
      newNotification.content,
      newNotification.userEmail,
      newNotification.imageUrl,
      newNotification.channel,
      newNotification.sendAfter
    );

    const notificationDTO = NotificationDTO.fromEntity(notification)
    this.amqpService.send('create-new-notification',
      { notification: notificationDTO }
    ).subscribe();

    notificationDTO.sentAt = new Date();
    this.logger.log(`Notification ${notification.id} sent at ${notificationDTO.sentAt}`);

    notification = await this.notificationsService.updateNotification(notification.id, notificationDTO);
    return NotificationDTO.fromEntity(notification);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') notificationId: string) {
    const notification = await this.notificationsService.deleteNotification(notificationId);
    return NotificationDTO.fromEntity(notification);
  }
}
