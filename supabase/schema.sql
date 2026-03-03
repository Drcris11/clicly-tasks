create table if not exists tasks (
  id text primary key,
  title text not null,
  description text,
  status text default 'Todo',
  agent text,
  priority text,
  project text,
  notes text,
  notion_url text,
  drive_url text,
  github_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists tasks_set_updated_at on tasks;
create trigger tasks_set_updated_at
before update on tasks
for each row execute function set_updated_at();
