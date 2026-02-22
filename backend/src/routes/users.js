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

module.exports = router;
