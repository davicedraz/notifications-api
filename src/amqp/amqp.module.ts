import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService]
})
export class AmqpModule { }
