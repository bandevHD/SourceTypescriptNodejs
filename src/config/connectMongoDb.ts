import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGGODB_URI } = process.env;

mongoose.set('strictQuery', false);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(MONGGODB_URI);
    if (conn.connection.readyState === 1) console.log(`Database connect success`);
  } catch (error) {
    console.log(`Database connect failed`);
    throw new Error(error);
  }
};

export default dbConnect;
