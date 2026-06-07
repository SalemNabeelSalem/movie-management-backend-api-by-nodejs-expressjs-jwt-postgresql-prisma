import {z} from 'zod';
import {WatchListStatus} from '@prisma/client';

// 1. Map the Prisma Enum object values into a tuple/array that Zod understands
const statusValues = Object.values(WatchListStatus); // ['PLANNED', 'WATCHING', ...]

// 2. Build the Core Master Schema representing a complete database row
const watchlistCoreSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  movieId: z.uuid(),
  status: z.enum(statusValues).default(WatchListStatus.PLANNED),
  rating: z
    .coerce // Coerce the input to a number (handles string inputs like "8")
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(10, 'Rating must be at most 10')
    .nullable()
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must be at most 500 characters long')
    .nullable()
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 3. Schema for Creating an item (Pick what the user sends, userId often comes from auth session)
const createWatchlistSchema = watchlistCoreSchema.pick({
  movieId: true,
  status: true,
  rating: true,
  notes: true,
});

// 4. Schema for Updating an item (Make the status/rating/notes optional, no accidental defaults)
const updateWatchlistSchema = watchlistCoreSchema.pick({
  status: true,
  rating: true,
  notes: true,
}).partial(); // Make all fields optional for updates

// 5. Schema for the URL Path Parameters (Validates the ID in the URL)
const watchlistIdParamSchema = watchlistCoreSchema.pick({
  id: true,
});

export {
  createWatchlistSchema,
  updateWatchlistSchema,
  watchlistIdParamSchema,
};