import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {addMovieToWatchlist, updateWatchlistEntry, deleteMovieFromWatchlist} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.use(authMiddleware)

router.post('/', addMovieToWatchlist);

router.put('/:id', updateWatchlistEntry);

router.delete('/:id', deleteMovieFromWatchlist);

export default router;