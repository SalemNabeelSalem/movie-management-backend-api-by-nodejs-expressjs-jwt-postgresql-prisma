import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {validateRequestsMiddleware} from "../middlewares/validate-requests.middleware.js";
import {createMovieSchema, updateMovieSchema, movieIdParamSchema} from '../validators/movie.validator.js';
import {createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie} from '../controllers/movie.controller.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/v1/movies:
 *   post:
 *     tags:
 *       - Movies
 *     summary: Create a new movie
 *     description: Creates a new movie with the provided details.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               overview:
 *                 type: string
 *                 example: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.
 *               releaseYear:
 *                 type: integer
 *                 example: 2010
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi", "Thriller"]
 *               runTime:
 *                 type: integer
 *                 example: 148
 *               posterUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/poster/inception.jpg
 *     responses:
 *       201:
 *         description: Movie created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request, invalid input data.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       500:
 *         description: An error occurred while creating the movie.
 */
router.post(
  '/',
  validateRequestsMiddleware({body: createMovieSchema}),
  createMovie
)

/**
 * @swagger
 * /api/v1/movies:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get all movies for the authenticated user
 *     description: Retrieves all movies created by the authenticated user or added to their watchlist.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized, No token provided, authorization denied.
 *       500:
 *         description: An error occurred while retrieving movies.
 */
router.get(
  '/',
  getAllMovies
)

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get a movie by ID
 *     description: Retrieves a specific movie by its ID, if it belongs to the authenticated user or is in their watchlist.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the movie.
 *     responses:
 *       200:
 *         description: Movie retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request, invalid movie ID.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: An error occurred while retrieving the movie.
 */
router.get(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema}),
  getMovieById
)

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   put:
 *     tags:
 *       - Movies
 *     summary: Update a movie by ID
 *     description: Updates the details of a specific movie by its ID, if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the movie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               overview:
 *                 type: string
 *                 example: A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.
 *               releaseYear:
 *                 type: integer
 *                 example: 2010
 *               genres:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Action", "Sci-Fi", "Thriller"]
 *               runTime:
 *                 type: integer
 *                 example: 148
 *               posterUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/poster/inception.jpg
 *     responses:
 *       200:
 *         description: Movie updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Bad request, invalid input data or movie ID.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       403:
 *         description: Forbidden, You do not have permission to update this movie.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: An error occurred while updating the movie.
 */
router.put(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema, body: updateMovieSchema}),
  updateMovie
)

/**
 * @swagger
 * /api/v1/movies/{id}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: Delete a movie by ID
 *     description: Deletes a specific movie by its ID, if it belongs to the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the movie.
 *     responses:
 *       200:
 *         description: Movie deleted successfully.
 *       400:
 *         description: Bad request, invalid movie ID.
 *       401:
 *         description: Unauthorized, User not found or account deactivated.
 *       403:
 *         description: Forbidden, You do not have permission to delete this movie.
 *       404:
 *         description: Movie not found.
 *       500:
 *         description: An error occurred while deleting the movie.
 */
router.delete(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema}),
  deleteMovie
)

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
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