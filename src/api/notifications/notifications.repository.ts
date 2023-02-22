import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Notification, NotificationDocument } from 'src/database/schemas/notification.schema';


@Injectable()
export class NotificationsRepository {

  private readonly logger = new Logger(NotificationsRepository.name);

  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) { }

  async findOne(notificationFilterQuery: FilterQuery<Notification>): Promise<Notification> {
    return this.notificationModel.findOne(notificationFilterQuery);
  }

  async find(notificationFilterQuery: FilterQuery<Notification>): Promise<Notification[]> {
    return this.notificationModel.find(notificationFilterQuery);
  }

  async create(notification: Notification): Promise<Notification> {
    this.logger.log("Created new notification", notification);

    const newNotification = new this.notificationModel(notification);
    return newNotification.save();
  }

  async findOneAndUpdate(notificationFilterQuery: FilterQuery<Notification>, newNotification: Partial<Notification>): Promise<Notification> {
    return this.notificationModel.findOneAndUpdate(notificationFilterQuery, newNotification, { new: true });
  }

}