import type { Metadata } from 'next';
import './globals.css';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata: Metadata = {
  title: 'ClickyTour Task Board',
  description: 'Task management board powered by Supabase',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        {user && (
          <header className="bg-[#0B2238] border-b border-cyan-900/40 px-4 py-3">
            <div className="mx-auto max-w-7xl flex items-center justify-end gap-3 text-sm text-cyan-100">
              <span>{user.email}</span>
              <LogoutButton />
            </div>
          </header>
        )}
        {children}
      </body>
    </html>
  );
}
