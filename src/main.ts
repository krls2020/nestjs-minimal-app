import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Zerops routes traffic through an L7 HTTP balancer.
  // trust proxy ensures Express reads the real client IP
  // and protocol from X-Forwarded-* headers.
  app.set('trust proxy', true);

  // EJS templates for the dashboard page
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('ejs');

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
