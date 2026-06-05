import bcrypt from 'bcryptjs';
import {faker} from '@faker-js/faker';

import {prisma} from '../src/configs/database.js';

// Helper function to generate a cleanly capitalized movie title
const generateMovieTitle = () =>
  `${faker.word.adjective()} ${faker.word.noun()}`
    .replace(/\b\w/g, char => char.toUpperCase());

async function main() {
  console.log('⏳ Starting fast database seeding with Faker & Bcrypt...');

  const USER_COUNT = 3;
  const SALT_ROUNDS = 10; // Standard work factor for balancing security and speed

  // 1. Pre-generate raw user profiles with plain-text passwords for our logs
  const rawUsers = Array.from({length: USER_COUNT}).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    plainPassword: faker.internet.password(), // Keep track of the plain text password to print later
  }));

  console.log('🔑 Hashing passwords...');

  // 2. Hash all passwords in parallel safely
  const usersToCreate = await Promise.all(
    rawUsers.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.plainPassword, SALT_ROUNDS);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword, // This secure hash goes to the database
        updatedAt: user.updatedAt,
      };
    })
  );

  const moviesToCreate = [];
  const watchlistToCreate = [];

  // 3. Build related movies and watchlist maps
  for (const user of usersToCreate) {
    const userMovies = Array.from({length: 2}).map(() => ({
      id: faker.string.uuid(),
      title: generateMovieTitle(),
      overview: faker.lorem.paragraph(),
      releaseYear: faker.number.int({min: 1990, max: 2026}),
      genres: faker.helpers.arrayElements(['Action', 'Sci-Fi', 'Drama', 'Comedy', 'Horror'], {min: 1, max: 3}),
      runTime: faker.number.int({min: 80, max: 180}),
      posterUrl: faker.image.url(),
      createdBy: user.id,
    }));

    moviesToCreate.push(...userMovies);

    watchlistToCreate.push({
      id: faker.string.uuid(),
      userId: user.id,
      movieId: userMovies[0].id,
      status: faker.helpers.arrayElement(['PLANNED', 'WATCHING', 'COMPLETED']),
      rating: faker.number.int({min: 1, max: 5}),
      notes: faker.lorem.sentence(),
    });
  }

  // 4. Run the high-performance transaction query
  console.log('🚀 Writing bulk data to database...');
  await prisma.$transaction([
    prisma.user.createMany({data: usersToCreate}),
    prisma.movie.createMany({data: moviesToCreate}),
    prisma.watchList.createMany({data: watchlistToCreate})
  ]);

  // 5. Print out credentials alongside their plain passwords for debugging/testing
  console.log('\n🔐 --- GENERATED USER CREDENTIALS (USE TO LOG IN) ---');
  rawUsers.forEach((user, index) => {
    console.log(`👤 User #${index + 1}: ${user.name}`);
    console.log(`   📧 Email:          ${user.email}`);
    console.log(`   🔑 Plain Password: ${user.plainPassword}`);
    console.log('----------------------------------------------------');
  });

  console.log(`\n✅ Seeding completed beautifully! Seeded ${USER_COUNT} users (with hashed passwords), ${moviesToCreate.length} movies, and ${watchlistToCreate.length} watchlist entries.`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });