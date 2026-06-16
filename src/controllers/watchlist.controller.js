import {prisma} from '../configs/database.js';

const addMovieToWatchlist = async (req, res) => {
  // Data arrives 100% validated and sanitized from middleware
  const {movieId, status, rating, notes} = req.body;

  const userId = req.user.id;

  try {
    // Verify movie exists
    const movie = await prisma.movie.findUnique({
      where: {id: movieId},
    });

    if (!movie) {
      return res.status(404).json({ // 404 Not Found
        message: 'Movie not found.'
      });
    }

    // Check if the movie is already added to the watchlist
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

    // Create watchlist entry
    const watchlistEntry = await prisma.watchList.create({
      data: {
        userId,
        movieId,
        status, // Zod handles the default fallback automatically now
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

const getAllWatchlist = async (req, res) => {
  const userId = req.user.id;

  try {
    const watchlistEntries = await prisma.watchList.findMany({
      where: {
        userId
      },
      include: {
        movie: true // Include movie details in the response
      }
    });

    res.status(200).json({ // 200 OK
      message: 'Watchlist entries retrieved successfully.',
      data: {
        watchlistEntries
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while retrieving the watchlist entries.',
      error: error.message
    });
  }
}

const getWatchlistEntryById = async (req, res) => {
  const userId = req.user.id;
  const watchlistId = req.params.id; // Already verified as a valid UUID

  try {
    const watchlistEntry = await prisma.watchList.findUnique({
      where: {
        id: watchlistId
      },
    });

    if (!watchlistEntry) {
      return res.status(404).json({ // 404 Not Found
        message: 'Watchlist entry not found.'
      });
    }

    // Check if the watchlist entry belongs to the user
    if (watchlistEntry.userId !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to view this watchlist entry.'
      });
    }

    res.status(200).json({ // 200 OK
      message: 'Watchlist entry retrieved successfully.',
      data: {
        watchlistEntry
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while retrieving the watchlist entry.',
      error: error.message
    });
  }
}

const updateWatchlistEntry = async (req, res) => {
  const userId = req.user.id;
  const watchlistId = req.params.id; // Already verified as a valid UUID
  const updateData = req.body; // Clean payload strips out extra keys automatically

  // ✅ Keeps controller safe from empty payloads ({})
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

    // Check if the watchlist entry belongs to the user
    if (existingInWatchlist.userId !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to update this watchlist entry.'
      });
    }

    // Update directly via Prisma (Zod already stripped undefined keys)
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
  const watchlistId = req.params.id; // Already verified as a valid UUID

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

    // Check if the watchlist entry belongs to the user
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
  getAllWatchlist,
  getWatchlistEntryById,
  updateWatchlistEntry,
  deleteMovieFromWatchlist
}