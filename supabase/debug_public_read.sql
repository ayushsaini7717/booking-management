
drop policy if exists "Enable access to own bookmarks" on bookmarks;
drop policy if exists "Users can view their own bookmarks." on bookmarks;
drop policy if exists "Users can create their own bookmarks." on bookmarks;
drop policy if exists "Users can insert their own bookmarks." on bookmarks;
drop policy if exists "Users can update their own bookmarks." on bookmarks;
drop policy if exists "Users can delete their own bookmarks." on bookmarks;

create policy "Public Read Debug"
on bookmarks
for select
using (true);

create policy "User Insert Debug"
on bookmarks
for insert
with check ((select auth.uid()) = user_id);

create policy "User Update Debug"
on bookmarks
for update
using ((select auth.uid()) = user_id);

create policy "User Delete Debug"
on bookmarks
for delete
using ((select auth.uid()) = user_id);

select * from pg_policies where tablename = 'bookmarks';
