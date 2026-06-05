import 'dotenv/config';

import pg from 'pg';
import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';

const {Pool} = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required to initialize Prisma.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.ENVIRONMENT === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

const connectDataBase = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with a failure code if the database connection fails
  }
}

const disconnectDataBase = async () => {
  try {
    await prisma.$disconnect();
    await pool.end();
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
  }
}

export {prisma, connectDataBase, disconnectDataBase};