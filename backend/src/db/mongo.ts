import mongoose from 'mongoose';
import { config } from '../config/env';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sports_dashboard';

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URI, {
    // options can be added here if needed
  });
  isConnected = true;
  console.log('Connected to MongoDB');
}

export { mongoose };
