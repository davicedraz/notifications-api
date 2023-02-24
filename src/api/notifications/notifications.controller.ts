import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Res, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UsersService } from './../users/users.service';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { NotificationDTO } from './dto/notification.dto';

import { Response } from 'express';

@Controller('notifications')
export class NotificationsController {

  constructor(
    private readonly userService: UsersService,
    private readonly notificationsService: NotificationsService,
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
  async createNotification(@Body(ValidationPipe) newNotification: CreateNotificationDTO, @Res() response: Response): Promise<NotificationDTO | Response<any>> {
    const user = await this.userService.getUserByEmail(newNotification.userEmail);
    if (!user) throw new NotFoundException('No user registered with given email');

    let notification = await this.notificationsService.createNotification(
      newNotification.title,
      newNotification.content,
      newNotification.userEmail,
      newNotification.imageUrl,
      newNotification.channel,
      newNotification.sendAfter
    );

    const notificationSent = await this.notificationsService.sendNotification(user, notification);

    if (!notificationSent.sentAt) {
      return response.status(HttpStatus.ACCEPTED)
        .send({
          message: `User opted-out for ${notification.channel} notifications`,
          notification: NotificationDTO.fromEntity(notificationSent)
        });
    }

    return response.status(HttpStatus.CREATED)
      .send(NotificationDTO.fromEntity(notificationSent));
  }

  @Delete(':id')
  async deleteNotification(@Param('id') notificationId: string) {
    const notification = await this.notificationsService.deleteNotification(notificationId);
    return NotificationDTO.fromEntity(notification);
  }
}
