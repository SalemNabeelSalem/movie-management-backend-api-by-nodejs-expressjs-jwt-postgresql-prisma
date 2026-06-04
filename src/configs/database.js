import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient({
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
    console.log('Database disconnected successfully');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
  }
}

export {prisma, connectDataBase, disconnectDataBase};