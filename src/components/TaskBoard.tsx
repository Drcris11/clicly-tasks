'use client';

import { useMemo, useState } from 'react';

import { TaskCard } from '@/components/TaskCard';
import { STATUS_ORDER, normalizeStatus } from '@/lib/normalize';
import { Task } from '@/lib/types';

interface TaskBoardProps {
  tasks: Task[];
  source: 'supabase' | 'mock';
}

export function TaskBoard({ tasks, source }: TaskBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');

  const statusOptions = useMemo(() => STATUS_ORDER, []);
  const agentOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => String(t.agent || '').trim()).filter(Boolean))).sort(),
    [tasks],
  );
  const priorityOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => String(t.priority || '').trim()).filter(Boolean))).sort(),
    [tasks],
  );
  const projectOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => String(t.project || '').trim()).filter(Boolean))).sort(),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks.filter((t) => {
      if (statusFilter && normalizeStatus(t.status) !== statusFilter) return false;
      if (agentFilter && String(t.agent || '') !== agentFilter) return false;
      if (priorityFilter && String(t.priority || '') !== priorityFilter) return false;
      if (projectFilter && String(t.project || '') !== projectFilter) return false;

      if (q) {
        const id = String(t.id || '').toLowerCase();
        const title = String(t.title || '').toLowerCase();
        if (!id.includes(q) && !title.includes(q)) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, agentFilter, priorityFilter, projectFilter, searchQuery]);

  const hasFilters = Boolean(searchQuery || statusFilter || agentFilter || priorityFilter || projectFilter);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setAgentFilter('');
    setPriorityFilter('');
    setProjectFilter('');
  };

  return (
    <main className="min-h-screen bg-[#0F2B46] text-white p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-300">Task Board</h1>
        <p className="mt-1 text-sm text-cyan-100/80">
          Source: {source === 'supabase' ? 'Supabase' : 'Mock data (configure env to connect Supabase)'}
        </p>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search tasks by ID or title..."
            className="w-full rounded-lg bg-[#13395D] border border-cyan-700/50 p-3 text-base text-white placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
            >
              <option value="">All statuses</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
            >
              <option value="">All agents</option>
              {agentOptions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
            >
              <option value="">All priorities</option>
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="rounded bg-[#13395D] border border-cyan-900/40 p-2 text-sm text-white"
            >
              <option value="">All projects</option>
              {projectOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-block rounded bg-cyan-900/40 text-cyan-300 text-sm px-3 py-1.5 hover:bg-cyan-900/60"
            >
              ✕ Clear all filters
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {STATUS_ORDER.map((status) => {
            const items = filteredTasks.filter((t) => normalizeStatus(t.status) === status);

            return (
              <section key={status} className="rounded-xl bg-[#102f4d] border border-cyan-900/40 p-3">
                <h2 className="text-cyan-300 font-semibold">
                  {status} <span className="text-cyan-100/70 text-sm">({items.length})</span>
                </h2>
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
