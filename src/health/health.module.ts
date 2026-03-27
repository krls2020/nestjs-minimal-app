import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { AppService } from '../app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Greeting } from '../greeting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Greeting])],
  controllers: [HealthController],
  providers: [AppService],
})
export class HealthModule {}
