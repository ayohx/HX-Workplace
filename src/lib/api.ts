import { supabase } from './supabase';
import type { ProfileInsert, ProfileUpdate, PostInsert } from '../types/database.types';

/**
 * Authentication API Functions
 * Using Supabase Auth for secure user authentication
 */

export async function login(email: string, password: string) {
  try {
    console.log('Attempting login for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      throw new Error(error.message || 'Invalid login credentials');
    }

    if (!data.user) {
      console.error('No user returned from Supabase');
      throw new Error('Login failed - no user returned');
    }

    console.log('Auth successful, fetching profile for user:', data.user.id);

    // Fetch the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
        console.warn('Profile not found, creating basic profile');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'User',
            email: data.user.email || null,
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Failed to create profile:', createError);
          // Still return user data even if profile creation fails - auth worked
          console.log('Returning basic user data due to profile creation failure');
          return {
            user: {
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'User',
              email: data.user.email || null,
              avatar: null,
              role: null,
              department: null,
            } as any,
            session: data.session,
          };
        }
        
        console.log('Profile created successfully:', newProfile?.name);
        return {
          user: newProfile,
          session: data.session,
        };
      }
      // For other errors, still return basic user data - auth succeeded
      console.warn('Profile fetch failed, returning basic user data');
      return {
        user: {
          id: data.user.id,
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || null,
          avatar: null,
          role: null,
          department: null,
        } as any,
        session: data.session,
      };
    }

    if (!profile) {
      console.warn('Profile is null, returning basic user data');
      return {
        user: {
          id: data.user.id,
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || null,
          avatar: null,
          role: null,
          department: null,
        } as any,
        session: data.session,
      };
    }

    console.log('Login successful, profile loaded:', profile.name);
    return {
      user: profile,
      session: data.session,
    };
  } catch (error: any) {
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
}) {
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

export async function deletePost(postId: string, userId: string) {
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

export async function addComment(commentData: {
  postId: string;
  userId: string;
  content: string;
}) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: commentData.postId,
      user_id: commentData.userId,
      content: commentData.content,
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
    throw new Error(error.message || 'Failed to add comment');
  }

  return { comment: data };
}

/**
 * Reaction API Functions
 */

export async function toggleReaction(reactionData: {
  postId: string;
  userId: string;
  reactionType: 'like' | 'love' | 'celebrate' | 'insightful' | 'curious';
}) {
  // Check if user already reacted to this post
  const { data: existing } = await supabase
    .from('reactions')
    .select('*')
    .eq('post_id', reactionData.postId)
    .eq('user_id', reactionData.userId)
    .single();

  if (existing) {
    // If same reaction type, remove it (toggle off)
    if (existing.reaction_type === reactionData.reactionType) {
      const { error } = await supabase
        .from('reactions')
        .delete()
        .eq('post_id', reactionData.postId)
        .eq('user_id', reactionData.userId);

      if (error) {
        throw new Error(error.message || 'Failed to remove reaction');
      }

      return { action: 'removed', reaction: null };
    } else {
      // Update to new reaction type
      const { data, error } = await supabase
        .from('reactions')
        .update({ reaction_type: reactionData.reactionType })
        .eq('post_id', reactionData.postId)
        .eq('user_id', reactionData.userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update reaction');
      }

      return { action: 'updated', reaction: data };
    }
  } else {
    // Add new reaction
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        post_id: reactionData.postId,
        user_id: reactionData.userId,
        reaction_type: reactionData.reactionType,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message || 'Failed to add reaction');
    }

    return { action: 'added', reaction: data };
  }
}