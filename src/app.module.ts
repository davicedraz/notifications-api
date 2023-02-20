import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    NotificationsModule,
    MongooseModule.forRoot('mongodb://mongo:12345@localhost:27017/')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
