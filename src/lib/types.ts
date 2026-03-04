export type TaskStatus = 'Todo' | 'In Progress' | 'Pending Approval' | 'Pending' | 'Blocked' | 'Testing' | 'On Hold' | 'Cancelled' | 'Done';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  agent?: string | null;
  priority?: string | null;
  project?: string | null;
  notes?: string | null;
  original_request?: string | null;
  brief?: string | null;
  my_analysis?: string | null;
  notion_url?: string | null;
  drive_url?: string | null;
  github_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
