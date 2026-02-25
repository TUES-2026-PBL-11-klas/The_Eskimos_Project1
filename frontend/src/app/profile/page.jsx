'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getFavorites, removeFavorite,
  getWatched, removeWatched,
  getShowFavorites, removeShowFavorite,
  getShowWatched, removeShowWatched,
  getMovieDetails, getShowDetails, posterUrl,
} from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

function MediaRow({ id, type, onRemove }) {
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetch = type === 'show' ? getShowDetails : getMovieDetails;
    fetch(id).then(setItem).catch(() => {});
  }, [id, type]);

  if (!item) return <div className="h-16 bg-white/5 rounded animate-pulse" />;

  const poster = posterUrl(item.poster_path, 'w92');
  const title  = item.title ?? item.name;
  const year   = (item.release_date ?? item.first_air_date)?.slice(0, 4) ?? '—';
  const href   = type === 'show' ? `/shows/${item.id}` : `/movies/${item.id}`;

  return (
    <div className="flex items-center gap-4 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
      {poster && (
        <Image src={poster} alt={title} width={46} height={69} className="rounded" />
      )}
      <div className="flex-1">
        <Link href={href} className="text-white font-medium hover:text-tmdb-accent">
          {title}
        </Link>
        <p className="text-white/40 text-xs">{year}</p>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="text-white/30 hover:text-red-400 text-sm transition-colors"
      >
        Remove
      </button>
    </div>
  );
}

const TABS = [
  { key: 'movie-favorites', label: 'Movie Favs' },
  { key: 'movie-watched',   label: 'Movie Watched' },
  { key: 'show-favorites',  label: 'Show Favs' },
  { key: 'show-watched',    label: 'Show Watched' },
];

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [movieFavs, setMovieFavs]       = useState([]);
  const [movieWatched, setMovieWatched] = useState([]);
  const [showFavs, setShowFavs]         = useState([]);
  const [showWatched, setShowWatched]   = useState([]);
  const [tab, setTab]                   = useState('movie-favorites');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }

    Promise.all([getFavorites(), getWatched(), getShowFavorites(), getShowWatched()])
      .then(([mf, mw, sf, sw]) => {
        setMovieFavs(mf);
        setMovieWatched(mw.filter((w) => w.watched));
        setShowFavs(sf);
        setShowWatched(sw.filter((w) => w.watched));
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  async function handleRemoveMovieFav(id)     { await removeFavorite(id);     setMovieFavs((f) => f.filter((x) => x.tmdbMovieId !== id)); }
  async function handleRemoveMovieWatched(id) { await removeWatched(id);      setMovieWatched((w) => w.filter((x) => x.tmdbMovieId !== id)); }
  async function handleRemoveShowFav(id)      { await removeShowFavorite(id); setShowFavs((f) => f.filter((x) => x.tmdbShowId !== id)); }
  async function handleRemoveShowWatched(id)  { await removeShowWatched(id);  setShowWatched((w) => w.filter((x) => x.tmdbShowId !== id)); }

  if (authLoading || loading) return <Spinner />;

  const counts = {
    'movie-favorites': movieFavs.length,
    'movie-watched':   movieWatched.length,
    'show-favorites':  showFavs.length,
    'show-watched':    showWatched.length,
  };

  const { list, type, onRemove } = {
    'movie-favorites': { list: movieFavs,    type: 'movie', onRemove: handleRemoveMovieFav },
    'movie-watched':   { list: movieWatched, type: 'movie', onRemove: handleRemoveMovieWatched },
    'show-favorites':  { list: showFavs,     type: 'show',  onRemove: handleRemoveShowFav },
    'show-watched':    { list: showWatched,  type: 'show',  onRemove: handleRemoveShowWatched },
  }[tab];

  const idKey = type === 'show' ? 'tmdbShowId' : 'tmdbMovieId';

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
      <div className="flex flex-wrap gap-1 mb-6 bg-white/5 rounded-lg p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-tmdb-accent text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <p className="text-white/30 text-center py-12">Nothing here yet.</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <MediaRow
              key={item[idKey]}
              id={item[idKey]}
              type={type}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
