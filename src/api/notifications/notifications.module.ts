import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/database/schemas/notification.schema';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])],
  providers: [NotificationsRepository, NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
