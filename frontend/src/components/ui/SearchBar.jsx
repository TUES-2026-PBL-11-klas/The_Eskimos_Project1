'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search for movies and TV shows…' }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white text-gray-900 placeholder-gray-400 rounded-none px-4 py-2.5 text-sm outline-none focus:ring-0 border-b-2 border-transparent focus:border-tmdb-accent transition-colors"
      />
    </form>
  );
}
