-- Optional account sync for TerraScope. Run once in the chosen project's SQL editor.
-- Billing and Pro status are deliberately absent from this user-writable table.
begin;
create table if not exists public.terrascope_daily_games (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  guesses text[] not null check (cardinality(guesses) between 1 and 6),
  won boolean not null,
  finished boolean not null default true check (finished),
  created_at timestamptz not null default now(),
  primary key (user_id,day),
  check (won or cardinality(guesses)=6)
);
alter table public.terrascope_daily_games enable row level security;
revoke all on public.terrascope_daily_games from anon,authenticated;
grant select,insert on public.terrascope_daily_games to authenticated;
drop policy if exists "Read own daily results" on public.terrascope_daily_games;
create policy "Read own daily results" on public.terrascope_daily_games for select to authenticated
  using ((select auth.uid())=user_id);
drop policy if exists "Save own daily results" on public.terrascope_daily_games;
create policy "Save own daily results" on public.terrascope_daily_games for insert to authenticated
  with check ((select auth.uid())=user_id and day<=current_date);
commit;
