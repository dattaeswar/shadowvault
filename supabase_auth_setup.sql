-- Run this in the Supabase SQL Editor

-- 1. Add user_id column to secrets table
alter table secrets 
add column if not exists user_id uuid references auth.users not null default auth.uid();

-- 2. Enable Row Level Security (RLS)
alter table secrets enable row level security;

-- 3. Create Policy: Users can only see their own secrets
create policy "Users can see own secrets"
on secrets for select
using (auth.uid() = user_id);

-- 4. Create Policy: Users can insert their own secrets
create policy "Users can insert own secrets"
on secrets for insert
with check (auth.uid() = user_id);

-- 5. Create Policy: Users can delete their own secrets
create policy "Users can delete own secrets"
on secrets for delete
using (auth.uid() = user_id);

-- 6. Create Policy: Users can update their own secrets (optional but good practice)
create policy "Users can update own secrets"
on secrets for update
using (auth.uid() = user_id);
