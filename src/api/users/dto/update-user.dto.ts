import { Type } from "class-transformer";
import { IsArray, IsEmail, IsObject, IsString, ValidateNested } from "class-validator";
import { UserPreferencesDTO } from "./create-user.dto";

export class UpdateUserDTO {
  @IsString()
  name?: string;

  @IsEmail()
  email?: string;

  @IsString()
  phoneNumber?: string;

  @IsObject()
  webPushSubscription?: Object;
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserPreferencesDTO)
  preferences?: UserPreferencesDTO[];
}
