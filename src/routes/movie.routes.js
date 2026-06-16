import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {validateRequestsMiddleware} from "../middlewares/validate-requests.middleware.js";
import {createMovieSchema, updateMovieSchema, movieIdParamSchema} from '../validators/movie.validator.js';
import {createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie} from '../controllers/movie.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post(
  '/',
  validateRequestsMiddleware({body: createMovieSchema}),
  createMovie
)

router.get(
  '/',
  getAllMovies
)

router.get(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema}),
  getMovieById
)

router.put(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema, body: updateMovieSchema}),
  updateMovie
)

router.delete(
  '/:id',
  validateRequestsMiddleware({params: movieIdParamSchema}),
  deleteMovie
)

export default router;