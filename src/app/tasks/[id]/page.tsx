import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTaskById } from '@/lib/data';

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const { task, source } = await getTaskById(params.id);
  if (!task) return notFound();

  const links = [
    { href: task.notion_url, label: 'Notion' },
    { href: task.drive_url, label: 'Drive' },
    { href: task.github_url, label: 'GitHub' },
  ].filter((x) => x.href);

  return (
    <main className="min-h-screen bg-[#0F2B46] text-white p-4 md:p-8">
      <div className="mx-auto max-w-3xl rounded-xl border border-cyan-900/40 bg-[#102f4d] p-6">
        <Link href="/" className="text-cyan-300 text-sm">← Back to board</Link>
        <p className="mt-3 text-cyan-300 text-xs">{task.id}</p>
        <h1 className="text-2xl font-bold mt-1">{task.title}</h1>
        <p className="text-sm text-cyan-100/70 mt-1">Source: {source}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Info label="Status" value={task.status} />
          <Info label="Agent" value={task.agent} />
          <Info label="Priority" value={task.priority} />
          <Info label="Project" value={task.project} />
          <Info label="Created" value={task.created_at} />
          <Info label="Updated" value={task.updated_at} />
        </div>

        <section className="mt-6">
          <h2 className="text-cyan-300 font-semibold">Description</h2>
          <p className="mt-2 text-cyan-50/90 whitespace-pre-wrap">{task.description || '—'}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-cyan-300 font-semibold">Notes</h2>
          <p className="mt-2 text-cyan-50/90 whitespace-pre-wrap">{task.notes || '—'}</p>
        </section>

        {!!links.length && (
          <section className="mt-6">
            <h2 className="text-cyan-300 font-semibold">Links</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {links.map((link) => (
                <a key={link.label} href={link.href!} target="_blank" rel="noreferrer" className="rounded bg-cyan-500 px-3 py-2 text-sm font-semibold text-[#0F2B46]">
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded bg-[#13395D] p-3 border border-cyan-900/40">
      <p className="text-xs text-cyan-200/80">{label}</p>
      <p className="mt-1 text-sm">{value || '—'}</p>
    </div>
  );
}
