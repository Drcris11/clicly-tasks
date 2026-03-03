import Link from 'next/link';
import { Task } from '@/lib/types';

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`} className="block rounded-lg border border-cyan-900/40 bg-[#13395D] p-4 hover:border-cyan-400/60">
      <p className="text-xs text-cyan-300">{task.id}</p>
      <h3 className="mt-1 text-sm font-semibold text-white">{task.title}</h3>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-cyan-100/80">
        <span className="rounded bg-[#0F2B46] px-2 py-1">{task.agent || 'UNASSIGNED'}</span>
        <span className="rounded bg-[#0F2B46] px-2 py-1">{task.priority || '—'}</span>
      </div>
    </Link>
  );
}
