import { Injectable } from "@nestjs/common";
import { RmqOptions, Transport } from "@nestjs/microservices";

@Injectable()
export class RabbitmqService {
  static getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: queue,
        persistent: true,
        queueOptions: {
          durable: true
        },
        noAck,
      },
    };
  }
}
