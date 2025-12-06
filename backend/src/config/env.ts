import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  theSportsDb: {
    apiKey: process.env.THESPORTSDB_API_KEY || '',
    baseUrl: process.env.THESPORTSDB_BASE_URL || 'https://www.thesportsdb.com/api/v1/json'
  }
};
