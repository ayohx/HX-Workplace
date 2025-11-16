/*
  # Clean up test users
  
  This migration removes test user accounts while preserving demo users.
  
  1. Changes
    - Delete test users from auth.users table
    - Preserve demo users with specific UUIDs
*/

delete from auth.users
where email not like '%@holidayextras.com'
and email not in (
  select email from public.profiles 
  where id in (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005'
  ) -- Demo user IDs
);