import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  createPost, 
  login, 
  register as registerUser, 
  logout as logoutUser, 
  updateProfile as updateUserProfile,
  getPosts 
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
  setCurrentUser: (user: User | null) => void;
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userId: string, data: ProfileUpdateData) => Promise<void>;
  addPost: (postData: Omit<Post, 'id' | 'timestamp' | 'likes' | 'comments'>) => Promise<void>;
  addComment: (postId: string, content: string) => void;
  toggleLike: (postId: string) => void;
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
  const [loading, setLoading] = useState(true); // Start with loading true
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Load user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error loading profile:', error);
            } else {
              setCurrentUser(profile);
            }
            setLoading(false);
            setAuthInitialized(true);
          });
      } else {
        setLoading(false);
        setAuthInitialized(true);
      }
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session?.user) {
        // Load user profile on sign in
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading profile after sign in:', error);
        } else {
          setCurrentUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setPosts([]);
        setUsers([]);
        setNotifications([]);
      } else if (event === 'USER_UPDATED' && session?.user) {
        // Reload profile on user update
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setCurrentUser(profile);
        }
      }

      setLoading(false);
      setAuthInitialized(true);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load posts when user is authenticated
  useEffect(() => {
    if (currentUser && authInitialized) {
      getPosts()
        .then(posts => {
          // Transform posts to match expected format
          setPosts(posts.map((post: any) => ({
            id: post.id,
            userId: post.user_id,
            content: post.content,
            timestamp: post.created_at,
            likes: post.reactions?.filter((r: any) => r.reaction_type === 'like').map((r: any) => r.user_id) || [],
            comments: post.comments?.map((c: any) => ({
              id: c.id,
              userId: c.user_id,
              content: c.content,
              timestamp: c.created_at,
            })) || [],
          })));
        })
        .catch(error => console.error('Error loading posts:', error));
    }
  }, [currentUser, authInitialized]);

  const register = async (data: RegisterData) => {
    await registerUser(data);
  };

  const loginUser = async (data: LoginData) => {
    const { user } = await login(data.email, data.password);
    setCurrentUser(user);
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
    const { post } = await createPost(postData);
    setPosts(prev => [post, ...prev]);
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      content,
      timestamp: new Date().toISOString()
    };

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
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

  const value = {
    currentUser,
    users,
    posts,
    groups,
    messages,
    notifications,
    unreadNotificationsCount,
    isAuthenticated: Boolean(currentUser),
    loading,
    setCurrentUser,
    register,
    login: loginUser,
    logout,
    updateProfile,
    addPost,
    addComment,
    toggleLike,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};