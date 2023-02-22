import { Injectable } from "@nestjs/common";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitmqService {
  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URI],
        queue: process.env.RABBIT_MQ_QUEUE,
        persistent: true,
        noAck,
      },
    };
  }
}
