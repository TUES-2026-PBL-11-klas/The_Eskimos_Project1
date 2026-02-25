const prisma = require("../config/prisma");

// Get current user profile
async function getMe(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// Favorites

async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favoriteMovie.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: "desc" },
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

async function addFavorite(req, res, next) {
  try {
    const tmdbMovieId = parseInt(req.params.movieId);
    if (isNaN(tmdbMovieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const favorite = await prisma.favoriteMovie.upsert({
      where: {
        userId_tmdbMovieId: { userId: req.user.userId, tmdbMovieId },
      },
      create: { userId: req.user.userId, tmdbMovieId },
      update: {},
    });

    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const tmdbMovieId = parseInt(req.params.movieId);
    if (isNaN(tmdbMovieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    await prisma.favoriteMovie.deleteMany({
      where: { userId: req.user.userId, tmdbMovieId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Watched

async function getWatched(req, res, next) {
  try {
    const watched = await prisma.watchedMovie.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: "desc" },
    });
    res.json(watched);
  } catch (err) {
    next(err);
  }
}

async function setWatched(req, res, next) {
  try {
    const tmdbMovieId = parseInt(req.params.movieId);
    if (isNaN(tmdbMovieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    const watched = req.body.watched !== false; // default true

    const record = await prisma.watchedMovie.upsert({
      where: {
        userId_tmdbMovieId: { userId: req.user.userId, tmdbMovieId },
      },
      create: { userId: req.user.userId, tmdbMovieId, watched },
      update: { watched },
    });

    res.json(record);
  } catch (err) {
    next(err);
  }
}

async function removeWatched(req, res, next) {
  try {
    const tmdbMovieId = parseInt(req.params.movieId);
    if (isNaN(tmdbMovieId)) {
      return res.status(400).json({ error: "Invalid movie ID" });
    }

    await prisma.watchedMovie.deleteMany({
      where: { userId: req.user.userId, tmdbMovieId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Show Favorites

async function getShowFavorites(req, res, next) {
  try {
    const favorites = await prisma.favoriteShow.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: 'desc' },
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

async function addShowFavorite(req, res, next) {
  try {
    const tmdbShowId = parseInt(req.params.showId);
    if (isNaN(tmdbShowId)) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }

    const favorite = await prisma.favoriteShow.upsert({
      where: { userId_tmdbShowId: { userId: req.user.userId, tmdbShowId } },
      create: { userId: req.user.userId, tmdbShowId },
      update: {},
    });

    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
}

async function removeShowFavorite(req, res, next) {
  try {
    const tmdbShowId = parseInt(req.params.showId);
    if (isNaN(tmdbShowId)) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }

    await prisma.favoriteShow.deleteMany({
      where: { userId: req.user.userId, tmdbShowId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// Show Watched

async function getShowWatched(req, res, next) {
  try {
    const watched = await prisma.watchedShow.findMany({
      where: { userId: req.user.userId },
      orderBy: { addedAt: 'desc' },
    });
    res.json(watched);
  } catch (err) {
    next(err);
  }
}

async function setShowWatched(req, res, next) {
  try {
    const tmdbShowId = parseInt(req.params.showId);
    if (isNaN(tmdbShowId)) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }

    const watched = req.body.watched !== false;

    const record = await prisma.watchedShow.upsert({
      where: { userId_tmdbShowId: { userId: req.user.userId, tmdbShowId } },
      create: { userId: req.user.userId, tmdbShowId, watched },
      update: { watched },
    });

    res.json(record);
  } catch (err) {
    next(err);
  }
}

async function removeShowWatched(req, res, next) {
  try {
    const tmdbShowId = parseInt(req.params.showId);
    if (isNaN(tmdbShowId)) {
      return res.status(400).json({ error: 'Invalid show ID' });
    }

    await prisma.watchedShow.deleteMany({
      where: { userId: req.user.userId, tmdbShowId },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMe,
  getFavorites,
  addFavorite,
  removeFavorite,
  getWatched,
  setWatched,
  removeWatched,
  getShowFavorites,
  addShowFavorite,
  removeShowFavorite,
  getShowWatched,
  setShowWatched,
  removeShowWatched,
};
