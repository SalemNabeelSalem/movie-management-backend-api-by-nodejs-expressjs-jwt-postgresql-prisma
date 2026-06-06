import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {addMovieToWatchlist, deleteMovieFromWatchlist} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.use(authMiddleware)

router.post('/', addMovieToWatchlist);

router.delete('/:movieId', deleteMovieFromWatchlist);

export default router;