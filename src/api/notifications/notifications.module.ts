import { RabbitmqService } from 'src/amqp/rabbitmq.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/database/schemas/notification.schema';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AMQP_SERVICE } from 'util/constants';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: AMQP_SERVICE,
      imports: [ConfigModule],
      useFactory: () => (RabbitmqService.getOptions(process.env.RABBIT_MQ_QUEUE)),
    }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
  ],
  providers: [NotificationsRepository, NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
