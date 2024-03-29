﻿import { Notification } from './../../database/schemas/notification.schema';
import { NotificationDocument } from 'src/database/schemas/notification.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';


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
    const updatedNotification = await this.notificationModel.findOneAndUpdate(
      notificationFilterQuery,
      { $set: newNotification },
      { new: true }
    );
    return updatedNotification;
  }

  async updateSentAt(notification: any) {
    return await this.notificationModel.findOneAndUpdate(
      { _id: notification._id },
      { sentAt: new Date() },
      { new: true }
    );
  }

  async deleteOne(notificationFilterQuery: FilterQuery<Notification>): Promise<Notification> {
    return this.notificationModel.findOneAndDelete(notificationFilterQuery);
  }

  async findAllPendingNotifications() {
    return this.notificationModel.find({
      $and: [
        { sentAt: { $exists: false } },
        { scheduledAt: { $exists: true } }]
    });
  }

}