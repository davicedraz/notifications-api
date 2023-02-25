import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AmqpModule } from './amqp/amqp.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ApiModule,
    AmqpModule,
    DatabaseModule,
    ScheduleModule.forRoot()
  ]
})
export class AppModule { }
