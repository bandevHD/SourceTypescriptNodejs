require('reflect-metadata');
require('express-async-errors');
import express from 'express';
import dotenv from 'dotenv';
// import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import fs = require('fs');
import { connectSql } from './src/config/conenctTypeORM';
// import redis from './src/config/connectRedis';
import dbConnect from './src/config/connectMongoDb';
import { connectPostgresql } from './src/config/connectPostgresql';
import { connectApolloServer } from './src/config/connectApolloserver';
import { cronJobApp } from './src/apis/core_v1/cronjob/job';
import { RESPONSES } from './src/utils/HttpStatusResponseCode';
import { graceful } from './src/config/agenda';
import { createServer } from './server';
import { gracefulBull } from './src/config/bull';

// import crypto from 'crypto';
// import YAML from 'yamljs';
// import path from 'path';

// const key1 = crypto.randomBytes(32).toString('hex');
// const key2 = crypto.randomBytes(32).toString('hex');

// console.table({ key1, key2 });

dotenv.config();

const app = createServer();

//Connect db mongodb, mysql, postgresql
dbConnect();
connectSql();
connectPostgresql();
connectApolloServer();
// cronJobApp();

// app.use(graphqlUploadExpress());
const swaggerFile = process.cwd() + '/swagger/swagger.json';
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static(__dirname + '/public'));

//handle error internal server
app.use((err, req, res, next) => {
  return res
    .status(
      err.message && Number.isInteger(Number(err.message.slice(7, 10)))
        ? Number(err.message.slice(7, 10))
        : RESPONSES.INTERNAL_SERVER_ERROR.CODE,
    )
    .json({
      statusCode: err.message.slice(7),
      messageCode: RESPONSES.INTERNAL_SERVER_ERROR.SOMETHING_WENT_WRONG,
    });
});

//handle api not found
app.use((req, res) => {
  return res
    .status(RESPONSES.NOT_FOUND.CODE)
    .json({ messageCode: RESPONSES.NOT_FOUND.API_NOT_FOUND });
});

process.on('SIGINT', gracefulBull);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server runing at ${PORT}`);
});

// process.on('SIGTERM', agendaDrain);
// process.on('SIGINT', agendaDrain);
