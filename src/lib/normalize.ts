import { Task, TaskStatus } from './types';

export const STATUS_ORDER: TaskStatus[] = ['Todo', 'In Progress', 'Pending Approval', 'Pending', 'Blocked', 'Testing', 'Done'];

export function normalizeStatus(status?: string | null): TaskStatus {
  const s = String(status || '').toLowerCase();
  if (s.includes('progress') || s.includes('doing') || s.includes('active')) return 'In Progress';
  if (s.includes('pending approval') || (s.includes('pending') && s.includes('approval'))) return 'Pending Approval';
  if (s.includes('pending') || s.includes('review')) return 'Pending';
  if (s.includes('approval')) return 'Pending Approval';
  if (s.includes('on hold')) return 'On Hold';
  if (s.includes('cancelled') || s.includes('canceled')) return 'Cancelled';
  if (s.includes('blocked') || s.includes('stuck')) return 'Blocked';
  if (s.includes('testing') || s.includes('qa') || s.includes('test')) return 'Testing';
  if (s.includes('done') || s.includes('complete') || s.includes('closed')) return 'Done';
  return 'Todo';
}

export function normalizeTask(raw: any): Task {
  return {
    id: String(raw.id ?? ''),
    title: raw.title,
    description: raw.description ?? null,
    status: normalizeStatus(raw.status),
    agent: raw.agent ?? null,
    priority: raw.priority ?? null,
    project: raw.project ?? null,
    notes: raw.notes ?? null,
    original_request: raw.original_request ?? raw.originalRequest ?? null,
    brief: raw.brief ?? null,
    my_analysis: raw.my_analysis ?? raw.myAnalysis ?? null,
    notion_url: raw.notion_url ?? raw.notionUrl ?? null,
    drive_url: raw.drive_url ?? raw.driveUrl ?? null,
    github_url: raw.github_url ?? raw.githubUrl ?? null,
    created_at: raw.created_at ?? raw.createdAt ?? null,
    updated_at: raw.updated_at ?? raw.updatedAt ?? null,
  };
}
