require('reflect-metadata');
require('express-async-errors');
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import apiCoreV1 from './src/apis/core_v1/routers/router';

import { StatusCodes } from 'http-status-codes';
import swaggerUi from 'swagger-ui-express';
import fs = require('fs');
import { myDataSource } from './src/config/conenctTypeORM';
import redis from './src/config/connectRedis';
import dbConnect from './src/config/connectMongoDb';

// import crypto from 'crypto';
// import YAML from 'yamljs';
// import path from 'path';

// const key1 = crypto.randomBytes(32).toString('hex');
// const key2 = crypto.randomBytes(32).toString('hex');

// console.table({ key1, key2 });

dotenv.config();

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
// app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

dbConnect();

myDataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

const swaggerFile = process.cwd() + '/swagger/swagger.json';
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api-v1', apiCoreV1);
//handle error internal server
app.use((err, req, res, next) => {
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message, messageCode: '500' });
});

//handle api not found
app.use((req, res) => {
  return res.status(StatusCodes.NOT_FOUND).json({ messageCode: '400a' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runing at ${PORT}`);
});
