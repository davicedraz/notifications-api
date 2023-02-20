import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { rateLimit } from 'express-rate-limit';
import * as morgan from 'morgan';
import helmet from 'helmet';

function handleSecurity(app) {
  app.use(helmet()); //middleware to set security headers
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny')); //enable http requests logs
  handleSecurity(app);

  await app.listen(process.env.PORT);
}

bootstrap();
