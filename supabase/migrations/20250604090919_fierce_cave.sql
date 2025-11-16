/*
  # Storage setup for avatar images
  
  1. Changes
    - Create storage bucket for avatars if it doesn't exist
    - Set up policies for public access and user operations
    
  2. Security
    - Public read access for avatar images
    - Authenticated users can upload/update/delete their own avatars
*/

-- Create storage bucket for avatars if it doesn't exist
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'avatars'
  ) then
    insert into storage.buckets (id, name, public)
    values ('avatars', 'avatars', true);
  end if;
end $$;

-- Drop existing policies if they exist
drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload avatar images" on storage.objects;
drop policy if exists "Users can update their own avatar image" on storage.objects;
drop policy if exists "Users can delete their own avatar image" on storage.objects;

-- Create storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload avatar images"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

create policy "Users can update their own avatar image"
  on storage.objects for update
  with check (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );

create policy "Users can delete their own avatar image"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated'
  );