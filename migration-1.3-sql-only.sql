-- Story 1.3: Comment Threading & GIPHY Support Migration

-- Add comment threading support (replies to comments)
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE;

-- Index for efficient parent comment lookups
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments (parent_id);

-- Add GIPHY support for comments (not reactions)
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS giphy_id text,
ADD COLUMN IF NOT EXISTS giphy_url text;

-- Index for GIPHY lookups in comments
CREATE INDEX IF NOT EXISTS idx_comments_giphy_id ON public.comments (giphy_id)
WHERE giphy_id IS NOT NULL;
