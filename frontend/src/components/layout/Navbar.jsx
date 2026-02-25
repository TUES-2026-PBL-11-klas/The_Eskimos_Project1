'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-tmdb-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="text-white font-extrabold text-lg shrink-0 tracking-tight">
          🎬 MovieExplorer
        </Link>

        {/* Nav links */}
        <div className="hidden sm:flex items-center gap-5 shrink-0">
          <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
            Movies
          </Link>
          <Link href="/shows" className="text-white/70 hover:text-white text-sm transition-colors">
            TV Shows
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-tmdb-darker font-bold text-sm hover:opacity-80 transition-opacity"
              title={user.name}
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-white/80 hover:text-white text-sm transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-tmdb-accent text-white text-sm px-3 py-1.5 rounded hover:bg-tmdb-accent/80 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
