import express from 'express';

import {addMovieToWatchlist} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.post('/', addMovieToWatchlist);

export default router;