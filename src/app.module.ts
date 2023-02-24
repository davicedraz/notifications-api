import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AmqpModule } from './amqp/amqp.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ApiModule,
    AmqpModule,
    DatabaseModule
  ]
})
export class AppModule { }
