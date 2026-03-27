import { DataSource } from 'typeorm';
import { Greeting } from './greeting.entity';
import { CreateGreetings1700000000000 } from './migration/1700000000000-CreateGreetings';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  database: process.env.DATABASE_NAME || 'db',
  username: process.env.DATABASE_USERNAME || 'db',
  password: process.env.DATABASE_PASSWORD || '',
  entities: [Greeting],
  migrations: [CreateGreetings1700000000000],
});
