import { IsEnum, IsString } from "class-validator";
import { NotificationChannelDTO } from "./notification-channel.dto";

export class UpdateNotificationDTO {
  title?: string;
  content?: string;
  @IsString()
  imageUrl?: string;
  @IsEnum(NotificationChannelDTO)
  channel?: string;
  sendAfter?: Date;
}
