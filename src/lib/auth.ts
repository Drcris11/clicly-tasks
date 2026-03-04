import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'developer' | 'viewer';

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getUserRole(userId?: string | null): Promise<UserRole | null> {
  const supabase = await createClient();
  const user = userId ? { id: userId } : await getUser();

  if (!user?.id) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: UserRole }>();

  if (error) return null;
  return data?.role ?? null;
}

export async function isAdmin(userId?: string | null): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}
