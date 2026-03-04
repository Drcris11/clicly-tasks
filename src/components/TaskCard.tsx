import Link from 'next/link';
import { Task } from '@/lib/types';

const AGENT_BADGE_STYLES: Record<string, string> = {
  DOC: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  ARCHITECT: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
  CLICKY: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  CLAUDE: 'bg-orange-500/20 text-orange-200 border-orange-400/40',
  CODEX: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40',
};

const PRIORITY_DOT_STYLES: Record<string, string> = {
  low: 'bg-emerald-300',
  medium: 'bg-amber-300',
  high: 'bg-red-300',
  urgent: 'bg-rose-300',
};

export function TaskCard({ task }: { task: Task }) {
  const agent = String(task.agent || 'UNASSIGNED');
  const priority = String(task.priority || '').toLowerCase();

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-lg border border-cyan-900/40 bg-[#13395D] p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-300/60 hover:shadow-lg hover:shadow-cyan-900/30"
    >
      <p className="text-xs text-cyan-300">{task.id}</p>
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{task.title}</h3>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${agentBadge(task.agent)}`}>{agent}</span>
        <span className="inline-flex items-center gap-1.5 text-xs text-cyan-100/85">
          <span className={`h-2.5 w-2.5 rounded-full ${priorityDot(priority)}`} />
          {task.priority || '—'}
        </span>
      </div>
    </Link>
  );
}

function agentBadge(agent?: string | null) {
  const key = String(agent || '').toUpperCase();
  return AGENT_BADGE_STYLES[key] || 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30';
}

function priorityDot(priority?: string | null) {
  const key = String(priority || '').toLowerCase();
  return PRIORITY_DOT_STYLES[key] || 'bg-slate-300';
}
