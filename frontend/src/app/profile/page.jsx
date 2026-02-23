'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

import {
  getFavorites, removeFavorite,
  getWatched, removeWatched,
  getMovieDetails, posterUrl,
} from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

function MovieRow({ tmdbMovieId, onRemove }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieDetails(tmdbMovieId).then(setMovie).catch(() => {});
  }, [tmdbMovieId]);

  if (!movie) return <div className="h-16 bg-white/5 rounded animate-pulse" />;

  const poster = posterUrl(movie.poster_path, 'w92');
  const year   = movie.release_date?.slice(0, 4) ?? '—';

  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
      {poster && (
        <Image src={poster} alt={movie.title} width={46} height={69} className="rounded" />
      )}
      <div className="flex-1">
        <Link href={`/movies/${movie.id}`} className="text-white font-medium hover:text-tmdb-accent">
          {movie.title}
        </Link>
        <p className="text-white/40 text-xs">{year}</p>
      </div>
      <button
        onClick={() => onRemove(movie.id)}
        className="text-white/30 hover:text-red-400 text-sm transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched]     = useState([]);
  const [tab, setTab]             = useState('favorites');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }

    Promise.all([getFavorites(), getWatched()])
      .then(([favs, ws]) => {
        setFavorites(favs);
        setWatched(ws.filter((w) => w.watched));
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleRemoveFav(id) {
    await removeFavorite(id);
    setFavorites((f) => f.filter((x) => x.tmdbMovieId !== id));
  }

  async function handleRemoveWatched(id) {
    await removeWatched(id);
    setWatched((w) => w.filter((x) => x.tmdbMovieId !== id));
  }

  if (authLoading || loading) return <Spinner />;

  const list = tab === 'favorites' ? favorites : watched;
  const onRemove = tab === 'favorites' ? handleRemoveFav : handleRemoveWatched;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{user.name}</h1>
          <p className="text-white/40 text-sm">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-white/50 hover:text-white border border-white/20 hover:border-white/50 px-4 py-2 rounded transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
        {['favorites', 'watched'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-tmdb-accent text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {t} ({t === 'favorites' ? favorites.length : watched.length})
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <p className="text-white/30 text-center py-12">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <MovieRow
              key={item.tmdbMovieId}
              tmdbMovieId={item.tmdbMovieId}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
