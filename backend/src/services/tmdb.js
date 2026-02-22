const axios = require('axios');

const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: 'en-US',
  },
});

// Popular movies (paginated)
async function getPopular(page = 1) {
  const { data } = await tmdb.get('/movie/popular', { params: { page } });
  return data;
}

// Trending movies (day or week)
async function getTrending(timeWindow = 'week') {
  const { data } = await tmdb.get(`/trending/movie/${timeWindow}`);
  return data;
}

// Search movies by keyword
async function searchMovies(query, page = 1) {
  const { data } = await tmdb.get('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

// All available genres
async function getGenres() {
  const { data } = await tmdb.get('/genre/movie/list');
  return data;
}

// Discover movies filtered by genre id(s)
async function discoverByGenre(genreIds, page = 1) {
  const { data } = await tmdb.get('/discover/movie', {
    params: {
      with_genres: Array.isArray(genreIds) ? genreIds.join(',') : genreIds,
      sort_by: 'popularity.desc',
      page,
    },
  });
  return data;
}

// Single movie details
async function getMovieDetails(movieId) {
  const { data } = await tmdb.get(`/movie/${movieId}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
}

// Recommendations for a movie
async function getRecommendations(movieId, page = 1) {
  const { data } = await tmdb.get(`/movie/${movieId}/recommendations`, {
    params: { page },
  });
  return data;
}

module.exports = {
  getPopular,
  getTrending,
  searchMovies,
  getGenres,
  discoverByGenre,
  getMovieDetails,
  getRecommendations,
};
