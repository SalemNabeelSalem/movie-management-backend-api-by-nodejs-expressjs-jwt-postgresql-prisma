import express from 'express';

import {authMiddleware} from "../middlewares/auth.middleware.js";
import {validateRequestsMiddleware} from "../middlewares/validate-requests.middleware.js";
import {createWatchlistSchema, updateWatchlistSchema, watchlistIdParamSchema} from '../validators/watchlist.validator.js';
import {addMovieToWatchlist, updateWatchlistEntry, deleteMovieFromWatchlist} from '../controllers/watchlist.controller.js';

const router = express.Router();

router.use(authMiddleware)

router.post(
  '/',
  validateRequestsMiddleware({body: createWatchlistSchema}),
  addMovieToWatchlist
);

router.put(
  '/:id',
  validateRequestsMiddleware({params: watchlistIdParamSchema, body: updateWatchlistSchema}),
  updateWatchlistEntry
);

router.delete(
  '/:id',
  validateRequestsMiddleware({params: watchlistIdParamSchema}),
  deleteMovieFromWatchlist
);

export default router;