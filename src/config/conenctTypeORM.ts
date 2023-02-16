import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import entities from '../model/typeorm/index';

dotenv.config();

export const myDataSource = new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_DB_HOST,
  port: parseInt(process.env.MYSQL_DB_PORT),
  username: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
  charset: 'utf8mb4',
  entities,
  migrations: ['src/migrations/typeorm'],
  synchronize: true,
  migrationsRun: true,
});