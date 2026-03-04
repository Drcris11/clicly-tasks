import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getUser, isAdmin, type UserRole } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
};

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase admin credentials.');
  }

  return createSupabaseClient(url, key, { auth: { persistSession: false } });
}

async function inviteUserAction(formData: FormData) {
  'use server';

  if (!(await isAdmin())) {
    redirect('/');
  }

  const email = String(formData.get('email') || '').trim().toLowerCase();
  const displayName = String(formData.get('display_name') || '').trim();

  if (!email) {
    redirect('/admin/users?status=missing-email');
  }

  const adminClient = getServiceClient();
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (error || !data.user?.id) {
    redirect(`/admin/users?status=invite-error&message=${encodeURIComponent(error?.message || 'Could not invite user')}`);
  }

  const { error: profileError } = await adminClient.from('user_profiles').upsert(
    {
      id: data.user.id,
      email,
      role: 'viewer',
      display_name: displayName || null,
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    redirect(`/admin/users?status=profile-error&message=${encodeURIComponent(profileError.message)}`);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?status=invited');
}

async function updateRoleAction(formData: FormData) {
  'use server';

  if (!(await isAdmin())) {
    redirect('/');
  }

  const id = String(formData.get('id') || '');
  const role = String(formData.get('role') || '') as UserRole;

  if (!id || !['admin', 'developer', 'viewer'].includes(role)) {
    redirect('/admin/users?status=invalid-role');
  }

  const supabase = await createClient();
  const { error } = await supabase.from('user_profiles').update({ role }).eq('id', id);

  if (error) {
    redirect(`/admin/users?status=role-error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?status=role-updated');
}

async function resetPasswordAction(formData: FormData) {
  'use server';

  if (!(await isAdmin())) redirect('/');

  const email = String(formData.get('email') || '').trim();
  if (!email) redirect('/admin/users?status=invalid-email');

  const adminClient = getServiceClient();
  const { error } = await adminClient.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (error) {
    redirect(`/admin/users?status=reset-error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?status=reset-sent');
}

async function removeUserAction(formData: FormData) {
  'use server';

  if (!(await isAdmin())) {
    redirect('/');
  }

  const id = String(formData.get('id') || '');

  if (!id) {
    redirect('/admin/users?status=invalid-user');
  }

  const currentUser = await getUser();
  if (currentUser?.id === id) {
    redirect('/admin/users?status=cannot-remove-self');
  }

  const adminClient = getServiceClient();
  const { error } = await adminClient.auth.admin.deleteUser(id);

  if (error) {
    redirect(`/admin/users?status=delete-error&message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/admin/users');
  redirect('/admin/users?status=removed');
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { status?: string; message?: string };
}) {
  if (!(await isAdmin())) {
    redirect('/');
  }

  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from('user_profiles')
    .select('id, email, role, display_name, created_at')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0F2B46] p-4 text-white md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-300">👥 User Management</h1>
          <p className="mt-1 text-sm text-cyan-100/80">Invite users, assign roles, and manage access.</p>
        </div>

        {searchParams?.status && (
          <div className="rounded-lg border border-cyan-800 bg-[#12395b] px-4 py-3 text-sm text-cyan-100">
            Status: <span className="font-semibold text-cyan-300">{searchParams.status}</span>
            {searchParams.message ? <span className="ml-2 text-red-300">{decodeURIComponent(searchParams.message)}</span> : null}
          </div>
        )}

        <section className="rounded-2xl border border-cyan-900/40 bg-[#102f4d] p-5">
          <h2 className="text-lg font-semibold text-cyan-300">Invite New User</h2>
          <form action={inviteUserAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              className="rounded-lg border border-cyan-800 bg-[#0F2B46] px-3 py-2 text-white outline-none ring-cyan-400 focus:ring"
            />
            <input
              name="display_name"
              type="text"
              placeholder="Display name (optional)"
              className="rounded-lg border border-cyan-800 bg-[#0F2B46] px-3 py-2 text-white outline-none ring-cyan-400 focus:ring"
            />
            <button className="rounded-lg bg-[#00B7D7] px-4 py-2 font-semibold text-[#0F2B46]">Invite</button>
          </form>
        </section>

        <section className="rounded-2xl border border-cyan-900/40 bg-[#102f4d] p-5">
          <h2 className="text-lg font-semibold text-cyan-300">All Users</h2>

          {error && <p className="mt-3 text-sm text-red-300">Failed to load users: {error.message}</p>}

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-cyan-200/90">
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Display Name</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(users as UserProfile[] | null)?.map((user) => (
                  <tr key={user.id} className="rounded-lg bg-[#12395b] text-cyan-100">
                    <td className="px-3 py-2">{user.email}</td>
                    <td className="px-3 py-2">{user.display_name || '—'}</td>
                    <td className="px-3 py-2">
                      <form action={updateRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={user.id} />
                        <select
                          name="role"
                          defaultValue={user.role}
                          className="rounded-md border border-cyan-800 bg-[#0F2B46] px-2 py-1 text-white"
                        >
                          <option value="admin">admin</option>
                          <option value="developer">developer</option>
                          <option value="viewer">viewer</option>
                        </select>
                        <button className="rounded-md border border-cyan-700 px-2 py-1 text-cyan-200 hover:bg-cyan-900/30">Save</button>
                      </form>
                    </td>
                    <td className="px-3 py-2">{new Date(user.created_at).toLocaleString()}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <form action={resetPasswordAction}>
                        <input type="hidden" name="email" value={user.email} />
                        <button className="rounded-md border border-amber-500/60 px-2 py-1 text-amber-300 hover:bg-amber-900/30">
                          Reset Password
                        </button>
                      </form>
                      <form action={removeUserAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <button className="rounded-md border border-red-500/60 px-2 py-1 text-red-300 hover:bg-red-900/30">Remove</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
