/*
  # Add storage bucket for avatars
  
  1. New Features
    - Create avatars storage bucket
    - Set up storage policies for authenticated users
    
  2. Security
    - Enable public access for avatar images
    - Restrict uploads to authenticated users
    - Limit file types to images
*/

-- Create storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Create storage policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Users can upload avatar images"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = 'avatars' AND
    (lower(storage.extension(name)) = 'jpg' OR
     lower(storage.extension(name)) = 'jpeg' OR
     lower(storage.extension(name)) = 'png' OR
     lower(storage.extension(name)) = 'gif')
  );

create policy "Users can update their own avatar image"
  on storage.objects for update
  with check (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = 'avatars'
  );