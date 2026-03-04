'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-md border border-cyan-700 px-3 py-1.5 text-sm text-cyan-100 hover:bg-cyan-900/40"
    >
      Logout
    </button>
  );
}
