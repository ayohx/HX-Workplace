import { supabase } from './supabase';
import type { ProfileUpdate, PostInsert } from '../types/database.types';

/**
 * Authentication API Functions
 * Using Supabase Auth for secure user authentication
 */

export async function login(email: string, password: string) {
  try {
    console.log('Attempting login for:', email);
    
    const authResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Auth result received:', { 
      hasError: !!authResult.error, 
      hasUser: !!authResult.data?.user,
      userId: authResult.data?.user?.id 
    });

    if (authResult.error) {
      console.error('Supabase auth error:', authResult.error);
      throw new Error(authResult.error.message || 'Invalid login credentials');
    }

    if (!authResult.data?.user) {
      console.error('No user returned from Supabase');
      throw new Error('Login failed - no user returned');
    }

    console.log('Auth successful for user:', authResult.data.user.id);
    
    // Return immediately with basic user data - let auth state listener handle profile loading
    // This prevents the login function from hanging on profile fetch
    const basicUser = {
      id: authResult.data.user.id,
      name: authResult.data.user.email?.split('@')[0] || 'User',
      email: authResult.data.user.email || null,
      avatar: null,
      role: null,
      department: null,
    };

    console.log('Login function completing, returning basic user data');
    
    return {
      user: basicUser,
      session: authResult.data.session,
    };
  } catch (error: unknown) {
    console.error('Login function error:', error);
    throw error;
  }
}

export async function register(userData: {
  email: string;
  password: string;
  name: string;
  role?: string;
  department?: string;
  avatar?: string;
}) {
  // Sign up the user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        avatar_url: userData.avatar || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
      },
    },
  });

  if (error) {
    throw new Error(error.message || 'Registration failed');
  }

  if (!data.user) {
    throw new Error('Registration failed - no user created');
  }

  // The profile is automatically created via database trigger (handle_new_user)
  // Update profile with additional fields
  const profileUpdates: ProfileUpdate = {
    role: userData.role || 'Member',
    department: userData.department || 'General',
  };

  const { error: updateError } = await supabase
    .from('profiles')
    .update(profileUpdates)
    .eq('id', data.user.id);

  if (updateError) {
    console.error('Error updating profile:', updateError);
  }

  // Fetch the complete profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  return {
    user: profile,
    session: data.session,
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message || 'Logout failed');
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw new Error(error.message || 'Password reset failed');
  }

  return { success: true, message: 'Password reset email sent' };
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message || 'Password update failed');
  }

  return { success: true };
}

/**
 * Profile API Functions
 */

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Profile update failed');
  }

  return { success: true, profile: data };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to fetch profile');
  }

  return data;
}

/**
 * Post API Functions
 */

export async function createPost(postData: {
  userId: string;
  content: string;
}) {
  const postInsert: PostInsert = {
    user_id: postData.userId,
    content: postData.content,
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(postInsert)
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar,
        role,
        department
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create post');
  }

  return { post: data };
}

