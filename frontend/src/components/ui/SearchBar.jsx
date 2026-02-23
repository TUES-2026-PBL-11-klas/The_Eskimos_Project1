'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search for a movie…' }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-white/10 text-white placeholder-white/40 rounded-l px-4 py-2 text-sm outline-none focus:bg-white/20 transition-colors"
      />
      <button
        type="submit"
        className="bg-tmdb-accent hover:bg-tmdb-accent/80 text-white px-4 py-2 rounded-r text-sm font-medium transition-colors"
      >
        Search
      </button>
    </form>
  );
}
