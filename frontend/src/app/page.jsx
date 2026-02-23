'use client';
import { useState, useEffect } from 'react';
import { getPopular, getTrending, getGenres, discoverMovies } from '@/lib/api';
import MovieGrid from '@/components/movies/MovieGrid';
import MovieCard from '@/components/movies/MovieCard';
import Spinner from '@/components/ui/Spinner';

export default function HomePage() {
  const [trending, setTrending]   = useState([]);
  const [popular, setPopular]     = useState([]);
  const [genres, setGenres]       = useState([]);
  const [activeGenre, setGenre]   = useState(null);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotal]    = useState(1);
  const [loading, setLoading]     = useState(true);

  // Fetch trending once
  useEffect(() => {
    getTrending('week').then((d) => setTrending(d.results ?? []));
    getGenres().then((d) => setGenres(d.genres ?? []));
  }, []);

  // Fetch popular / discover whenever genre or page changes
  useEffect(() => {
    setLoading(true);
    const fetch = activeGenre
      ? discoverMovies(activeGenre, page)
      : getPopular(page);

    fetch
      .then((d) => {
        setPopular(d.results ?? []);
        setTotal(Math.min(d.total_pages ?? 1, 500));
      })
      .finally(() => setLoading(false));
  }, [activeGenre, page]);

  function selectGenre(id) {
    setGenre(id === activeGenre ? null : id);
    setPage(1);
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-tmdb-darker to-tmdb-dark py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Welcome.</h1>
          <p className="text-lg text-white/70">
            Millions of movies to discover. Explore now.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Trending */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Trending This Week</h2>
          {trending.length === 0 ? (
            <Spinner />
          ) : (
            <div className="scroll-strip">
              {trending.map((m) => (
                <MovieCard key={m.id} movie={m} className="w-36 shrink-0" />
              ))}
            </div>
          )}
        </section>

        {/* Genre filter */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Popular Movies</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => selectGenre(g.id)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeGenre === g.id
                    ? 'bg-tmdb-accent text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {loading ? <Spinner /> : <MovieGrid movies={popular} />}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
              >
                ← Prev
              </button>
              <span className="text-white/60 text-sm">
                {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
