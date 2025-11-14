import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPost, login, register as registerUser, logout as logoutUser, updateProfile as updateUserProfile } from '../lib/api';
import { mockGroups, mockMessages, mockUsers, mockPosts } from '../data/mockData';

interface User {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  role: string;
  department: string;
  email?: string;
  bio?: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  managerId?: string | null;
  directReports?: string[];
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      mentions: boolean;
      comments: boolean;
      likes: boolean;
    };
    privacy: {
      profileVisibility: string;
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
    };
    preferences: {
      theme: string;
      language: string;
      timezone: string;
    };
  };
}

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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [groups] = useState<Group[]>(mockGroups);
  const [messages] = useState<Message[]>(mockMessages);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

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