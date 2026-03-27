import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async root() {
    const greeting = await this.appService.getGreeting();
    const dbHealthy = await this.appService.isDatabaseHealthy();
    return {
      greeting,
      dbHealthy,
      nodeVersion: process.version,
      nestVersion: require('@nestjs/core/package.json').version,
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
