import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';
import { getUserRole } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'ClickyTour Task Board',
  description: 'Task management board powered by Supabase',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user ? await getUserRole(user.id) : null;

  return (
    <html lang="en">
      <body>
        {user && (
          <header className="border-b border-cyan-900/40 bg-[#0B2238] px-4 py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 text-sm text-cyan-100">
              <nav className="flex items-center gap-3">
                <Link href="/" className="text-cyan-200 hover:text-cyan-100">
                  🗂️ Board
                </Link>
                {role === 'admin' && (
                  <Link href="/admin/users" className="text-cyan-200 hover:text-cyan-100">
                    👥 Users
                  </Link>
                )}
              </nav>

              <div className="flex items-center gap-3">
                <span>{user.email}</span>
                <LogoutButton />
              </div>
            </div>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
