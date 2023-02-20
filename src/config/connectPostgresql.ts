import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import entities from '../model/typeorm/postgressql/index';

dotenv.config();

export const myDataSourcePostgres: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: parseInt(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  entities,
  synchronize: true,
});

export const connectPostgresql = () =>
  myDataSourcePostgres
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized posrgres!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });
