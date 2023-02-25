import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../../database/schemas/user.schema';

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async findOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilterQuery);
  }

  async find(userFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(userFilterQuery);
  }

  async create(user: User): Promise<User> {
    this.logger.log('Created new user', user);

    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOneAndUpdate(userFilterQuery: FilterQuery<User>, userToBeUpdated: Partial<User>): Promise<User> {
    const existingUser = await this.userModel.findOne(userFilterQuery);

    const updatedFields = {};
    for (const key in userToBeUpdated) {
      if (userToBeUpdated[key] !== existingUser[key]) {
        updatedFields[key] = userToBeUpdated[key];
      }
    }

    const updatedUserData = await this.userModel.findOneAndUpdate(
      userFilterQuery,
      { $set: updatedFields },
      { new: true }
    ).lean();

    const updatedUser = new this.userModel(updatedUserData);
    return updatedUser;
  }

  async deleteOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOneAndDelete(userFilterQuery);
  }
}
