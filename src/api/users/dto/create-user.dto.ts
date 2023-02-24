import { IsNotEmpty, IsEmail, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserPreferences } from 'src/database/schemas/user-preferences.schema';

export class UserPreferencesDTO {
  @ApiProperty({ required: true, description: 'Channel name that the user has unsubscribed' })
  @IsNotEmpty()
  @IsString()
  channel: string;

  @ApiProperty({ required: true, description: 'If user is subscribed from the channel' })
  @IsNotEmpty()
  enabled: boolean;

  // constructor(channel: string, enabled: boolean) {
  //   this.channel = channel;
  //   this.enabled = enabled;
  // }

  public toEntity(): UserPreferences {
    const preferences = new UserPreferences();

    preferences.channel = this.channel;
    preferences.enabled = this.enabled;
   
    return preferences;
  }
}

export class CreateUserDTO {
  @ApiProperty({ required: true, description: 'Name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, description: 'Email of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ required: true, description: 'User web push subscription object' })
  @IsNotEmpty()
  webPushSubscription: Object;

  @ApiProperty({ required: false, description: 'User preferences object array' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserPreferencesDTO)
  preferences?: UserPreferencesDTO[];
}
