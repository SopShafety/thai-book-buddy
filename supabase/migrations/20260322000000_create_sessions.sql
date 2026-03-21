create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table sessions enable row level security;

-- Users can only insert their own sessions
create policy "Users can insert own sessions"
  on sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Only service role can read sessions (admin dashboard)
create policy "Service role can read sessions"
  on sessions for select
  to service_role
  using (true);

create index sessions_user_id_idx on sessions(user_id);
create index sessions_created_at_idx on sessions(created_at);
