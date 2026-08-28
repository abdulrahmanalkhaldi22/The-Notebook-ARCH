-- Notebook Archive: Phase 1 schema (profiles + books)
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query)

-- 1. Profiles table (one row per authenticated user)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  public_id text unique not null,
  display_name text,
  bio text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 2. Books table
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  call_number text unique not null,
  title text not null,
  author_name text not null,
  genre text,
  description text,
  content jsonb not null default '{"pages": []}'::jsonb,
  is_visible boolean not null default false,
  description_visible boolean not null default true,
  cover_visible boolean not null default true,
  cover_config jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table books enable row level security;

create policy "Owners can view their own books"
  on books for select
  using (auth.uid() = owner_id);

create policy "Visible books are viewable by everyone"
  on books for select
  using (is_visible = true);

create policy "Owners can insert their own books"
  on books for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own books"
  on books for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own books"
  on books for delete
  using (auth.uid() = owner_id);

-- 3. Auto-update updated_at on books
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger books_set_updated_at
  before update on books
  for each row
  execute function set_updated_at();

-- 4. Auto-create a profile row on signup, with a random public_id
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, public_id, display_name)
  values (
    new.id,
    'user-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();
