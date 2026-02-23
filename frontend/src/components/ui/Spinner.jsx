export default function Spinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-12 ${className}`}>
      <div className="w-10 h-10 border-4 border-tmdb-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
