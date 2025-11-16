/*
  # Add Soft Delete Support to Posts Table

  1. Changes
    - Add `deleted_at` column to posts table for soft deletes
    - Update RLS policies to exclude deleted posts from SELECT queries
    - Create index on deleted_at for query performance

  2. Performance
    - Index on deleted_at for efficient filtering
*/

-- Add deleted_at column to posts table
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

-- Create index for efficient filtering of deleted posts
CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON public.posts (deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Update RLS policy to exclude deleted posts from SELECT queries
DROP POLICY IF EXISTS "Posts are viewable by everyone." ON public.posts;

CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT 
  USING (deleted_at IS NULL);

-- Users can still UPDATE their own posts (for soft delete)
-- The existing UPDATE policy already ensures users can only update their own posts

