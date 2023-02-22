import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { rateLimit } from 'express-rate-limit';
import * as morgan from 'morgan';
import helmet from 'helmet';
import { RabbitmqService } from './amqp/rabbitmq.service';

function handleSecurity(app) {
  app.use(helmet()); //middleware to set security headers
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.use(morgan('tiny')); //enable http requests logs
  handleSecurity(app);

  await app.listen(process.env.PORT);
}

bootstrap();
