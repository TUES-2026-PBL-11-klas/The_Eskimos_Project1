'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMovies, searchShows } from '@/lib/api';
import MovieGrid from '@/components/movies/MovieGrid';
import ShowCard from '@/components/shows/ShowCard';
import Spinner from '@/components/ui/Spinner';

const TABS = ['Movies', 'TV Shows'];

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
      >
        ← Prev
      </button>
      <span className="text-white/60 text-sm">{page} / {totalPages}</span>
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
      >
        Next →
      </button>
    </div>
  );
}

function SearchResults() {
  const params = useSearchParams();
  const query  = params.get('q') ?? '';

  const [tab, setTab]              = useState('Movies');
  const [movieResults, setMovies]  = useState([]);
  const [showResults,  setShows]   = useState([]);
  const [moviePages,   setMPages]  = useState(1);
  const [showPages,    setSPages]  = useState(1);
  const [moviePage,    setMPage]   = useState(1);
  const [showPage,     setSPage]   = useState(1);
  const [loading, setLoading]      = useState(false);

  // Reset pages when query changes
  useEffect(() => { setMPage(1); setSPage(1); }, [query]);

  // Fetch movies
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchMovies(query, moviePage)
      .then((d) => {
        setMovies(d.results ?? []);
        setMPages(Math.min(d.total_pages ?? 1, 500));
      })
      .finally(() => setLoading(false));
  }, [query, moviePage]);

  // Fetch shows
  useEffect(() => {
    if (!query) return;
    searchShows(query, showPage)
      .then((d) => {
        setShows(d.results ?? []);
        setSPages(Math.min(d.total_pages ?? 1, 500));
      });
  }, [query, showPage]);

  const results    = tab === 'Movies' ? movieResults : showResults;
  const totalPages = tab === 'Movies' ? moviePages   : showPages;
  const page       = tab === 'Movies' ? moviePage    : showPage;
  const setPage    = tab === 'Movies' ? setMPage      : setSPage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-4">
        Results for <span className="text-tmdb-accent">"{query}"</span>
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-tmdb-accent text-white'
                : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && tab === 'Movies' ? (
        <Spinner />
      ) : (
        <>
          {results.length === 0 ? (
            <p className="text-white/40 text-sm">No results found.</p>
          ) : tab === 'Movies' ? (
            <MovieGrid movies={movieResults} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {showResults.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchResults />
    </Suspense>
  );
}
