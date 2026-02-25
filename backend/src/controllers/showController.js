const tmdb = require('../services/tmdb');

async function getPopular(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const data = await tmdb.getPopularShows(page);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getTrending(req, res, next) {
  try {
    const timeWindow = req.query.time_window === 'day' ? 'day' : 'week';
    const data = await tmdb.getTrendingShows(timeWindow);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const { q, page } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const data = await tmdb.searchShows(q.trim(), parseInt(page) || 1);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getGenres(req, res, next) {
  try {
    const data = await tmdb.getShowGenres();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function discover(req, res, next) {
  try {
    const { genre, page } = req.query;
    if (!genre) {
      return res.status(400).json({ error: 'Query parameter "genre" is required' });
    }
    const genres = genre.split(',').map((g) => g.trim());
    const data = await tmdb.discoverShowsByGenre(genres, parseInt(page) || 1);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getDetails(req, res, next) {
  try {
    const { id } = req.params;
    const data = await tmdb.getShowDetails(id);
    res.json(data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'Show not found' });
    }
    next(err);
  }
}

async function getRecommendations(req, res, next) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const data = await tmdb.getShowRecommendations(id, page);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPopular,
  getTrending,
  search,
  getGenres,
  discover,
  getDetails,
  getRecommendations,
};
