import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Greeting } from './greeting.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Greeting)
    private readonly greetingRepo: Repository<Greeting>,
  ) {}

  async getGreeting(): Promise<string> {
    const greeting = await this.greetingRepo.findOne({ where: {} });
    return greeting?.message ?? 'No greeting found';
  }

  async isDatabaseHealthy(): Promise<boolean> {
    try {
      await this.greetingRepo.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
