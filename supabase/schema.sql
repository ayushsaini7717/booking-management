-- public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- bookmarks
create table if not exists bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  url text not null
);

-- RLS for bookmarks
alter table bookmarks enable row level security;

create policy "Users can view their own bookmarks." on bookmarks
  for select using ((select auth.uid()) = user_id);

create policy "Users can create their own bookmarks." on bookmarks
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own bookmarks." on bookmarks
  for update using ((select auth.uid()) = user_id);

create policy "Users can delete their own bookmarks." on bookmarks
  for delete using ((select auth.uid()) = user_id);

alter publication supabase_realtime add table bookmarks;

alter table bookmarks replica identity full;
