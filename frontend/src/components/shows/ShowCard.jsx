import Link from 'next/link';
import Image from 'next/image';
import { posterUrl } from '@/lib/api';

function RatingRing({ score }) {
  const pct = Math.round(score * 10);
  const color = pct >= 70 ? '#21d07a' : pct >= 40 ? '#d2d531' : '#db2360';

  return (
    <div
      className="rating-ring text-xs font-bold text-white"
      style={{
        background: `conic-gradient(${color} ${pct * 3.6}deg, #204529 0deg)`,
      }}
    >
      <span className="bg-tmdb-darker rounded-full w-9 h-9 flex items-center justify-center">
        {pct}<sup className="text-[8px]">%</sup>
      </span>
    </div>
  );
}

export default function ShowCard({ show, className = '' }) {
  const poster = posterUrl(show.poster_path);
  const year   = show.first_air_date?.slice(0, 4) ?? '—';

  return (
    <Link
      href={`/shows/${show.id}`}
      className={`group flex flex-col bg-tmdb-dark rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200 ${className}`}
    >
      <div className="relative aspect-[2/3] bg-tmdb-darker">
        {poster ? (
          <Image
            src={poster}
            alt={show.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-sm">No Image</div>
        )}
      </div>

      <div className="p-3 pt-5 relative">
        <div className="absolute -top-5 left-3">
          <RatingRing score={show.vote_average ?? 0} />
        </div>
        <p className="font-semibold text-white text-sm leading-tight line-clamp-2 mt-1">
          {show.name}
        </p>
        <p className="text-white/50 text-xs mt-0.5">{year}</p>
      </div>
    </Link>
  );
}
