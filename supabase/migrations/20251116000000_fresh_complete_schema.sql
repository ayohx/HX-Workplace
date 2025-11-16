/*
  # Complete HX Workplace Schema - Fresh Installation

  This migration creates the complete database schema from scratch for HX Workplace.
  
  1. Tables Created:
    - profiles (user profiles linked to auth.users)
    - posts (social feed posts)
    - comments (post comments)
    - reactions (5 types: like, love, celebrate, insightful, curious)
    - groups (communities/teams)
    - group_members (group membership)
    - conversations (1-on-1 and group chats)
    - conversation_participants (conversation members)
    - messages (chat messages)
    - notifications (user notifications)

  2. Security:
    - Row Level Security (RLS) enabled on all tables
    - Policies for read/write access
    
  3. Performance:
    - Indexes on foreign keys and common query patterns
    - Triggers for automatic timestamp updates
*/

-- ============================================================================
-- ENABLE EXTENSIONS
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable timestamp update function
CREATE EXTENSION IF NOT EXISTS "moddatetime" SCHEMA "extensions";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  avatar text,
  cover_image text,
  role text,
  department text,
  email text,
  bio text,
  location text,
  phone text,
  linkedin text,
  manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index for manager lookup
CREATE INDEX idx_profiles_manager_id ON public.profiles (manager_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media_url text[], -- Array of URLs for images/videos
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_edited boolean DEFAULT false,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  visibility text DEFAULT 'public' NOT NULL -- 'public', 'private', 'group'
);

-- Indexes for performance
CREATE INDEX idx_posts_user_id ON public.posts (user_id);
CREATE INDEX idx_posts_created_at ON public.posts (created_at DESC);
CREATE INDEX idx_posts_group_id ON public.posts (group_id);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone."
  ON public.posts FOR SELECT USING (true);

CREATE POLICY "Users can create posts."
  ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts."
  ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts."
  ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- COMMENTS TABLE
-- ============================================================================

CREATE TABLE public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_edited boolean DEFAULT false
);

-- Indexes
CREATE INDEX idx_comments_post_id ON public.comments (post_id);
CREATE INDEX idx_comments_user_id ON public.comments (user_id);
CREATE INDEX idx_comments_created_at ON public.comments (created_at);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Comments are viewable by everyone."
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments."
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments."
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments."
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_comments_updated_at BEFORE UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- REACTIONS TABLE (Replaces simple likes with multiple reaction types)
-- ============================================================================

CREATE TABLE public.reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reaction_type text NOT NULL, -- 'like', 'love', 'celebrate', 'insightful', 'curious'
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id) -- One reaction per user per post
);

-- Indexes
CREATE INDEX idx_reactions_post_id ON public.reactions (post_id);
CREATE INDEX idx_reactions_user_id ON public.reactions (user_id);
CREATE INDEX idx_reactions_type ON public.reactions (reaction_type);

-- Enable RLS
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reactions are viewable by everyone."
  ON public.reactions FOR SELECT USING (true);

CREATE POLICY "Users can create reactions."
  ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions."
  ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- GROUPS TABLE
-- ============================================================================

CREATE TABLE public.groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  cover_image text,
  visibility text DEFAULT 'public' NOT NULL, -- 'public', 'private'
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_groups_created_by ON public.groups (created_by);
CREATE INDEX idx_groups_created_at ON public.groups (created_at DESC);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public groups are viewable by everyone."
  ON public.groups FOR SELECT USING (visibility = 'public' OR auth.uid() IN (
    SELECT user_id FROM public.group_members WHERE group_id = id
  ));

CREATE POLICY "Users can create groups."
  ON public.groups FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups."
  ON public.groups FOR UPDATE USING (auth.uid() = created_by);

-- Trigger for updated_at
CREATE TRIGGER handle_groups_updated_at BEFORE UPDATE ON public.groups
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- GROUP MEMBERS TABLE
-- ============================================================================

CREATE TABLE public.group_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' NOT NULL, -- 'admin', 'moderator', 'member'
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE(group_id, user_id)
);

-- Indexes
CREATE INDEX idx_group_members_group_id ON public.group_members (group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members (user_id);

-- Enable RLS
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Group members are viewable by group members."
  ON public.group_members FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.group_members WHERE group_id = group_members.group_id)
  );

CREATE POLICY "Users can join groups."
  ON public.group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups."
  ON public.group_members FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================

CREATE TABLE public.conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text, -- For group conversations
  is_group boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index
CREATE INDEX idx_conversations_updated_at ON public.conversations (updated_at DESC);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their conversations."
  ON public.conversations FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.conversation_participants WHERE conversation_id = id)
  );

CREATE POLICY "Users can create conversations."
  ON public.conversations FOR INSERT WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER handle_conversations_updated_at BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- CONVERSATION PARTICIPANTS TABLE
-- ============================================================================

CREATE TABLE public.conversation_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  last_read_at timestamp with time zone,
  UNIQUE(conversation_id, user_id)
);

-- Indexes
CREATE INDEX idx_conversation_participants_conversation_id ON public.conversation_participants (conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON public.conversation_participants (user_id);

-- Enable RLS
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view participants in their conversations."
  ON public.conversation_participants FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.conversation_participants WHERE conversation_id = conversation_participants.conversation_id)
  );

CREATE POLICY "Users can add participants to conversations they're in."
  ON public.conversation_participants FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.conversation_participants WHERE conversation_id = conversation_participants.conversation_id)
  );

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================

CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media_url text[], -- Array of URLs for attachments
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  is_edited boolean DEFAULT false
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX idx_messages_user_id ON public.messages (user_id);
CREATE INDEX idx_messages_created_at ON public.messages (created_at DESC);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view messages in their conversations."
  ON public.messages FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.conversation_participants WHERE conversation_id = messages.conversation_id)
  );

CREATE POLICY "Users can send messages in their conversations."
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    auth.uid() IN (SELECT user_id FROM public.conversation_participants WHERE conversation_id = messages.conversation_id)
  );

CREATE POLICY "Users can update their own messages."
  ON public.messages FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages."
  ON public.messages FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER handle_messages_updated_at BEFORE UPDATE ON public.messages
FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'post', 'comment', 'reaction', 'mention', 'group', 'message'
  title text NOT NULL,
  message text NOT NULL,
  link text, -- URL to the relevant content
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications (created_at DESC);
CREATE INDEX idx_notifications_is_read ON public.notifications (is_read);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications."
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications."
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications."
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications."
  ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COMPLETE! All tables, indexes, RLS policies, and triggers created.
-- ============================================================================

