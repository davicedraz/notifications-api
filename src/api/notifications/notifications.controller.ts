import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './../../database/schemas/notification.schema';
import { CreateNotification } from './dto/create-notification.dto';
import { UpdateNotification } from './dto/update-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

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
    return this.notificationsService.createNotification(
      newNotification.title,
      newNotification.content,
      newNotification.user_email,
      newNotification.image_url,
      newNotification.channel,
      newNotification.send_after
    )
  }

  @Patch(':id')
  async updateNotification(@Param('id') notificationId: string, @Body() updatedNotification: UpdateNotification): Promise<Notification> {
    return this.notificationsService.updateNotification(notificationId, updatedNotification);
  }

}
