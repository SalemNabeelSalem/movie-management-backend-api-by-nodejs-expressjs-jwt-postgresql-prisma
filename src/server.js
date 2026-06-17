import {config} from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import watchlistRoutes from "./routes/watchlist.routes.js";
import {connectDataBase, disconnectDataBase} from './configs/database.js';

import SwaggerDocs from './configs/swagger.js';

config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

/*
 * Middlewares
 * */
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from incoming requests
app.use(express.urlencoded({extended: true})); // Middleware to parse URL-encoded request bodies

/*
 * Swagger Documentation
 * */
SwaggerDocs(app, PORT);

/*
 * Health Check Endpoint
 * */
/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     tags:
 *       - Health Check
 *     summary: Health check endpoint
 *     description: Returns the health status of the server.
 *     responses:
 *       200:
 *         description: Server is running successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running successfully!
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ // 200 OK
    success: true,
    message: 'Server is running successfully!'
  });
});

/*
 * API Routes
 * */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);

/*
 * Start the Server
 *
 * 0.0.0.0: Listen on all network interfaces
 * */
const server = app.listen(PORT, '0.0.0.0', () => {
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