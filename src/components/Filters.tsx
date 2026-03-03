'use client';
import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersProps {
  agents: string[];
  priorities: string[];
  projects: string[];
}

export function Filters({ agents, priorities, projects }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
      <select defaultValue={searchParams.get('agent') || ''} onChange={(e) => update('agent', e.target.value)} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
        <option value="">All agents</option>
        {agents.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <select defaultValue={searchParams.get('priority') || ''} onChange={(e) => update('priority', e.target.value)} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
        <option value="">All priorities</option>
        {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      <select defaultValue={searchParams.get('project') || ''} onChange={(e) => update('project', e.target.value)} className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm">
        <option value="">All projects</option>
        {projects.map((p) => <option key={p} value={p}>{p}</option>)}
      </select>
      {(searchParams.get('agent') || searchParams.get('priority') || searchParams.get('project')) && (
        <a href="/" className="md:col-span-3 text-center rounded bg-cyan-900/40 text-cyan-300 text-sm py-2 hover:bg-cyan-900/60">✕ Clear filters</a>
      )}
    </div>
  );
}
