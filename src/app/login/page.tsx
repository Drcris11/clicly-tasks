'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0F2B46] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-cyan-900/50 bg-[#12395b] p-6 shadow-xl">
        <h1 className="text-3xl font-bold tracking-wide text-cyan-300">ClickyTour</h1>
        <p className="mt-2 text-sm text-cyan-100/80">Sign in to access the task board.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-cyan-100">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-cyan-800 bg-[#0F2B46] px-3 py-2 text-white outline-none ring-cyan-400 focus:ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-cyan-100">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-cyan-800 bg-[#0F2B46] px-3 py-2 text-white outline-none ring-cyan-400 focus:ring"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#00B7D7] px-4 py-2 font-semibold text-[#0F2B46] disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
