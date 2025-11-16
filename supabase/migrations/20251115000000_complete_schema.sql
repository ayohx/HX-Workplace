/*
  # Complete HX Workplace Schema

  1. Schema Extensions
    - Add missing profile fields (cover_image, manager_id, settings, linkedin_url)
    - Create reactions table (replaces likes with multiple reaction types)
    - Create groups and group_members tables
    - Create conversations and messages tables
    - Create notifications table
    
  2. Performance
    - Add indexes for common queries
    - Foreign key constraints with CASCADE
    
  3. Security
    - RLS policies for all new tables
*/

-- ============================================================================
-- PROFILE TABLE EXTENSIONS
-- ============================================================================

-- Add missing profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS manager_id uuid references public.profiles(id) on delete set null,
ADD COLUMN IF NOT EXISTS settings jsonb default '{
  "notifications": {
    "email": true,
    "push": true,
    "mentions": true,
    "comments": true,
    "likes": true
  },
  "privacy": {
    "profileVisibility": "everyone",
    "showEmail": false,
    "showPhone": false,
    "allowMessages": true
  },
  "preferences": {
    "theme": "light",
    "language": "en-GB",
    "timezone": "Europe/London"
  }
}'::jsonb;

-- Update linkedin column name if using old naming
-- (Keep compatibility with existing data)

-- ============================================================================
-- REACTIONS TABLE (replaces likes with multiple types)
-- ============================================================================

-- Create reactions table
CREATE TABLE IF NOT EXISTS public.reactions (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reaction_type text not null check (reaction_type in ('like', 'love', 'celebrate', 'insightful', 'curious')),
  created_at timestamptz default now() not null,
  -- Ensure one reaction type per user per post
  unique(post_id, user_id)
);

-- Migrate existing likes to reactions
INSERT INTO public.reactions (post_id, user_id, reaction_type, created_at)
SELECT post_id, user_id, 'like', created_at
FROM public.likes
ON CONFLICT (post_id, user_id) DO NOTHING;

-- Drop old likes table after migration
-- DROP TABLE IF EXISTS public.likes;
-- Note: Keeping likes table for now to avoid breaking existing code
-- Will be removed in future migration after code is updated

-- ============================================================================
-- GROUPS TABLES
-- ============================================================================

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  cover_image text,
  privacy text not null check (privacy in ('public', 'private', 'secret')) default 'public',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create group_members junction table
CREATE TABLE IF NOT EXISTS public.group_members (
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('admin', 'moderator', 'member')) default 'member',
  joined_at timestamptz default now() not null,
  primary key (group_id, user_id)
);

-- ============================================================================
-- MESSAGING TABLES
-- ============================================================================

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid default uuid_generate_v4() primary key,
  is_group boolean default false not null,
  name text, -- For group conversations
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create conversation_participants junction table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now() not null,
  primary key (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in (
    'post_like', 'post_reaction', 'post_comment', 'comment_reply', 
    'mention', 'group_invite', 'group_post', 'message', 'follow'
  )),
  content text not null,
  reference_id uuid, -- ID of the post/comment/message that triggered notification
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON public.profiles(manager_id);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON public.comments(post_id, created_at DESC);

-- Reactions indexes
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON public.reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON public.reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON public.reactions(reaction_type);

-- Groups indexes
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);
CREATE INDEX IF NOT EXISTS idx_groups_privacy ON public.groups(privacy);

-- Group members indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);

-- Conversation participants indexes
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON public.notifications(user_id, is_read, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Reactions policies
CREATE POLICY "Reactions are viewable by everyone"
  ON public.reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON public.reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reactions"
  ON public.reactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON public.reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Groups policies
CREATE POLICY "Public groups are viewable by everyone"
  ON public.groups FOR SELECT
  USING (privacy = 'public' OR auth.uid() IN (
    SELECT user_id FROM public.group_members WHERE group_id = id
  ));

CREATE POLICY "Authenticated users can create groups"
  ON public.groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups"
  ON public.groups FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM public.group_members 
    WHERE group_id = id AND role = 'admin'
  ));

CREATE POLICY "Group admins can delete groups"
  ON public.groups FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM public.group_members 
    WHERE group_id = id AND role = 'admin'
  ));

-- Group members policies
CREATE POLICY "Group members are viewable by group members"
  ON public.group_members FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.group_members WHERE group_id = group_members.group_id
  ));

CREATE POLICY "Users can join public groups"
  ON public.group_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (SELECT privacy FROM public.groups WHERE id = group_id) = 'public'
  );

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Conversation participants can view conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.conversation_participants WHERE conversation_id = id
  ));

CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Conversation participants policies
CREATE POLICY "Participants can view conversation members"
  ON public.conversation_participants FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.conversation_participants 
    WHERE conversation_id = conversation_participants.conversation_id
  ));

CREATE POLICY "Users can join conversations"
  ON public.conversation_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Conversation participants can view messages"
  ON public.messages FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM public.conversation_participants WHERE conversation_id = messages.conversation_id
  ));

CREATE POLICY "Authenticated users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT user_id FROM public.conversation_participants WHERE conversation_id = messages.conversation_id
    )
  );

CREATE POLICY "Users can update own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete own messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Allow system to create notifications for any user

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- Groups updated_at trigger
CREATE TRIGGER set_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Conversations updated_at trigger
CREATE TRIGGER set_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Messages updated_at trigger
CREATE TRIGGER set_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

