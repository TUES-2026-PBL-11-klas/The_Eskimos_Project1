const { Router } = require('express');
const {
  getPopular,
  getTrending,
  search,
  getGenres,
  discover,
  getDetails,
  getRecommendations,
} = require('../controllers/movieController');

const router = Router();

// GET /api/movies/popular?page=1
router.get('/popular', getPopular);

// GET /api/movies/trending?time_window=week|day
router.get('/trending', getTrending);

// GET /api/movies/search?q=inception&page=1
router.get('/search', search);

// GET /api/movies/genres
router.get('/genres', getGenres);

// GET /api/movies/discover?genre=28,12&page=1
router.get('/discover', discover);

// GET /api/movies/:id
router.get('/:id', getDetails);

// GET /api/movies/:id/recommendations
router.get('/:id/recommendations', getRecommendations);

module.exports = router;
