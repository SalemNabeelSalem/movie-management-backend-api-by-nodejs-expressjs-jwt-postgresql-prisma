import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {validateRequestsMiddleware} from "../middlewares/validate-requests.middleware.js";
import {createWatchlistSchema, updateWatchlistSchema, watchlistIdParamSchema} from '../validators/watchlist.validator.js';
import {addMovieToWatchlist, getAllWatchlist, getWatchlistEntryById, updateWatchlistEntry, deleteMovieFromWatchlist} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.use(authMiddleware)

/**
 * @swagger
 * /api/v1/watchlist:
 *   post:
 *     tags:
 *       - Watchlist
 *     summary: Add a movie to the authenticated user's watchlist
 *     description: Adds a new movie to the authenticated user's watchlist with the provided details.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: string
 *                 format: uuid
 *                 description: The unique identifier of the movie to be added to the watchlist.
 *               status:
 *                 type: string
 *                 enum: [PLANNED, WATCHING, COMPLETED, DROPPED]
 *                 description: The status of the watchlist entry.
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: The user's rating for the movie (1-10).
 *               notes:
 *                 type: string
 *                 description: Additional notes or comments about the watchlist entry.
 *     responses:
 *       201:
 *         description: Movie added to watchlist successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistEntry'
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       404:
 *         description: Movie not found.
 *       409:
 *         description: Conflict, Movie already in watchlist.
 *       500:
 *         description: An error occurred while adding the movie to the watchlist.
 */
router.post(
  '/',
  validateRequestsMiddleware({body: createWatchlistSchema}),
  addMovieToWatchlist
);

/**
 * @swagger
 * /api/v1/watchlist:
 *   get:
 *     tags:
 *       - Watchlist
 *     summary: Get all watchlist entries for the authenticated user
 *     description: Retrieve a list of all movies in the authenticated user's watchlist.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of watchlist entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WatchlistEntry'
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       500:
 *         description: An error occurred while retrieving the watchlist entries.
 */
router.get(
  '/',
  getAllWatchlist
);

/**
 * @swagger
 * /api/v1/watchlist/{id}:
 *   get:
 *     tags:
 *       - Watchlist
 *     summary: Get a watchlist entry by ID
 *     description: Retrieve a specific watchlist entry by its ID, if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the watchlist entry.
 *     responses:
 *       200:
 *         description: The watchlist entry details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistEntry'
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       403:
 *         description: Forbidden, You do not have permission to view this watchlist entry.
 *       404:
 *         description: Watchlist entry not found.
 *       500:
 *         description: An error occurred while retrieving the watchlist entry.
 */
router.get(
  '/:id',
  validateRequestsMiddleware({params: watchlistIdParamSchema}),
  getWatchlistEntryById
);

/**
 * @swagger
 * /api/v1/watchlist/{id}:
 *   put:
 *     tags:
 *       - Watchlist
 *     summary: Update a watchlist entry by ID
 *     description: Updates a specific watchlist entry by its ID, if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the watchlist entry to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLANNED, WATCHING, COMPLETED, DROPPED]
 *                 description: The updated status of the watchlist entry.
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
 *                 description: The updated user's rating for the movie (1-10).
 *               notes:
 *                 type: string
 *                 description: Updated additional notes or comments about the watchlist entry.
 *     responses:
 *       200:
 *         description: Watchlist entry updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WatchlistEntry'
 *       400:
 *         description: Bad request, At least one field (status, rating, or notes) must be provided for update.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       403:
 *         description: Forbidden, You do not have permission to update this watchlist entry.
 *       404:
 *         description: Watchlist entry not found.
 *       500:
 *         description: An error occurred while updating the watchlist entry.
 */
router.put(
  '/:id',
  validateRequestsMiddleware({params: watchlistIdParamSchema, body: updateWatchlistSchema}),
  updateWatchlistEntry
);

/**
 * @swagger
 * /api/v1/watchlist/{id}:
 *   delete:
 *     tags:
 *       - Watchlist
 *     summary: Remove a movie from the authenticated user's watchlist
 *     description: Deletes a specific watchlist entry by its ID, if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the watchlist entry to be deleted.
 *     responses:
 *       200:
 *         description: Movie removed from watchlist successfully.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       403:
 *         description: Forbidden, You do not have permission to delete this watchlist entry.
 *       404:
 *         description: Watchlist entry not found.
 *       500:
 *         description: An error occurred while deleting the watchlist entry.
 */
router.delete(
  '/:id',
  validateRequestsMiddleware({params: watchlistIdParamSchema}),
  deleteMovieFromWatchlist
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     WatchlistEntry:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the watchlist entry.
 *         userId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user who owns the watchlist entry.
 *         movieId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the movie in the watchlist entry.
 *         status:
 *           type: string
 *           enum: [PLANNED, WATCHING, COMPLETED, DROPPED]
 *           description: The status of the watchlist entry.
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: The user's rating for the movie (1-10).
 *         notes:
 *           type: string
 *           description: Additional notes or comments about the watchlist entry.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the watchlist entry was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the watchlist entry was last updated.
 *         movie:
 *           $ref: '#/components/schemas/Movie'
 *           description: The movie details associated with the watchlist entry.
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         title:
 *           type: string
 *           example: Inception
 *         overview:
 *           type: string
 *           example: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.
 *         releaseYear:
 *           type: integer
 *           example: 2010
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Action", "Sci-Fi", "Thriller"]
 *         runTime:
 *           type: integer
 *           example: 148
 *         posterUrl:
 *           type: string
 *           format: uri
 *           example: https://example.com/poster/inception.jpg
 *         createdBy:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T12:00:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-02T12:00:00Z
 */

export default router;