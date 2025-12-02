import React, { createContext, useContext, useState, useEffect, useRef, useMemo, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  createPost, 
  login, 
  register as registerUser, 
  logout as logoutUser, 
  updateProfile as updateUserProfile,
  getPosts,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
  createComment,
  updateComment,
  deleteComment,
  type ReactionType
} from '../lib/api';
import { mockGroups, mockMessages } from '../data/mockData';
import type { Profile } from '../types/database.types';

// Use Profile type from database, extend as needed for UI
type User = Profile;

interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
}

interface Attachment {
  id: string;
  type: string;
  name: string;
  url: string;
}

interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  attachments?: Attachment[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  posts: string[];
  isPrivate: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface ProfileUpdateData {
  name?: string;
  avatar?: File;
  coverImage?: File;
  role?: string;
  department?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  managerId?: string | null;
  settings?: any;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  groups: Group[];
  messages: Message[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  isAuthenticated: boolean;
  loading: boolean;
  authInitialized: boolean;
  authLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userId: string, data: ProfileUpdateData) => Promise<void>;
  addPost: (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => Promise<void>;
  editPost: (postId: string, content: string) => Promise<void>;
  removePost: (postId: string) => Promise<void>;
  loadMorePosts: () => Promise<void>;
  hasMorePosts: boolean;
  addComment: (postId: string, commentData: { userId: string; content: string; giphyId?: string; giphyUrl?: string }) => Promise<void>;
  editComment: (postId: string, commentId: string, content: string) => Promise<void>;
  removeComment: (postId: string, commentId: string) => Promise<void>;
  toggleLike: (postId: string) => void;
  toggleReaction: (postId: string, reactionType: ReactionType) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups] = useState<Group[]>(mockGroups);
  const [messages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); // Start with loading false - only set true when actively checking
  const [authInitialized, setAuthInitialized] = useState(false);
  const [postsOffset, setPostsOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasSession, setHasSession] = useState(false); // Track session state for isAuthenticated

  // Initialize auth state and set up listener
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    let mounted = true;

    // CRITICAL: Set loading to false immediately if Supabase isn't configured
    // This prevents infinite loading state
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured - skipping auth initialization');
      setLoading(false);
      setAuthInitialized(true);
      return; // Exit early
    }

    // Set loading to true ONLY while we're checking auth
    setLoading(true);
    
    // CRITICAL: Safety timeout - ALWAYS resolve loading after 300ms max
    // This MUST fire to prevent infinite loading - no exceptions
    // Increased to 300ms to give Supabase a bit more time, but still fast enough
    timeoutRef.current = setTimeout(() => {
      console.warn('Auth initialization timeout - forcing loading to false (failsafe)');
      if (mounted) {
        setLoading(false);
        setAuthInitialized(true);
        console.log('Timeout fired - loading is now false, authInitialized is now true');
      }
    }, 300);

    const initializeAuth = async () => {
      try {
        // If Supabase is not configured, skip auth initialization
        if (!isSupabaseConfigured()) {
          console.warn('Supabase not configured - auth features disabled');
          if (mounted) {
            setLoading(false);
            setAuthInitialized(true);
          }
          return;
        }

        // Check for existing session with error handling
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Error getting session:', sessionError);
            if (mounted) {
              setLoading(false);
              setAuthInitialized(true);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }
            return;
          }

          if (session?.user) {
            // Set session flag immediately and stop loading
            if (mounted) {
              console.log('Session found in initializeAuth, setting loading to false and authInitialized to true');
              // Batch all state updates together - React will process them in one render
              setHasSession(true);
              setLoading(false);
              setAuthInitialized(true); // CRITICAL: Set this immediately so authLoading becomes false
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }
            
            // Load user profile (but don't block on it)
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (profileError) {
                console.error('Error loading profile:', profileError);
                // Set basic user even if profile fails
                if (mounted) {
                  setCurrentUser({
                    id: session.user.id,
                    email: session.user.email || null,
                    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                    avatar: session.user.user_metadata?.avatar_url || null,
                    role: null,
                    department: null,
                  } as any);
                }
              } else if (mounted) {
                setCurrentUser(profile);
              }
            } catch (profileErr) {
              console.error('Exception loading profile:', profileErr);
            }
          } else {
            // No session - user is not authenticated
            if (mounted) {
              console.log('No session found in initializeAuth, setting loading to false and authInitialized to true');
              setHasSession(false);
              // Batch state updates together
              setLoading(false);
              setAuthInitialized(true); // CRITICAL: Set this immediately so authLoading becomes false
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }
          }
        } catch (err) {
          console.error('Exception in getSession:', err);
          if (mounted) {
            setLoading(false);
            setAuthInitialized(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error('Exception in initializeAuth:', err);
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);

      try {
        // Handle both SIGNED_IN and INITIAL_SESSION events
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          // Set session flag immediately so isAuthenticated becomes true
          // AND set loading to false immediately - don't wait for profile
          console.log('Auth state listener: SIGNED_IN/INITIAL_SESSION detected, setting loading to false immediately');
          if (mounted) {
            // Batch all state updates together - React will process them in one render
            setHasSession(true);
            setLoading(false);
            setAuthInitialized(true);
            console.log('State updated: hasSession=true, loading=false, authInitialized=true');
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
          
          // Load user profile on sign in or initial session (non-blocking)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error loading profile after sign in:', error);
            // Even if profile fails, set a basic user object so auth works
            if (mounted) {
              setCurrentUser({
                id: session.user.id,
                email: session.user.email || null,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                avatar: session.user.user_metadata?.avatar_url || null,
                role: null,
                department: null,
              } as any);
            }
          } else if (mounted) {
            setCurrentUser(profile);
          }
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setHasSession(false);
            setCurrentUser(null);
            setPosts([]);
            setUsers([]);
            setNotifications([]);
            setLoading(false);
            setAuthInitialized(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        } else if (event === 'USER_UPDATED' && session?.user) {
          // Reload profile on user update
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && mounted) {
            setCurrentUser(profile);
          }
          
          // Ensure loading is false
          if (mounted) {
            setLoading(false);
            setAuthInitialized(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        } else {
          // For any other event, ensure loading is resolved
          if (mounted) {
            setLoading(false);
            setAuthInitialized(true);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }
        }
      } catch (err) {
        console.error('Error in auth state change handler:', err);
        if (mounted) {
          setLoading(false);
          setAuthInitialized(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      }
    });

    // Initialize auth
    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      subscription.unsubscribe();
    };
  }, []);

  // Load initial posts when user is authenticated
  useEffect(() => {
    if (currentUser && authInitialized) {
      // Only load posts if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.warn('Supabase not configured - skipping post loading');
        return;
      }

      console.log('Loading posts for user:', currentUser.id);
      setLoading(true); // Set loading state while fetching posts
      
      getPosts({ limit: 20, offset: 0 })
        .then(posts => {
          console.log('Posts loaded successfully:', posts?.length || 0, 'posts');
          
          if (!posts || !Array.isArray(posts)) {
            console.warn('getPosts returned invalid data:', posts);
            setPosts([]);
            setHasMorePosts(false);
            setLoading(false);
            return;
          }
          
          // Transform posts to match expected format
          const transformedPosts = posts.map((post: any) => ({
            id: post.id,
            userId: post.user_id,
            content: post.content,
            timestamp: post.created_at,
            media_url: post.media_url || [], // Include media URLs for images
            likes: post.reactions?.filter((r: any) => r.reaction_type === 'like').map((r: any) => r.user_id) || [],
            comments: post.comments?.map((c: any) => ({
              id: c.id,
              userId: c.user_id,
              content: c.content,
              timestamp: c.created_at,
            })) || [],
            // Include user profile data for PostCard
            profiles: post.profiles,
          }));
          
          console.log('Transformed posts:', transformedPosts.length);
          setPosts(transformedPosts);
          setPostsOffset(20);
          setHasMorePosts(transformedPosts.length === 20);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading posts:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          // Set empty posts array on error to prevent blank screen
          setPosts([]);
          setHasMorePosts(false);
          setLoading(false); // CRITICAL: Always set loading to false on error
        });
    }
  }, [currentUser, authInitialized]);

  // Set up real-time subscription for new posts
  useEffect(() => {
    if (!currentUser || !isSupabaseConfigured()) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    try {
      channel = supabase
        .channel('posts_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'posts',
          },
          async (payload) => {
            try {
              // Fetch the complete post with user profile
              const { data: newPost, error } = await supabase
                .from('posts')
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
                .eq('id', payload.new.id)
                .single();

              if (error) {
                console.error('Error fetching new post in real-time subscription:', error);
                return;
              }

              if (newPost && newPost.user_id !== currentUser.id) {
                // Only add if it's not the current user's post (already added optimistically)
                setPosts(prev => [{
                  id: newPost.id,
                  userId: newPost.user_id,
                  content: newPost.content,
                  timestamp: newPost.created_at,
                  media_url: newPost.media_url || [],
                  likes: [],
                  comments: [],
                  profiles: newPost.profiles,
                }, ...prev]);
              }
            } catch (err) {
              console.error('Error in real-time subscription callback:', err);
            }
          }
        )
        .subscribe();

      // Handle subscription errors
      channel.on('error', (error) => {
        console.error('Real-time subscription error:', error);
      });
    } catch (err) {
      console.error('Error setting up real-time subscription:', err);
    }

    return () => {
      if (channel) {
        try {
          channel.unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from real-time channel:', err);
        }
      }
    };
  }, [currentUser]);

  const register = async (data: RegisterData) => {
    await registerUser(data);
  };

  const loginUser = async (data: LoginData) => {
    try {
      setLoading(true);
      const result = await login(data.email, data.password);
      if (result?.user) {
        // Try to load full profile immediately
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.user.id)
          .single();
        
        if (profileError) {
          console.error('Error loading profile after login:', profileError);
          // Use basic user data if profile fetch fails
          setCurrentUser(result.user);
        } else {
          setCurrentUser(profile);
        }
        // Auth state listener will also update, but we set immediately for better UX
      } else {
        throw new Error('Login failed - no user returned');
      }
    } catch (error) {
      console.error('Login error:', error);
      setCurrentUser(null);
      throw error; // Re-throw so LoginPage can handle it
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateProfile = async (userId: string, data: ProfileUpdateData) => {
    try {
      // Update the user in the users array
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, ...data } : user
        )
      );
      
      // Update current user if it's their profile
      if (currentUser && userId === currentUser.id) {
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => {
    if (!currentUser) return;

    // Optimistic UI update
    const tempPost: Post = {
      id: `temp-${Date.now()}`,
      ...postData,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    setPosts(prev => [tempPost, ...prev]);

    try {
      // Create post in database
      const { post } = await createPost({
        userId: currentUser.id,
        content: postData.content,
      });

      // Replace temp post with real post (transform database format)
      setPosts(prev =>
        prev.map(p => p.id === tempPost.id ? {
          id: post.id,
          userId: post.user_id,
          content: post.content,
          timestamp: post.created_at,
          media_url: post.media_url || [],
          likes: [],
          comments: [],
          profiles: post.profiles || currentUser,
        } : p)
      );
    } catch (error) {
      // Revert optimistic update on error
      setPosts(prev => prev.filter(p => p.id !== tempPost.id));
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const editPost = async (postId: string, content: string) => {
    if (!currentUser) return;

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => p.id === postId ? { ...p, content } : p)
    );

    try {
      await updatePost(postId, currentUser.id, { content });
    } catch (error) {
      // Revert on error (would need to store old content for proper revert)
      console.error('Error updating post:', error);
      throw error;
    }
  };

  const removePost = async (postId: string) => {
    if (!currentUser) return;

    // Optimistic UI update
    setPosts(prev => prev.filter(p => p.id !== postId));

    try {
      await deletePost(postId, currentUser.id);
    } catch (error) {
      // Could revert on error
      console.error('Error deleting post:', error);
      throw error;
    }
  };

  const loadMorePosts = async () => {
    if (!hasMorePosts || !currentUser) return;

    try {
      const morePosts = await getPosts({ limit: 20, offset: postsOffset });
      
      const transformedPosts = morePosts.map((post: any) => ({
        id: post.id,
        userId: post.user_id,
        content: post.content,
        timestamp: post.created_at,
        media_url: post.media_url || [],
        likes: post.reactions?.filter((r: any) => r.reaction_type === 'like').map((r: any) => r.user_id) || [],
        comments: post.comments?.map((c: any) => ({
          id: c.id,
          userId: c.user_id,
          content: c.content,
          timestamp: c.created_at,
        })) || [],
        profiles: post.profiles,
      }));

      setPosts(prev => [...prev, ...transformedPosts]);
      setPostsOffset(prev => prev + 20);
      setHasMorePosts(transformedPosts.length === 20);
    } catch (error) {
      console.error('Error loading more posts:', error);
    }
  };

  const addComment = async (postId: string, commentData: { userId: string; content: string; giphyId?: string; giphyUrl?: string }) => {
    if (!currentUser) return;
    
    try {
      // Call the API to create the comment in Supabase
      const { comment } = await createComment({
        postId,
        userId: commentData.userId,
        content: commentData.content,
        giphyId: commentData.giphyId,
        giphyUrl: commentData.giphyUrl,
      });

      // Update local state with the new comment
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
      // Optionally show error to user
    }
  };

  const editComment = async (postId: string, commentId: string, content: string) => {
    if (!currentUser) return;
    
    try {
      // Call the API to update the comment in Supabase
      const { comment: updatedComment } = await updateComment(commentId, currentUser.id, { content });

      // Update local state with the updated comment
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.map(comment =>
                comment.id === commentId ? updatedComment : comment
              )
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error editing comment:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const removeComment = async (postId: string, commentId: string) => {
    if (!currentUser) return;
    
    try {
      // Call the API to delete the comment from Supabase
      await deleteComment(commentId, currentUser.id);

      // Update local state by removing the comment
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment.id !== commentId)
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error; // Re-throw so the UI can handle it
    }
  };

  const toggleLike = (postId: string) => {
    if (!currentUser) return;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const likes = post.likes.includes(currentUser.id)
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id];
          return { ...post, likes };
        }
        return post;
      })
    );
  };

  const toggleReaction = async (postId: string, reactionType: ReactionType) => {
    if (!currentUser) return;

    try {
      // Find the post to check current user's reaction
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      // Check if user already has this reaction type
      const existingReaction = post.reactions?.find(
        (r: any) => r.user_id === currentUser.id
      );

      if (existingReaction && existingReaction.reaction_type === reactionType) {
        // Same reaction - remove it (toggle off)
        await removeReaction({
          postId,
          userId: currentUser.id,
        });

        // Optimistically update UI
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p.id === postId) {
              return {
                ...p,
                reactions: p.reactions?.filter((r: any) => r.user_id !== currentUser.id) || [],
              };
            }
            return p;
          })
        );
      } else {
        // Different reaction or no reaction - add/update it
        await addReaction({
          postId,
          userId: currentUser.id,
          type: reactionType,
        });

        // Optimistically update UI
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p.id === postId) {
              const otherReactions = p.reactions?.filter((r: any) => r.user_id !== currentUser.id) || [];
              return {
                ...p,
                reactions: [
                  ...otherReactions,
                  {
                    id: `temp-${Date.now()}`,
                    post_id: postId,
                    user_id: currentUser.id,
                    reaction_type: reactionType,
                    created_at: new Date().toISOString(),
                  },
                ],
              };
            }
            return p;
          })
        );
      }
      // Optimistic update already applied above - no need to refresh
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      // On error, we could refresh posts, but for now just log it
      // The optimistic update may be incorrect but won't break the UI
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadNotificationsCount = notifications.filter(notification => !notification.read).length;

  // Check session status periodically to ensure isAuthenticated is accurate
  // This is a backup check - the auth state listener is the primary source
  useEffect(() => {
    if (!isSupabaseConfigured() || !authInitialized) return;
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && !hasSession) {
          setHasSession(true);
        } else if (!session?.user && hasSession) {
          setHasSession(false);
        }
      } catch (err) {
        console.error('Error checking session for auth status:', err);
      }
    };
    
    // Check less frequently - every 3 seconds, only as backup
    const interval = setInterval(checkSession, 3000);
    return () => clearInterval(interval);
  }, [authInitialized, hasSession]);

  // Create value object with useMemo to ensure new reference when loading/auth state changes
  // This guarantees React Context will trigger re-renders in consuming components
  const value = useMemo(() => ({
    currentUser,
    users,
    posts,
    groups,
    messages,
    notifications,
    unreadNotificationsCount,
    isAuthenticated: Boolean(currentUser) || hasSession, // Check both currentUser and session
    loading, // Critical: when this changes, useMemo creates new object reference
    authInitialized,
    authLoading: !authInitialized,
    setCurrentUser,
    register,
    login: loginUser,
    logout,
    updateProfile,
    addPost,
    editPost,
    removePost,
    loadMorePosts,
    hasMorePosts,
    addComment,
    editComment,
    removeComment,
    toggleLike,
    toggleReaction,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  }), [
    // Dependencies that should trigger re-render
    currentUser,
    hasSession,
    loading, // CRITICAL: This ensures value object changes when loading changes
    authInitialized, // Also include this to ensure re-render when auth completes
    users,
    posts,
    groups,
    messages,
    notifications,
    unreadNotificationsCount,
    hasMorePosts,
    // Functions are stable, don't need to be in deps
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
