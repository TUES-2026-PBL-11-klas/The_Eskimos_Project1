'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router       = useRouter();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-sm bg-tmdb-dark rounded-xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Create Account</h1>

        {error && (
          <p className="text-red-400 text-sm mb-4 bg-red-400/10 rounded px-3 py-2">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/60 text-sm mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/10 text-white rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tmdb-accent"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/10 text-white rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tmdb-accent"
            />
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/10 text-white rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-tmdb-accent"
            />
            <p className="text-white/30 text-xs mt-1">Minimum 8 characters</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-tmdb-accent hover:bg-tmdb-accent/80 text-white py-2 rounded font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-white/40 text-sm mt-5 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-tmdb-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
