'use client';
import { useState, useEffect } from 'react';
import { getPopularShows, getTrendingShows, getShowGenres, discoverShows } from '@/lib/api';
import ShowCard from '@/components/shows/ShowCard';
import Spinner from '@/components/ui/Spinner';

export default function ShowsPage() {
  const [trending, setTrending]   = useState([]);
  const [popular, setPopular]     = useState([]);
  const [genres, setGenres]       = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [genreShows, setGenreShows]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      getTrendingShows('week'),
      getPopularShows(),
      getShowGenres(),
    ]).then(([t, p, g]) => {
      setTrending(t.results ?? []);
      setPopular(p.results ?? []);
      setGenres(g.genres ?? []);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeGenre) { setGenreShows([]); return; }
    discoverShows(activeGenre).then((d) => setGenreShows(d.results ?? []));
  }, [activeGenre]);

  if (loading) return <Spinner />;

  const displayed = activeGenre ? genreShows : popular;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

      {/* Trending strip */}
      {trending.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Trending This Week</h2>
          <div className="scroll-strip">
            {trending.map((s) => (
              <ShowCard key={s.id} show={s} className="w-36 shrink-0" />
            ))}
          </div>
        </section>
      )}

      {/* Genre filter */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {activeGenre
              ? genres.find((g) => g.id === activeGenre)?.name
              : 'Popular Shows'}
          </h2>
          {activeGenre && (
            <button
              onClick={() => setActiveGenre(null)}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              ✕ Clear filter
            </button>
          )}
        </div>

        {/* Genre pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(activeGenre === g.id ? null : g.id)}
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

        {/* Grid */}
        {displayed.length === 0 ? (
          <p className="text-white/40 text-center py-12">No shows found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayed.map((s) => (
              <ShowCard key={s.id} show={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
