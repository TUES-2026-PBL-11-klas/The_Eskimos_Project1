const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const {
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
} = require('../controllers/userController');

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users/me
router.get('/me', getMe);

// GET    /api/users/favorites
// POST   /api/users/favorites/:movieId
// DELETE /api/users/favorites/:movieId
router.get('/favorites', getFavorites);
router.post('/favorites/:movieId', addFavorite);
router.delete('/favorites/:movieId', removeFavorite);

// GET    /api/users/watched
// PUT    /api/users/watched/:movieId   body: { watched: true|false }
// DELETE /api/users/watched/:movieId
router.get('/watched', getWatched);
router.put('/watched/:movieId', setWatched);
router.delete('/watched/:movieId', removeWatched);

// GET    /api/users/show-favorites
// POST   /api/users/show-favorites/:showId
// DELETE /api/users/show-favorites/:showId
router.get('/show-favorites', getShowFavorites);
router.post('/show-favorites/:showId', addShowFavorite);
router.delete('/show-favorites/:showId', removeShowFavorite);

// GET    /api/users/show-watched
// PUT    /api/users/show-watched/:showId   body: { watched: true|false }
// DELETE /api/users/show-watched/:showId
router.get('/show-watched', getShowWatched);
router.put('/show-watched/:showId', setShowWatched);
router.delete('/show-watched/:showId', removeShowWatched);

module.exports = router;
