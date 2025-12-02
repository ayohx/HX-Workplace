-- Add comment threading support (replies to comments)
-- This migration adds parent_id to enable nested comment threads

ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Index for efficient parent comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments (parent_id);

-- Add GIPHY support for reactions
ALTER TABLE public.reactions
ADD COLUMN IF NOT EXISTS giphy_id text,
ADD COLUMN IF NOT EXISTS giphy_url text;

-- Index for GIPHY lookups
CREATE INDEX IF NOT EXISTS idx_reactions_giphy_id ON public.reactions (giphy_id)
WHERE giphy_id IS NOT NULL;
