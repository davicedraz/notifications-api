import { RabbitmqService } from 'src/amqp/rabbitmq.service';
import { AMQP_SERVICE } from './../../../util/constants';
import { UsersRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: AMQP_SERVICE,
      imports: [ConfigModule],
      useFactory: () => (RabbitmqService.getOptions(process.env.RABBITMQ_QUEUE)),
    }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
