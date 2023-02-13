import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();

app.use(morgan('common'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runing at ${PORT}`);
});
