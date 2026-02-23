'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchMovies } from '@/lib/api';
import MovieGrid from '@/components/movies/MovieGrid';
import Spinner from '@/components/ui/Spinner';

function SearchResults() {
  const params = useSearchParams();
  const query  = params.get('q') ?? '';

  const [results, setResults]  = useState([]);
  const [page, setPage]        = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading]  = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    searchMovies(query, page)
      .then((d) => {
        setResults(d.results ?? []);
        setTotal(Math.min(d.total_pages ?? 1, 500));
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  useEffect(() => { setPage(1); }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">
        Search results for <span className="text-tmdb-accent">"{query}"</span>
      </h1>
      {!loading && (
        <p className="text-white/40 text-sm mb-6">{results.length} results on this page</p>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          <MovieGrid movies={results} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
              >
                ← Prev
              </button>
              <span className="text-white/60 text-sm">{page} / {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20 text-white text-sm"
              >
                Next →
              </button>
            </div>
          )}
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
