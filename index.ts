import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
// import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
require('express-async-errors');
import apiCoreV1 from './src/apis/core_v1/routers/router';
import mongoose from 'mongoose';

dotenv.config();
mongoose.set('strictQuery', false);
const app = express();
app.enable('trust proxy');
app.use(
  cors({
    orgin: '*',
  }),
);
app.use(morgan('common'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser({ extended: false }));
app.use(bodyParser.json());
app.use(apiCoreV1);

// app.use((err, req, res, next) => {});
const PORT = process.env.PORT || 5000;
mongoose
  .connect('mongodb://localhost:27017/databasetraining')
  .then(() => console.log(`Database connect successfull`))
  .catch(() => console.log(`Database connect failed`));
app.listen(PORT, () => {
  console.log(`Server runing at ${PORT}`);
});
