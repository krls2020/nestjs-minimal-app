import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Greeting } from './greeting.entity';
import { HealthModule } from './health/health.module';
import { CreateGreetings1700000000000 } from './migration/1700000000000-CreateGreetings';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      database: process.env.DATABASE_NAME || 'db',
      username: process.env.DATABASE_USERNAME || 'db',
      password: process.env.DATABASE_PASSWORD || '',
      entities: [Greeting],
      migrations: [CreateGreetings1700000000000],
      // Migrations are executed explicitly via initCommands
      // (zsc execOnce), not on application startup.
      migrationsRun: false,
    }),
    TypeOrmModule.forFeature([Greeting]),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
