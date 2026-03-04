import fs from 'node:fs';
import path from 'node:path';
import { normalizeTask } from './normalize';
import { Task } from './types';
import { createClient } from '@/lib/supabase/server';

function readMockTasks(): Task[] {
  const file = path.join(process.cwd(), 'data', 'tasks.mock.json');
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  return (raw.tasks || []).map(normalizeTask);
}

export async function getTasks(): Promise<{ tasks: Task[]; source: 'supabase' | 'mock' }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { tasks: readMockTasks(), source: 'mock' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from('tasks').select('*').order('updated_at', { ascending: false });

  if (error || !data) {
    return { tasks: readMockTasks(), source: 'mock' };
  }

  return { tasks: data.map(normalizeTask), source: 'supabase' };
}

export async function getTaskById(id: string): Promise<{ task: Task | null; source: 'supabase' | 'mock' }> {
  const { tasks, source } = await getTasks();
  return { task: tasks.find((t) => t.id === id) || null, source };
}
