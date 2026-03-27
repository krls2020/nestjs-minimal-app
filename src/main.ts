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

  // EJS templates — views/ is at repo root, deployed alongside dist/.
  // process.cwd() resolves to /var/www/ on Zerops at runtime.
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.setViewEngine('ejs');

  const port = process.env.PORT || 3000;
  // Bind to 0.0.0.0 — required on Zerops. Localhost binding
  // causes 502 because the L7 balancer can't reach the app.
  await app.listen(port, '0.0.0.0');
}
bootstrap();
