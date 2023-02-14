import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
require('express-async-errors');
import apiCoreV1 from './src/apis/core_v1/routers/router';
import dbConnect from './src/config/connectMongoDb';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs = require('fs');

const key1 = crypto.randomBytes(32).toString('hex');
const key2 = crypto.randomBytes(32).toString('hex');

// console.table({ key1, key2 });

dotenv.config();

const app = express();
app.use(morgan('common'));
app.enable('trust proxy');
app.use(
  cors({
    orgin: '*',
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());

dbConnect();

const swaggerFile = process.cwd() + '/swagger/swagger.json';
const swaggerData = fs.readFileSync(swaggerFile, 'utf8');
const swaggerDocument = JSON.parse(swaggerData);

// const document_swagger_v1 = `./swagger/swagger.v1.yml`;

// const swaggerDocumentV1 = YAML.load(path.resolve(__dirname, document_swagger_v1));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use(
//   '/api-v1/docs',
//   swaggerUi.serveFiles(swaggerDocumentV1),
//   swaggerUi.setup(swaggerDocumentV1),
// );

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
