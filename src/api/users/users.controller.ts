import { Body, Controller, Get, Logger, Param, Patch, Post, ValidationPipe, NotFoundException } from '@nestjs/common';
import { CreateUserDTO, UserPreferencesDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserDTO } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) { }

  @Get(':id')
  async getUser(@Param('id') userId: string): Promise<UserDTO> {
    const user = await this.userService.getUserById(userId);
    return UserDTO.fromEntity(user);
  }

  @Get()
  async getUsers(): Promise<UserDTO[]> {
    const usersList = await this.userService.listUsers();
    return usersList.map(user => UserDTO.fromEntity(user));
  }

  @Post()
  async createUser(@Body(ValidationPipe) newUser: CreateUserDTO): Promise<UserDTO> {
    
    let user = await this.userService.createUser(
      newUser.name,
      newUser.email,
      newUser.phoneNumber,
      newUser.webPushSubscription,
      newUser.preferences,
    );

    this.logger.log("Created new user", user);
    return UserDTO.fromEntity(user);
  }

  @Patch()
  async updateUser(@Body(ValidationPipe) userToBeUpdated: Partial<UpdateUserDTO>): Promise<UserDTO> {
    const user = await this.userService.getUserByEmail(userToBeUpdated.email);
    if (!user) throw new NotFoundException('No user registered with given email');

    const updatedUser = await this.userService.updateUser(user.id, userToBeUpdated);
    return UserDTO.fromEntity(updatedUser);
  }
}
