import {config} from 'dotenv';
import express from 'express';

import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import {connectDataBase, disconnectDataBase} from './configs/database.js';

config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

/*
 * Middlewares
 * */
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded request bodies

/*
 * Health Check Endpoint
 * */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully!'
  });
});

/*
 * API Routes
 * */
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/auth', authRoutes);

/*
 * Start the Server
 * */
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
 * Database Bootstrap (Separate from Server Startup)
 * */
await connectDataBase();

// Handle unhandled promise rejections (e.g., database connection errors)
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err}`);
  server.close(async () => {
    await disconnectDataBase();
    process.exit(1); // Exit the process with a failure code
  });
});

// Handle uncaught exceptions (e.g., programming errors)
process.on('uncaughtException', async (err) => {
  console.error(`Uncaught Exception: ${err}`);
  await disconnectDataBase();
  process.exit(1); // Exit the process with a failure code
});

// Handle SIGINT (e.g., Ctrl+C) for graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await disconnectDataBase();
    process.exit(0); // Exit the process with a success code
  })
});