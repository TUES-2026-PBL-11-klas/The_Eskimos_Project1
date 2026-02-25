'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  getMovieDetails, getRecommendations,
  getFavorites, addFavorite, removeFavorite,
  getWatched, setWatched,
  posterUrl, backdropUrl, profileUrl,
} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import MovieCard from '@/components/movies/MovieCard';
import Spinner from '@/components/ui/Spinner';

export default function MoviePage({ params }) {
  const { id }        = params;
  const { user }      = useAuth();

  const [movie, setMovie]         = useState(null);
  const [recs, setRecs]           = useState([]);
  const [isFav, setIsFav]         = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getMovieDetails(id),
      getRecommendations(id),
    ]).then(([movieData, recsData]) => {
      setMovie(movieData);
      setRecs(recsData.results?.slice(0, 10) ?? []);
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    getFavorites().then((favs) => setIsFav(favs.some((f) => f.tmdbMovieId === Number(id))));
    getWatched().then((ws)   => setIsWatched(ws.some((w) => w.tmdbMovieId === Number(id) && w.watched)));
  }, [user, id]);

  async function toggleFavorite() {
    if (isFav) { await removeFavorite(id); setIsFav(false); }
    else        { await addFavorite(id);    setIsFav(true); }
  }

  async function toggleWatched() {
    await setWatched(id, !isWatched);
    setIsWatched((w) => !w);
  }

  if (loading) return <Spinner />;
  if (!movie)  return <p className="text-white/60 text-center py-20">Movie not found.</p>;

  const backdrop = backdropUrl(movie.backdrop_path);
  const poster   = posterUrl(movie.poster_path, 'w342');
  const year     = movie.release_date?.slice(0, 4) ?? '—';
  const runtime  = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const score    = Math.round((movie.vote_average ?? 0) * 10);
  const cast     = movie.credits?.cast?.slice(0, 12) ?? [];

  const scoreColor =
    score >= 70 ? 'text-tmdb-green' :
    score >= 40 ? 'text-yellow-400' :
    'text-red-400';

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[420px] w-full">
        {backdrop && (
          <Image src={backdrop} alt={movie.title} fill className="object-cover opacity-30" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/60 to-transparent" />

        {/* Content over backdrop */}
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-end pb-8 gap-8">
          {poster && (
            <div className="hidden sm:block shrink-0">
              <Image
                src={poster}
                alt={movie.title}
                width={180}
                height={270}
                className="rounded-lg shadow-2xl"
              />
            </div>
          )}

          <div className="text-white">
            <h1 className="text-3xl font-bold">
              {movie.title}{' '}
              <span className="font-normal text-white/60">({year})</span>
            </h1>

            <div className="flex flex-wrap gap-2 mt-2 text-sm text-white/60">
              {runtime && <span>{runtime}</span>}
              {runtime && movie.genres?.length > 0 && <span>·</span>}
              {movie.genres?.map((g, i) => (
                <span key={g.id}>
                  {g.name}{i < movie.genres.length - 1 ? ',' : ''}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className={`text-2xl font-bold ${scoreColor}`}>{score}%</span>
              <span className="text-white/50 text-sm">User Score</span>
            </div>

            {user && (
              <div className="flex gap-3 mt-5">
                <button
                  onClick={toggleFavorite}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isFav
                      ? 'bg-tmdb-accent text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isFav ? '♥ Favorited' : '♡ Favorite'}
                </button>
                <button
                  onClick={toggleWatched}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    isWatched
                      ? 'bg-tmdb-green text-tmdb-darker'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {isWatched ? '✓ Watched' : 'Mark Watched'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* Overview */}
        <section>
          {movie.tagline && (
            <p className="text-white/50 italic mb-3">"{movie.tagline}"</p>
          )}
          <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
          <p className="text-white/70 leading-relaxed max-w-3xl">
            {movie.overview || 'No overview available.'}
          </p>
        </section>

        {/* Cast */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((person) => {
                const photo = profileUrl(person.profile_path);
                return (
                  <div key={person.id} className="bg-white/5 rounded-lg overflow-hidden">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={person.name}
                        width={185}
                        height={278}
                        className="w-full object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-white/10 flex items-center justify-center text-white/30 text-4xl">
                        ?
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-white text-sm font-medium leading-tight">{person.name}</p>
                      <p className="text-white/50 text-xs mt-0.5 leading-tight">{person.character}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Recommendations</h2>
            <div className="scroll-strip">
              {recs.map((m) => (
                <MovieCard key={m.id} movie={m} className="w-36 shrink-0" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
