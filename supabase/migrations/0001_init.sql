create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  created_at timestamptz default now()
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  code text not null,
  passed boolean not null,
  tests_passed int not null,
  tests_total int not null,
  runtime_ms int,
  created_at timestamptz default now()
);
create index if not exists attempts_user_problem_idx on attempts (user_id, problem_id);

create table if not exists progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  status text not null check (status in ('attempted','solved')),
  best_attempt_id uuid references attempts(id) on delete set null,
  updated_at timestamptz default now(),
  primary key (user_id, problem_id)
);

alter table profiles enable row level security;
alter table attempts enable row level security;
alter table progress enable row level security;

create policy "own profile" on profiles
  for all to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "own attempts" on attempts
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "own progress" on progress
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
