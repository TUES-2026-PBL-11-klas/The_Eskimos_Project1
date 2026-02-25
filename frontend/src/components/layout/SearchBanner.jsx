'use client';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';

export default function SearchBanner() {
  const router = useRouter();

  function handleSearch(q) {
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="w-full">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
