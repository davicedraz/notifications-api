import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/database/schemas/notification.schema';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { AMQP_SERVICE } from 'util/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AMQP_SERVICE,
        imports: [ConfigModule],
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBIT_MQ_URI],
            queue: process.env.RABBIT_MQ_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }])
  ],
  providers: [NotificationsRepository, NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule { }
