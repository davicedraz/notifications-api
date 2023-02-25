import { User } from '../../../database/schemas/user.schema';

export class UserDTO {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  webPushSubscription: Object;
  preferences: any[];

  public static fromJSON(partialUser: Partial<UserDTO>): UserDTO {
    const userDTO = new UserDTO();

    userDTO.id = partialUser.id;
    userDTO.name = partialUser.name;
    userDTO.email = partialUser.email;
    userDTO.phoneNumber = partialUser.phoneNumber;
    userDTO.webPushSubscription = partialUser.webPushSubscription;
    userDTO.preferences = partialUser.preferences;

    return userDTO;
  }

  public static fromEntity(user: User): UserDTO {
    return this.fromJSON({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      webPushSubscription: user.webPushSubscription,
      preferences: user.preferences,
    });
  }

  public toEntity(): User {
    const user = new User();

    user.id = this.id;
    user.name = this.name;
    user.email = this.email;
    user.phoneNumber = this.phoneNumber;
    user.webPushSubscription = this.webPushSubscription;
    user.preferences = this.preferences;

    return user;
  }
}
