import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
import { AMQP_SERVICE } from './../../../util/constants';
import { ClientProxy } from '@nestjs/microservices';
import { NotificationsRepository } from './notifications.repository';
import { Notification } from '../../database/schemas/notification.schema';
import { User } from '../../database/schemas/user.schema';
import { NotificationDTO } from './dto/notification.dto';
import { UserDTO } from '../users/dto/user.dto';

describe('NotificationsService', () => {
  let notificationsService: NotificationsService;
  let usersService: UsersService;
  let amqpService: ClientProxy;
  let notificationsRepository: NotificationsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn().mockResolvedValue(new User()),
          },
        },
        {
          provide: AMQP_SERVICE,
          useValue: {
            send: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
          },
        },
        {
          provide: NotificationsRepository,
          useValue: {
            findAllPendingNotifications: jest.fn().mockResolvedValue([new Notification()]),
            updateSentAt: jest.fn().mockResolvedValue(new Notification()),
          },
        },
      ],
    }).compile();

    notificationsService = moduleRef.get<NotificationsService>(NotificationsService);
    usersService = moduleRef.get<UsersService>(UsersService);
    amqpService = moduleRef.get<ClientProxy>(AMQP_SERVICE);
    notificationsRepository = moduleRef.get<NotificationsRepository>(NotificationsRepository);
  });

  describe('checkPendingNotifications', () => {

    it('should not send any notification if there are no pending notifications', async () => {
      (notificationsRepository.findAllPendingNotifications as jest.Mock).mockResolvedValueOnce([]);
      await notificationsService.checkPendingNotifications();

      expect(amqpService.send).not.toBeCalled();
    });

    it('should not send notification if scheduledAt is in the future', async () => {
      const user = new User();
      user.email = 'test@example.com';
      (usersService.getUserByEmail as jest.Mock).mockResolvedValueOnce(user);

      const futureScheduledAt = new Date(Date.now() + 100000);
      const notification = new Notification();
      notification.id = 'test-id';
      notification.userEmail = user.email;
      notification.scheduledAt = futureScheduledAt;
      (notificationsRepository.findAllPendingNotifications as jest.Mock).mockResolvedValueOnce([notification]);

      await notificationsService.checkPendingNotifications();

      expect(amqpService.send).not.toBeCalled();
    });

    it('should send notification if scheduledAt is now or in the past', async () => {
      const user = new User();
      user.email = 'test@example.com';
      (usersService.getUserByEmail as jest.Mock).mockResolvedValueOnce(user);

      const pastScheduledAt = new Date(Date.now() - 100000);
      const notification = new Notification();
      notification.id = 'test-id';
      notification.userEmail = user.email;
      notification.scheduledAt = pastScheduledAt;
      (notificationsRepository.findAllPendingNotifications as jest.Mock).mockResolvedValueOnce([notification]);

      await notificationsService.checkPendingNotifications();

      expect(amqpService.send).toBeCalledWith('create-new-notification', {
        notification: NotificationDTO.fromEntity(notification),
        user: UserDTO.fromEntity(user),
      });

      expect(notificationsRepository.updateSentAt).toBeCalled();
    });

  });

  describe('shouldSendNotificationNow', () => {
    it('should return true if scheduledAt is undefined', () => {
      const notification = { scheduledAt: undefined } as Notification;
      const result = notificationsService.shouldSendNotificationNow(notification);
      expect(result).toBe(true);
    });

    it('should return true if scheduledAt is in the past', () => {
      const scheduledAt = new Date('2022-01-01');
      const now = new Date('2022-01-02');
      const notification = { scheduledAt } as Notification;
      jest.spyOn(global, 'Date').mockImplementation(() => now);

      const result = notificationsService.shouldSendNotificationNow(notification);
      expect(result).toBe(true);
    });

    it('should return false if scheduledAt is in the future', () => {
      const scheduledAt = new Date('2022-01-02');
      const now = new Date('2022-01-01');
      const notification = { scheduledAt } as Notification;
      jest.spyOn(global, 'Date').mockImplementation(() => now);

      const result = notificationsService.shouldSendNotificationNow(notification);
      expect(result).toBe(false);
    });
  });

});
