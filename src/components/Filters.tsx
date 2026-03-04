'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition, useState, useEffect } from 'react';

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Pending Approval', 'Pending', 'Blocked', 'Testing', 'On Hold', 'Cancelled', 'Done'];

interface FiltersProps {
  agents: string[];
  priorities: string[];
  projects: string[];
}

export function Filters({ agents, priorities, projects }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    startTransition(() => router.push(`/?${params.toString()}`));
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => update('q', search.trim()), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = searchParams.get('q') || searchParams.get('agent') || searchParams.get('priority') || searchParams.get('project') || searchParams.get('status');

  return (
    <div className="mt-4 space-y-3">
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍  Search by task ID or title..."
        className="w-full rounded-lg bg-[#13395D] border border-cyan-700/50 p-2.5 text-sm text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400"
      />

      {/* Filter dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <select
          defaultValue={searchParams.get('status') || ''}
          onChange={(e) => update('status', e.target.value)}
          className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          defaultValue={searchParams.get('agent') || ''}
          onChange={(e) => update('agent', e.target.value)}
          className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
        >
          <option value="">All agents</option>
          {agents.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          defaultValue={searchParams.get('priority') || ''}
          onChange={(e) => update('priority', e.target.value)}
          className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
        >
          <option value="">All priorities</option>
          {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select
          defaultValue={searchParams.get('project') || ''}
          onChange={(e) => update('project', e.target.value)}
          className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
        >
          <option value="">All projects</option>
          {projects.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      {hasFilters && (
        <a
          href="/"
          className="inline-block rounded bg-cyan-900/40 text-cyan-300 text-sm px-3 py-1.5 hover:bg-cyan-900/60"
        >
          ✕ Clear all filters
        </a>
      )}
    </div>
  );
}
