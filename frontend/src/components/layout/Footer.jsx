export default function Footer() {
  return (
    <footer className="bg-tmdb-dark mt-16 py-8 text-center text-white/40 text-sm">
      <p>Movie data provided by <span className="text-tmdb-accent">TMDB</span></p>
      <p className="mt-1">© {new Date().getFullYear()} MovieExplorer</p>
    </footer>
  );
}
