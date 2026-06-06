import {prisma} from '../configs/database.js';

const addMovieToWatchlist = async (req, res) => {
  const {userId, movieId, status, rating, notes} = req.body;

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
      watchlistEntry
    }
  });
}

export {
  addMovieToWatchlist,
}