export async function getPosts(options: {
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 20, offset = 0 } = options;
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar,
        role,
        department
      ),
      comments (
        id,
        content,
        created_at,
        profiles:user_id (
          id,
          name,
          avatar
        )
      ),
      reactions (
        id,
        user_id,
        reaction_type
      )
    `)
    .is('deleted_at', null) // Only fetch non-deleted posts
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1); // Pagination support

  if (error) {
    throw new Error(error.message || 'Failed to fetch posts');
  }

  return data;
}

export async function updatePost(postId: string, userId: string, updates: {
  content?: string;
}): Promise<{ post: any }> {
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...updates,
      is_edited: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .eq('user_id', userId) // Ensure user owns the post
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar,
        role,
        department
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update post');
  }

  return { post: data };
}

export async function deletePost(postId: string, userId: string): Promise<{ success: boolean }> {
  // Soft delete: set deleted_at timestamp instead of removing from database
  const { error } = await supabase
    .from('posts')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .eq('user_id', userId); // Ensure user owns the post

  if (error) {
    throw new Error(error.message || 'Failed to delete post');
  }

  return { success: true };
}

/**
 * Comment API Functions
 */

export async function createComment(commentData: {
  postId: string;
  userId: string;
  content: string;
  parentId?: string;
  giphyId?: string;
  giphyUrl?: string;
}): Promise<{ comment: any }> {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: commentData.postId,
      user_id: commentData.userId,
      content: commentData.content,
      parent_id: commentData.parentId || null,
      giphy_id: commentData.giphyId || null,
      giphy_url: commentData.giphyUrl || null,
    })
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to create comment');
  }

  return { comment: data };
}

export async function getComments(postId: string, options: {
  limit?: number;
  offset?: number;
} = {}) {
  const { limit = 10, offset = 0 } = options;
  
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false }) // Newest first by default
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message || 'Failed to fetch comments');
  }

  return data;
}

export async function updateComment(commentId: string, userId: string, updates: {
  content: string;
}): Promise<{ comment: any }> {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content: updates.content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .eq('user_id', userId) // Ensure user owns the comment
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update comment');
  }

  return { comment: data };
}

export async function deleteComment(commentId: string, userId: string): Promise<{ success: boolean }> {
  // Hard delete for comments (or implement soft delete if needed)
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId); // Ensure user owns the comment

  if (error) {
    throw new Error(error.message || 'Failed to delete comment');
  }

  return { success: true };
}

// Legacy alias for backwards compatibility
export const addComment = createComment;

/**
 * Reaction API Functions
 */

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'curious';

export async function addReaction(reactionData: {
  postId: string;
  userId: string;
  type: ReactionType;
}): Promise<{ reaction: any }> {
  // Use upsert to add or change reaction type atomically
  // The UNIQUE constraint on (post_id, user_id) prevents duplicates
  const { data, error } = await supabase
    .from('reactions')
    .upsert(
      {
        post_id: reactionData.postId,
        user_id: reactionData.userId,
        reaction_type: reactionData.type, // Database column is reaction_type
      },
      {
        onConflict: 'post_id,user_id', // Handle unique constraint
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to add reaction');
  }

  return { reaction: data };
}

export async function removeReaction(reactionData: {
  postId: string;
  userId: string;
}): Promise<{ success: boolean }> {
  const { error } = await supabase
    .from('reactions')
    .delete()
    .eq('post_id', reactionData.postId)
    .eq('user_id', reactionData.userId);

  if (error) {
    throw new Error(error.message || 'Failed to remove reaction');
  }

  return { success: true };
}

export async function getReactions(postId: string) {
  const { data, error } = await supabase
    .from('reactions')
    .select(`
      *,
      profiles:user_id (
        id,
        name,
        avatar
      )
    `)
    .eq('post_id', postId);

  if (error) {
    throw new Error(error.message || 'Failed to fetch reactions');
  }

  // Aggregate reaction counts by type
  const reactionCounts: Record<ReactionType, number> = {
    like: 0,
    love: 0,
    celebrate: 0,
    insightful: 0,
    curious: 0,
  };

  const reactionUsers: Record<ReactionType, any[]> = {
    like: [],
    love: [],
    celebrate: [],
    insightful: [],
    curious: [],
  };

  data.forEach((reaction: any) => {
    const type = reaction.reaction_type as ReactionType;
    if (reactionCounts[type] !== undefined) {
      reactionCounts[type]++;
      reactionUsers[type].push(reaction.profiles);
    }
  });

  return {
    counts: reactionCounts,
    users: reactionUsers,
    total: data.length,
  };
}

// Legacy function for backwards compatibility
export async function toggleReaction(reactionData: {
  postId: string;
  userId: string;
  reactionType: ReactionType;
}) {
  // Check if user already has this exact reaction
  const { data: existing } = await supabase
    .from('reactions')
    .select('*')
    .eq('post_id', reactionData.postId)
    .eq('user_id', reactionData.userId)
    .single();

  if (existing && existing.reaction_type === reactionData.reactionType) {
    // Same reaction - remove it (toggle off)
    await removeReaction({
      postId: reactionData.postId,
      userId: reactionData.userId,
    });
    return { action: 'removed', reaction: null };
  } else {
    // Different reaction or no reaction - add/update it
    const result = await addReaction({
      postId: reactionData.postId,
      userId: reactionData.userId,
      type: reactionData.reactionType,
    });
    return { 
      action: existing ? 'updated' : 'added', 
      reaction: result.reaction 
    };
  }
}