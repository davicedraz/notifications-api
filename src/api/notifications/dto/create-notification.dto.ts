import { NotificationChannelDTO } from './notification-channel.dto';
import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDTO {
  @ApiProperty({ required: true, description: 'Notification title that Which will be displayed in the header of the notification'})
  @IsNotEmpty({ message: 'title cannot be empty' })
  title: string;

  @ApiProperty({ required: true, description: 'Content that will go inside the body of the notification'})
  @IsNotEmpty({ message: 'content cannot be empty'})
  content: string;

  @ApiProperty({ required: false, description: 'Image url that should be used as notification icon or attachment' })
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: true, description: 'Channel on which the notification should be sent (currently only "web_push" channel is supported)' })
  @IsEnum(NotificationChannelDTO)
  channel: NotificationChannelDTO;

  @ApiProperty({ required: true, description: 'Email of the registered user who should receive the notification. It will not be send if the User has unsubscribed' })
  @IsNotEmpty({ message: 'user email cannot be empty' })
  @IsEmail()
  userEmail: string;

  @ApiProperty({ required: false, description: 'Desired date and time for the notification to be sent. If not informed, it will be sent immediately.' })
  sendAfter?: Date;
}
