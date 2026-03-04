import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { getTaskById } from '@/lib/data';

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

const PRIORITY_BADGE_STYLES: Record<string, string> = {
  low: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
  medium: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
  high: 'bg-red-500/20 text-red-200 border-red-400/40',
  urgent: 'bg-rose-500/20 text-rose-100 border-rose-400/60',
};

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { task } = await getTaskById(id);
  if (!task) return notFound();

  const links = [
    { href: task.notion_url, label: 'Notion' },
    { href: task.drive_url, label: 'GDrive' },
    { href: task.github_url, label: 'GitHub' },
  ].filter((x) => x.href);

  const agent = String(task.agent || 'UNASSIGNED');
  const status = String(task.status || 'Todo');
  const priority = String(task.priority || '—');

  return (
    <main className="min-h-screen bg-[#0F2B46] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-cyan-900/40 bg-[#102f4d] p-6">
        <Link href="/" className="inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200">
          ← Board
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className={agentBadge(task.agent)}>ID {task.id}</Badge>
          <Badge className={statusBadge(status)}>{STATUS_EMOJI[status] || '📋'} {status}</Badge>
          <Badge className={priorityBadge(priority)}>{priority}</Badge>
          <Badge className={agentBadge(task.agent)}>{agent}</Badge>
        </div>

        <h1 className="mt-4 text-2xl font-bold md:text-3xl">{task.title}</h1>

        <section className="mt-8">
          <h2 className="font-semibold text-cyan-300">Description</h2>
          <div className="prose prose-invert prose-sm mt-3 max-w-none rounded-lg border border-cyan-900/40 bg-[#13395D] p-4 leading-6">
            {task.description ? <ReactMarkdown>{task.description}</ReactMarkdown> : <p className="text-cyan-50/70">—</p>}
          </div>
        </section>

        {!!task.notes && (
          <section className="mt-6 rounded-lg border border-yellow-300/30 bg-yellow-500/15 p-4">
            <h2 className="font-semibold text-yellow-200">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-yellow-100">{task.notes}</p>
          </section>
        )}

        {!!links.length && (
          <section className="mt-6">
            <h2 className="font-semibold text-cyan-300">Links</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href!}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border border-cyan-300/30 bg-cyan-400/15 px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/25"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-3 text-sm text-cyan-100/80 md:grid-cols-2">
          <Info label="Updated" value={formatDate(task.updated_at)} />
          <Info label="Created" value={formatDate(task.created_at)} />
        </div>
      </div>
    </main>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${className || ''}`}>{children}</span>;
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded border border-cyan-900/40 bg-[#13395D] p-3">
      <p className="text-xs text-cyan-300">{label}</p>
      <p className="mt-1">{value || '—'}</p>
    </div>
  );
}

function agentBadge(agent?: string | null) {
  const key = String(agent || '').toUpperCase();
  return AGENT_BADGE_STYLES[key] || 'bg-cyan-500/20 text-cyan-100 border-cyan-400/30';
}

function statusBadge(status?: string | null) {
  return STATUS_BADGE_STYLES[String(status || '')] || 'bg-slate-500/20 text-slate-200 border-slate-400/40';
}

function priorityBadge(priority?: string | null) {
  const key = String(priority || '').toLowerCase();
  return PRIORITY_BADGE_STYLES[key] || 'bg-slate-500/20 text-slate-200 border-slate-400/40';
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}
