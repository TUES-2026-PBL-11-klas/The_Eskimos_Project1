const { Router } = require('express');
const {
  getPopular,
  getTrending,
  search,
  getGenres,
  discover,
  getDetails,
  getRecommendations,
} = require('../controllers/showController');

const router = Router();

// GET /api/shows/popular?page=1
router.get('/popular', getPopular);

// GET /api/shows/trending?time_window=week|day
router.get('/trending', getTrending);

// GET /api/shows/search?q=breaking+bad&page=1
router.get('/search', search);

// GET /api/shows/genres
router.get('/genres', getGenres);

// GET /api/shows/discover?genre=18,80&page=1
router.get('/discover', discover);

// GET /api/shows/:id
router.get('/:id', getDetails);

// GET /api/shows/:id/recommendations
router.get('/:id/recommendations', getRecommendations);

module.exports = router;
