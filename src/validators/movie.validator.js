import {z} from 'zod';

const movieCoreSchema = z.object({
  id: z.uuid({message: 'Invalid movie ID format'}),
  title: z
    .string()
    .trim()
    .min(1, {message: 'Title must be at least 1 character long'})
    .max(255, {message: 'Title must be at most 255 characters long'}),
  overview: z
    .string()
    .trim()
    .max(1000, {message: 'Description must be at most 1000 characters long'})
    .nullable()
    .optional(),
  releaseYear: z
    .number()
    .int()
    .min(1888, {message: 'Release year must be 1888 or later'}) // The year of the first film
    .max(new Date().getFullYear() + 10, {message: 'Release year cannot be in the future'}),
  genres: z
    .array(z.string().trim().min(1, {message: 'Genre cannot be empty'}))
    .min(1, {message: 'At least one genre is required'})
    .max(5, {message: 'At most 5 genres are allowed'}),
  runTime: z
    .number()
    .int()
    .positive({message: 'Runtime must be a positive number of minutes'})
    .min(1, {message: 'Runtime must be at least 1 minute'})
    .max(600, {message: 'Runtime must be at most 600 minutes'}), // Arbitrary upper limit
  posterUrl: z
    .url({message: 'Poster URL must be a valid URL'})
    .or(z.string().trim().max(0)) // Allow empty string as an alternative to null
    .nullable()
    .optional(),
  createdBy: z.uuid({message: 'Invalid user ID format'}),
  createdAt: z.coerce.date(), // Coerce input to a Date object (handles ISO strings)
  updatedAt: z.coerce.date(),
});

// Used when creating a new movie (ID and Dates are handled by the database/Prisma)
const createMovieSchema = movieCoreSchema.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

// Used when updating an existing movie (All fields optional, no accidental defaults)
const updateMovieSchema = movieCoreSchema.partial().omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

const movieIdParamSchema = movieCoreSchema.pick({
  id: true,
});

export {
  createMovieSchema,
  updateMovieSchema,
  movieIdParamSchema,
};