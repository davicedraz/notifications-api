import { NotificationChannelDTO } from './notification-channel.dto';
import { IsString, IsEmail, IsDate, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateNotificationDTO {
  @IsNotEmpty({ message: 'title cannot be empty' })
  title: string;

  @IsNotEmpty({ message: 'content cannot be empty' })
  content: string;

  @IsString()
  imageUrl?: string;

  @IsEnum(NotificationChannelDTO)
  channel: string;

  @IsNotEmpty({ message: 'user email cannot be empty' })
  @IsEmail()
  userEmail: string;

  sendAfter?: Date;
}