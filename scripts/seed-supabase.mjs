import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

const file = path.join(process.cwd(), 'data', 'tasks.mock.json');
const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
const tasks = (raw.tasks || []).map((t) => ({
  id: t.id,
  title: t.title,
  description: t.description ?? null,
  status: t.status ?? 'Todo',
  agent: t.agent ?? null,
  priority: t.priority ?? null,
  project: t.project ?? null,
  notes: t.notes ?? null,
  notion_url: t.notion_url ?? t.notionUrl ?? null,
  drive_url: t.drive_url ?? t.driveUrl ?? null,
  github_url: t.github_url ?? t.githubUrl ?? null,
  created_at: t.created_at ?? t.createdAt ?? null,
  updated_at: t.updated_at ?? t.updatedAt ?? null,
}));

const { error } = await supabase.from('tasks').upsert(tasks, { onConflict: 'id' });
if (error) {
  console.error(error);
  process.exit(1);
}

console.log(`Seeded ${tasks.length} tasks.`);
