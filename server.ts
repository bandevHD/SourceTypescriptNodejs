import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiCoreV1 from './src/apis/core_v1/routers/router';
export const createServer = () => {
  const app = express();
  app.use(morgan('common'));
  app.enable('trust proxy');
  app.use(
    cors({
      origin: '*',
    }),
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(bodyParser({ extended: false }));
  app.use(bodyParser.json());

  app.use('/api-v1', apiCoreV1);
  return app;
};
