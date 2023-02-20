import { NotificationsModule } from './notifications/notifications.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NotificationsModule
  ]
})
export class ApiModule { }
