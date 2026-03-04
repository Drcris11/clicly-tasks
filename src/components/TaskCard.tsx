import Link from 'next/link';
import { Task } from '@/lib/types';
import { normalizeStatus } from '@/lib/normalize';

const AGENT_BADGE_STYLES: Record<string, string> = {
  DOC: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  ARCHITECT: 'bg-violet-500/20 text-violet-200 border-violet-400/40',
  CLICKY: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
  CLAUDE: 'bg-orange-500/20 text-orange-200 border-orange-400/40',
  CODEX: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/40',
};

const STATUS_BADGE_STYLES: Record<string, string> = {
  Todo: 'bg-slate-500/20 text-slate-200 border-slate-400/40',
  'In Progress': 'bg-sky-500/20 text-sky-200 border-sky-400/40',
  'Pending Approval': 'bg-purple-500/20 text-purple-200 border-purple-400/40',
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  Blocked: 'bg-red-500/20 text-red-200 border-red-400/40',
  Testing: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
  'On Hold': 'bg-[#9CA3AF]/20 text-[#E5E7EB] border-[#9CA3AF]/40',
  Cancelled: 'bg-[#78716C]/20 text-[#D6D3D1] border-[#78716C]/40',
  Done: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
};

const STATUS_EMOJI: Record<string, string> = {
  Todo: '📥',
  'In Progress': '🔄',
  'Pending Approval': '⏳',
  Pending: '⏳',
  Blocked: '🚫',
  Testing: '🧪',
  'On Hold': '💤',
  Cancelled: '🗑️',
  Done: '✅',
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
  const status = normalizeStatus(task.status);

  return (
    <Link
      href={`/tasks/${task.id}`}
      className="block rounded-lg border border-cyan-900/40 bg-[#13395D] p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-300/60 hover:shadow-lg hover:shadow-cyan-900/30"
    >
      <p className="text-xs text-cyan-300">{task.id}</p>
      <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-white">{task.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusBadge(status)}`}>
          {STATUS_EMOJI[status]} {status}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${agentBadge(task.agent)}`}>{agent}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-cyan-100/85">
          <span className={`h-2.5 w-2.5 rounded-full ${priorityDot(priority)}`} />
          {task.priority || '—'}
        </span>
      </div>
    </Link>
  );
}

function statusBadge(status: string) {
  return STATUS_BADGE_STYLES[status] || 'bg-slate-500/20 text-slate-200 border-slate-400/40';
}

function agentBadge(agent?: string | null) {
  const key = String(agent || '').toUpperCase();
  return AGENT_BADGE_STYLES[key] || 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30';
}

function priorityDot(priority?: string | null) {
  const key = String(priority || '').toLowerCase();
  return PRIORITY_DOT_STYLES[key] || 'bg-slate-300';
}
