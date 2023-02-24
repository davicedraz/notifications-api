import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';

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

  async findOneAndUpdate(userFilterQuery: FilterQuery<User>, updatedUser: Partial<User>): Promise<User> {
    return this.userModel.findOneAndUpdate(userFilterQuery, updatedUser, { new: true });
  }

  async deleteOne(userFilterQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOneAndDelete(userFilterQuery);
  }
}
