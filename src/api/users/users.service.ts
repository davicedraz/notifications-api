import { UserDTO } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { UsersRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async getUserById(userId: string): Promise<User> {
    return this.usersRepository.findOne({ userId });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async listUsers(): Promise<User[]> {
    return this.usersRepository.find({});
  }

  async createUser(name: string, email: string, phoneNumber: string, webPushSubscription: Object, preferences: any): Promise<User> {
    return this.usersRepository.create({
      id: uuidv4(),
      name,
      email,
      phoneNumber,
      webPushSubscription,
      preferences
    });
  }

  async updateUser(userId: string, userUpdates: Partial<UserDTO>): Promise<User> {
    return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
  }

  async deleteUser(userId: string): Promise<User> {
    return this.usersRepository.deleteOne({ userId });
  }
}
