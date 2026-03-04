import fs from 'node:fs';
import path from 'node:path';
import { normalizeTask } from './normalize';
import { Task } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function readMockTasks(): Task[] {
  const file = path.join(process.cwd(), 'data', 'tasks.mock.json');
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return (raw.tasks || []).map(normalizeTask);
}

export async function getTasks(): Promise<{ tasks: Task[]; source: 'supabase' | 'mock' }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { tasks: readMockTasks(), source: 'mock' };
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/tasks?select=*&order=seq.asc.nullslast,updated_at.desc`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[data.ts] Supabase fetch error:', res.status, await res.text());
      return { tasks: readMockTasks(), source: 'mock' };
    }

    const data = await res.json();
    return { tasks: (data || []).map(normalizeTask), source: 'supabase' };
  } catch (e) {
    console.error('[data.ts] Supabase exception:', e);
    return { tasks: readMockTasks(), source: 'mock' };
  }
}

export async function getTaskById(id: string): Promise<{ task: Task | null; source: 'supabase' | 'mock' }> {
  const { tasks, source } = await getTasks();
  return { task: tasks.find((t) => t.id === id) || null, source };
}
