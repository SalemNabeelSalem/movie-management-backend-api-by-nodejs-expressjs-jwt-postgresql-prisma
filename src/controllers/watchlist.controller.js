import {prisma} from '../configs/database.js';

const addMovieToWatchlist = async (req, res) => {
  const {movieId, status, rating, notes} = req.body;

  const userId = req.user.id;

  if (!movieId || !status || !rating || !notes) {
    return res.status(400).json({ // 400 Bad Request
      message: 'Movie ID, status, rating, and notes are required.'
    });
  }

  // Verify movie exists
  const movie = await prisma.movie.findUnique({
    where: {id: movieId},
  });

  if (!movie) {
    return res.status(404).json({ // 404 Not Found
      message: 'Movie not found.'
    });
  }

  // Check if the movie already added to the watchlist
  const existingInWatchlist = await prisma.watchList.findUnique({
    where: {
      userId_movieId: {
        userId: userId,
        movieId: movieId
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
      status: status || 'PLANNED',
      rating,
      notes
    },
  });

  res.status(201).json({ // 201 Created
    message: 'Movie added to watchlist successfully.',
    data: {
      watchlistEntry: watchlistEntry
    }
  });
}

const updateWatchlistEntry = async (req, res) => {
  const userId = req.user.id;

  const watchlistId = req.params.id;

  const {status, rating, notes} = req.body;

  if (!status && !rating && !notes) {
    return res.status(400).json({ // 400 Bad Request
      message: 'At least one of status, rating, or notes must be provided for update.'
    });
  }

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

  // Build Update Data Object
  const updateData = {};
  if (status) updateData.status = status.toUpperCase();
  if (rating) updateData.rating = rating;
  if (notes) updateData.notes = notes;

  const updatedWatchlist = await prisma.watchList.update({
    where: {
      id: watchlistId
    },
    data: updateData
  });

  res.status(200).json({ // 200 OK
    message: 'Watchlist entry updated successfully.',
    data: {
      updatedWatchlist: updatedWatchlist
    }
  });
}
const deleteMovieFromWatchlist = async (req, res) => {
  const userId = req.user.id;

  const watchlistId = req.params.id;

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
}

export {
  addMovieToWatchlist,
  updateWatchlistEntry,
  deleteMovieFromWatchlist
}