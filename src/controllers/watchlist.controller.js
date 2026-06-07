import {prisma} from '../configs/database.js';
import {
  createWatchlistSchema,
  updateWatchlistSchema,
  watchlistIdParamSchema
} from '../validators/watchlist.validator.js';

const addMovieToWatchlist = async (req, res) => {
  // 1. Validate the request body using Zod
  const bodyValidation = createWatchlistSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Validation failed',
      errors: bodyValidation.error.format()
    });
  }

  // Destructure clean, validated data directly from Zod's output
  const {movieId, status, rating, notes} = bodyValidation.data;
  const userId = req.user.id;

  try {
    // 2. Verify movie exists
    const movie = await prisma.movie.findUnique({
      where: {id: movieId},
    });

    if (!movie) {
      return res.status(404).json({ // 404 Not Found
        message: 'Movie not found.'
      });
    }

    // 3. Check if the movie is already added to the watchlist
    const existingInWatchlist = await prisma.watchList.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId
        }
      },
    });

    if (existingInWatchlist) {
      return res.status(409).json({ // 409 Conflict
        message: 'Movie already in watchlist.'
      });
    }

    // 4. Create watchlist entry
    const watchlistEntry = await prisma.watchList.create({
      data: {
        userId,
        movieId,
        status: // Zod handles the default fallback automatically now
        rating,
        notes
      },
    });

    res.status(201).json({ // 201 Created
      message: 'Movie added to watchlist successfully.',
      data: {
        watchlistEntry
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while adding the movie to the watchlist.',
      error: error.message
    });
  }
}

const updateWatchlistEntry = async (req, res) => {
  const userId = req.user.id;

  // 1. Validate the ID from the URL path parameters
  const paramValidation = watchlistIdParamSchema.safeParse(req.params);

  if (!paramValidation.success) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Invalid watchlist ID parameter.',
      errors: paramValidation.error.format()
    });
  }

  const {id: watchlistId} = paramValidation.data;

  // 2. Validate the update payload from the body
  const bodyValidation = updateWatchlistSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Validation failed',
      errors: bodyValidation.error.format()
    });
  }

  const updateData = bodyValidation.data;

  // 3. Prevent completely empty update calls ({})
  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ // 400 Bad Request
      message: 'At least one field (status, rating, or notes) must be provided for update.'
    });
  }

  try {
    const existingInWatchlist = await prisma.watchList.findUnique({
      where: {
        id: watchlistId
      },
    });

    if (!existingInWatchlist) {
      return res.status(404).json({ // 404 Not Found
        message: 'Watchlist entry not found.'
      });
    }

    // 4. Check if the watchlist entry belongs to the user
    if (existingInWatchlist.userId !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to update this watchlist entry.'
      });
    }

    // 5. Update directly via Prisma (Zod already stripped undefined keys)
    const updatedWatchlist = await prisma.watchList.update({
      where: {
        id: watchlistId
      },
      data: updateData
    });

    res.status(200).json({ // 200 OK
      message: 'Watchlist entry updated successfully.',
      data: {
        updatedWatchlist
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while updating the watchlist entry.',
      error: error.message
    });
  }
}

const deleteMovieFromWatchlist = async (req, res) => {
  const userId = req.user.id;

  // 1. Validate the ID from the URL path parameters
  const paramValidation = watchlistIdParamSchema.safeParse(req.params);

  if (!paramValidation.success) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Invalid watchlist ID parameter.',
      errors: paramValidation.error.format()
    });
  }

  const {id: watchlistId} = paramValidation.data;

  try {
    const existingInWatchlist = await prisma.watchList.findUnique({
      where: {
        id: watchlistId
      },
    });

    if (!existingInWatchlist) {
      return res.status(404).json({ // 404 Not Found
        message: 'Watchlist entry not found.'
      });
    }

    // 2. Check if the watchlist entry belongs to the user
    if (existingInWatchlist.userId !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to delete this watchlist entry.'
      });
    }

    await prisma.watchList.delete({
      where: {
        id: watchlistId
      },
    });

    res.status(200).json({
      message: 'Movie removed from watchlist successfully.'
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while deleting the watchlist entry.',
      error: error.message
    });
  }
}

export {
  addMovieToWatchlist,
  updateWatchlistEntry,
  deleteMovieFromWatchlist
}