import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { Notification } from './../../database/schemas/notification.schema';
import { NotificationsService } from './notifications.service';
import { CreateNotification } from './dto/create-notification.dto';
import { UpdateNotification } from './dto/update-notification.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AMQP_SERVICE } from 'util/constants';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(AMQP_SERVICE) private amqpService: ClientProxy
  ) { }

  @Get(':id')
  async getUser(@Param('id') notificationId: string): Promise<Notification> {
    return this.notificationsService.getNotificationById(notificationId);
  }

  @Get()
  async getNotifications(): Promise<Notification[]> {
    return this.notificationsService.listNotifications();
  }

  @Post()
  async createNotification(@Body() newNotification: CreateNotification): Promise<Notification> {
    const notification = await this.notificationsService.createNotification(
      newNotification.title,
      newNotification.content,
      newNotification.user_email,
      newNotification.image_url,
      newNotification.channel,
      newNotification.send_after
    );

    const result = this.amqpService.send('create-new-notification', { notification });
    result.subscribe();

    return notification;
  }

  @Patch(':id')
  async updateNotification(@Param('id') notificationId: string, @Body() updatedNotification: UpdateNotification): Promise<Notification> {
    return this.notificationsService.updateNotification(notificationId, updatedNotification);
  }

}
