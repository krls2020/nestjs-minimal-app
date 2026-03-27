import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../app.service';

@Controller('api')
export class HealthController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async health(@Res() res: Response) {
    const dbHealthy = await this.appService.isDatabaseHealthy();
    const status = dbHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    res.status(status).json({
      status: dbHealthy ? 'ok' : 'error',
      database: dbHealthy ? 'connected' : 'disconnected',
    });
  }
}
