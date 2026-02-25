//only for testing and development - not for production use
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  //  Users 
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password: hashedPassword,
      name: 'Alice',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      password: hashedPassword,
      name: 'Bob',
    },
  });

  //  Favorites (TMDB IDs only) 
  // 550 = Fight Club, 278 = The Shawshank Redemption, 238 = The Godfather
  const aliceFavorites = [550, 278, 238];
  for (const tmdbId of aliceFavorites) {
    await prisma.favoriteMovie.upsert({
      where: { userId_tmdbMovieId: { userId: alice.id, tmdbMovieId: tmdbId } },
      update: {},
      create: { userId: alice.id, tmdbMovieId: tmdbId },
    });
  }

  // Watched movies 
  const aliceWatched = [550, 278];
  for (const tmdbId of aliceWatched) {
    await prisma.watchedMovie.upsert({
      where: { userId_tmdbMovieId: { userId: alice.id, tmdbMovieId: tmdbId } },
      update: {},
      create: { userId: alice.id, tmdbMovieId: tmdbId, watched: true },
    });
  }

  await prisma.watchedMovie.upsert({
    where: { userId_tmdbMovieId: { userId: bob.id, tmdbMovieId: 238 } },
    update: {},
    create: { userId: bob.id, tmdbMovieId: 238, watched: true },
  });

  console.log('Seed complete');
  console.log(`  Users : ${alice.email}, ${bob.email}`);
  console.log(`  Alice favorites  : ${aliceFavorites.join(', ')}`);
  console.log(`  Alice watched    : ${aliceWatched.join(', ')}`);
  console.log(`  Bob   watched    : 238`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());