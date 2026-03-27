import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('greetings')
export class Greeting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;
}
