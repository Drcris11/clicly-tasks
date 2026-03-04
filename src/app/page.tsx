export const dynamic = 'force-dynamic';

import { TaskBoard } from '@/components/TaskBoard';
import { getTasks } from '@/lib/data';

export default async function Home() {
  const { tasks, source } = await getTasks();

  return <TaskBoard tasks={tasks} source={source} />;
}
