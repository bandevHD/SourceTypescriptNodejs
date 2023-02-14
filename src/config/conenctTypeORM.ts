import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const myDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_DB_HOST,
  port: parseInt(process.env.MYSQL_DB_PORT),
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  entities: ['../model/typeorm/*.js'],
  migrations: ['src/migrations/typeorm'],
  synchronize: true,
  migrationsRun: true,
});
