import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGreetings1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "greetings" (
        "id" SERIAL PRIMARY KEY,
        "message" VARCHAR NOT NULL
      )
    `);
    await queryRunner.query(`
      INSERT INTO "greetings" ("message")
      SELECT 'Hello from NestJS on Zerops!'
      WHERE NOT EXISTS (SELECT 1 FROM "greetings")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "greetings"`);
  }
}
