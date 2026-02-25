import MovieCard from './MovieCard';

export default function MovieGrid({ movies = [] }) {
  if (!movies.length) {
    return <p className="text-white/40 text-center py-12">No movies found.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  );
}
