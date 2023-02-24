import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_ATLAS } = process.env;

mongoose.set('strictQuery', false);

export default async function dbConnect() {
  try {
    const conn = await mongoose.connect(MONGODB_ATLAS);
    if (conn.connection.readyState === 1) console.log(`Database connect success`);
    return conn;
  } catch (error) {
    console.log(`Database connect failed`);
    throw new Error(error);
  }
}
