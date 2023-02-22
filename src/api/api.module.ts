import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule
  ]
})
export class ApiModule { }
