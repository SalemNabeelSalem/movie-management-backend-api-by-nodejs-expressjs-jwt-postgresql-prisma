import {prisma} from "../configs/database.js";

const createMovie = async(req, res) => {
  const {title, overview, releaseYear, genres, runTime, posterUrl} = req.body;
  const userId = req.user.id;

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        overview,
        releaseYear,
        genres,
        runTime,
        posterUrl,
        createdBy: userId
      }
    });

    res.status(201).json({ // 201 Created
      message: 'Movie created successfully.',
      data: {
        movie: newMovie
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while creating the movie.',
      error: error.message
    });
  }
}

const getAllMovies = async (req, res) => {
  const userId = req.user.id;

  try {
    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          {createdBy: userId},
          {
            watchLists: {
              some: {
                userId
              }
            }
          }
        ]
      },
      include: {
        watchLists: {
          where: {userId},
          select: {
            id: true,
            status: true,
            rating: true,
            notes: true,
          }
        }
      }
    });

    res.status(200).json({ // 200 OK
      message: 'Movies retrieved successfully.',
      data: {
        movies
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while retrieving movies.',
      error: error.message
    });
  }
}

const getMovieById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;

  try {
    const movie = await prisma.movie.findUnique({
      where: {id},
      include: {
        watchLists: {
          where: {userId},
          select: {
            id: true,
            status: true,
            rating: true,
            notes: true,
          }
        }
      }
    });

    if (!movie) {
      return res.status(404).json({ // 404 Not Found
        message: 'Movie not found.'
      });
    }

    res.status(200).json({ // 200 OK
      message: 'Movie retrieved successfully.',
      data: {
        movie
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while retrieving the movie.',
      error: error.message
    });
  }
}

const updateMovie = async (req, res) => {
  const {id} = req.params;
  const {title, overview, releaseYear, genres, runTime, posterUrl} = req.body;
  const userId = req.user.id;

  try {
    const movie = await prisma.movie.findUnique({
      where: {id}
    });

    if (!movie) {
      return res.status(404).json({ // 404 Not Found
        message: 'Movie not found.'
      });
    }

    if (movie.createdBy !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to update this movie.'
      });
    }

    const updatedMovie = await prisma.movie.update({
      where: {id},
      data: {
        title,
        overview,
        releaseYear,
        genres,
        runTime,
        posterUrl
      }
    });

    res.status(200).json({ // 200 OK
      message: 'Movie updated successfully.',
      data: {
        movie: updatedMovie
      }
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while updating the movie.',
      error: error.message
    });
  }
}

const deleteMovie = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id;

  try {
    const movie = await prisma.movie.findUnique({
      where: {id}
    });

    if (!movie) {
      return res.status(404).json({ // 404 Not Found
        message: 'Movie not found.'
      });
    }

    if (movie.createdBy !== userId) {
      return res.status(403).json({ // 403 Forbidden
        message: 'You do not have permission to delete this movie.'
      });
    }

    await prisma.movie.delete({
      where: {id}
    });

    res.status(200).json({ // 200 OK
      message: 'Movie deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ // 500 Internal Server Error
      message: 'An error occurred while deleting the movie.',
      error: error.message
    });
  }
}

export {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie
}