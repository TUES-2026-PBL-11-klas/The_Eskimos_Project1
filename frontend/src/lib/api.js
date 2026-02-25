// All requests go to /api/* which Next.js rewrites to the backend.
const BASE = '/api';

async function request(path, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const res = await fetch(BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({ error: 'Invalid response' }));

  if (!res.ok) throw new Error(data.error || 'Request failed');

  return data;
}

// Movies
export const getPopular         = (page = 1)              => request(`/movies/popular?page=${page}`);
export const getTrending        = (window = 'week')       => request(`/movies/trending?time_window=${window}`);
export const searchMovies       = (q, page = 1)           => request(`/movies/search?q=${encodeURIComponent(q)}&page=${page}`);
export const getGenres          = ()                      => request('/movies/genres');
export const discoverMovies     = (genre, page = 1)       => request(`/movies/discover?genre=${genre}&page=${page}`);
export const getMovieDetails    = (id)                    => request(`/movies/${id}`);
export const getRecommendations = (id)                    => request(`/movies/${id}/recommendations`);

// Shows
export const getPopularShows        = (page = 1)        => request(`/shows/popular?page=${page}`);
export const getTrendingShows       = (window = 'week') => request(`/shows/trending?time_window=${window}`);
export const searchShows            = (q, page = 1)     => request(`/shows/search?q=${encodeURIComponent(q)}&page=${page}`);
export const getShowGenres          = ()                => request('/shows/genres');
export const discoverShows          = (genre, page = 1) => request(`/shows/discover?genre=${genre}&page=${page}`);
export const getShowDetails         = (id)              => request(`/shows/${id}`);
export const getShowRecommendations = (id)              => request(`/shows/${id}/recommendations`);

// Auth
export const register = (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
export const login    = (data) => request('/auth/login',    { method: 'POST', body: JSON.stringify(data) });

// User 
export const getMe           = ()                => request('/users/me');
export const getFavorites    = ()                => request('/users/favorites');
export const addFavorite     = (id)              => request(`/users/favorites/${id}`,  { method: 'POST' });
export const removeFavorite  = (id)              => request(`/users/favorites/${id}`,  { method: 'DELETE' });
export const getWatched      = ()                => request('/users/watched');
export const setWatched      = (id, watched)     => request(`/users/watched/${id}`,    { method: 'PUT', body: JSON.stringify({ watched }) });
export const removeWatched      = (id)              => request(`/users/watched/${id}`,         { method: 'DELETE' });

// User — shows
export const getShowFavorites    = ()              => request('/users/show-favorites');
export const addShowFavorite     = (id)            => request(`/users/show-favorites/${id}`,  { method: 'POST' });
export const removeShowFavorite  = (id)            => request(`/users/show-favorites/${id}`,  { method: 'DELETE' });
export const getShowWatched      = ()              => request('/users/show-watched');
export const setShowWatched      = (id, watched)   => request(`/users/show-watched/${id}`,    { method: 'PUT', body: JSON.stringify({ watched }) });
export const removeShowWatched   = (id)            => request(`/users/show-watched/${id}`,    { method: 'DELETE' });

// TMDB image helpers 
export const posterUrl   = (path, size = 'w342')  => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
export const backdropUrl = (path, size = 'w1280') => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
export const profileUrl  = (path, size = 'w185')  => path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
