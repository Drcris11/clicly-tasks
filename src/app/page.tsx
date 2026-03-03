export const dynamic = 'force-dynamic';
import { getTasks } from '@/lib/data';
import { normalizeStatus, STATUS_ORDER } from '@/lib/normalize';
import { TaskCard } from '@/components/TaskCard';

export default async function Home({ searchParams }: { searchParams?: { agent?: string; priority?: string; project?: string } }) {
  const { tasks, source } = await getTasks();

  const agentFilter = searchParams?.agent || '';
  const priorityFilter = searchParams?.priority || '';
  const projectFilter = searchParams?.project || '';

  const filtered = tasks.filter((t) => {
    if (agentFilter && String(t.agent || '') !== agentFilter) return false;
    if (priorityFilter && String(t.priority || '') !== priorityFilter) return false;
    if (projectFilter && String(t.project || '') !== projectFilter) return false;
    return true;
  });

  const agents = Array.from(new Set(tasks.map((t) => t.agent).filter(Boolean) as string[]));
  const priorities = Array.from(new Set(tasks.map((t) => t.priority).filter(Boolean) as string[]));
  const projects = Array.from(new Set(tasks.map((t) => t.project).filter(Boolean) as string[]));

  return (
    <main className="min-h-screen bg-[#0F2B46] text-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300">Task Board</h1>
        <p className="mt-1 text-sm text-cyan-100/80">Source: {source === 'supabase' ? 'Supabase' : 'Mock data (configure env to connect Supabase)'}</p>

        <form className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <select name="agent" defaultValue={agentFilter} onChange={(e) => (e.target.form as HTMLFormElement)?.submit()} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
            <option value="">All agents</option>
            {agents.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select name="priority" defaultValue={priorityFilter} onChange={(e) => (e.target.form as HTMLFormElement)?.submit()} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
            <option value="">All priorities</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select name="project" defaultValue={projectFilter} onChange={(e) => (e.target.form as HTMLFormElement)?.submit()} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
            <option value="">All projects</option>
            {projects.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <a href="/" className="md:col-span-3 text-center rounded bg-cyan-900/40 text-cyan-300 text-sm py-2 hover:bg-cyan-900/60">✕ Clear filters</a>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUS_ORDER.map((status) => {
            const items = filtered.filter((t) => normalizeStatus(t.status) === status);
            return (
              <section key={status} className="rounded-xl bg-[#102f4d] border border-cyan-900/40 p-3">
                <h2 className="text-cyan-300 font-semibold">{status} <span className="text-cyan-100/70 text-sm">({items.length})</span></h2>
                <div className="mt-3 space-y-3">
                  {items.length ? items.map((task) => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-cyan-100/60">No tasks</p>}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
