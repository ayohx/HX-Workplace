/**
 * Database Type Definitions
 * Generated for HX Workplace Supabase Schema
 * 
 * These types match the database schema defined in:
 * supabase/migrations/20251115000000_complete_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string // uuid, foreign key to auth.users
          name: string
          avatar: string | null
          cover_image: string | null
          role: string | null
          department: string | null
          email: string | null
          bio: string | null
          location: string | null
          phone: string | null
          linkedin: string | null
          manager_id: string | null // uuid, foreign key to profiles
          settings: Json | null
          created_at: string // timestamptz
          updated_at: string | null // timestamptz
        }
        Insert: {
          id: string
          name: string
          avatar?: string | null
          cover_image?: string | null
          role?: string | null
          department?: string | null
          email?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          linkedin?: string | null
          manager_id?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          avatar?: string | null
          cover_image?: string | null
          role?: string | null
          department?: string | null
          email?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          linkedin?: string | null
          manager_id?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string // uuid
          user_id: string // uuid, foreign key to profiles
          content: string
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string // uuid
          post_id: string // uuid, foreign key to posts
          user_id: string // uuid, foreign key to profiles
          content: string
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      reactions: {
        Row: {
          id: string // uuid
          post_id: string // uuid, foreign key to posts
          user_id: string // uuid, foreign key to profiles
          reaction_type: 'like' | 'love' | 'celebrate' | 'insightful' | 'curious'
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          reaction_type: 'like' | 'love' | 'celebrate' | 'insightful' | 'curious'
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          reaction_type?: 'like' | 'love' | 'celebrate' | 'insightful' | 'curious'
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string // uuid
          name: string
          description: string | null
          cover_image: string | null
          privacy: 'public' | 'private' | 'secret'
          created_by: string | null // uuid, foreign key to profiles
          created_at: string // timestamptz
          updated_at: string // timestamptz
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cover_image?: string | null
          privacy?: 'public' | 'private' | 'secret'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cover_image?: string | null
          privacy?: 'public' | 'private' | 'secret'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string // uuid, foreign key to groups
          user_id: string // uuid, foreign key to profiles
          role: 'admin' | 'moderator' | 'member'
          joined_at: string // timestamptz
        }
        Insert: {
          group_id: string
          user_id: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: 'admin' | 'moderator' | 'member'
          joined_at?: string
        }
      }
      conversations: {
        Row: {
          id: string // uuid
          is_group: boolean
          name: string | null
          created_at: string // timestamptz
          updated_at: string // timestamptz
        }
        Insert: {
          id?: string
          is_group?: boolean
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_group?: boolean
          name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          conversation_id: string // uuid, foreign key to conversations
          user_id: string // uuid, foreign key to profiles
          joined_at: string // timestamptz
        }
        Insert: {
          conversation_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string // uuid
          conversation_id: string // uuid, foreign key to conversations
          sender_id: string // uuid, foreign key to profiles
          content: string
          is_read: boolean
          created_at: string // timestamptz
          updated_at: string // timestamptz
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string // uuid
          user_id: string // uuid, foreign key to profiles
          type: 'post_like' | 'post_reaction' | 'post_comment' | 'comment_reply' | 
                'mention' | 'group_invite' | 'group_post' | 'message' | 'follow'
          content: string
          reference_id: string | null // uuid
          is_read: boolean
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          user_id: string
          type: 'post_like' | 'post_reaction' | 'post_comment' | 'comment_reply' | 
                'mention' | 'group_invite' | 'group_post' | 'message' | 'follow'
          content: string
          reference_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'post_like' | 'post_reaction' | 'post_comment' | 'comment_reply' | 
                 'mention' | 'group_invite' | 'group_post' | 'message' | 'follow'
          content?: string
          reference_id?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']
export type CommentUpdate = Database['public']['Tables']['comments']['Update']

export type Reaction = Database['public']['Tables']['reactions']['Row']
export type ReactionInsert = Database['public']['Tables']['reactions']['Insert']
export type ReactionUpdate = Database['public']['Tables']['reactions']['Update']
export type ReactionType = Reaction['reaction_type']

export type Group = Database['public']['Tables']['groups']['Row']
export type GroupInsert = Database['public']['Tables']['groups']['Insert']
export type GroupUpdate = Database['public']['Tables']['groups']['Update']

export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert']
export type GroupMemberUpdate = Database['public']['Tables']['group_members']['Update']

export type Conversation = Database['public']['Tables']['conversations']['Row']
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert']
export type ConversationUpdate = Database['public']['Tables']['conversations']['Update']

export type ConversationParticipant = Database['public']['Tables']['conversation_participants']['Row']
export type ConversationParticipantInsert = Database['public']['Tables']['conversation_participants']['Insert']
export type ConversationParticipantUpdate = Database['public']['Tables']['conversation_participants']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type MessageUpdate = Database['public']['Tables']['messages']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']
export type NotificationType = Notification['type']

// Settings type for profiles.settings JSONB column
export interface ProfileSettings {
  notifications: {
    email: boolean
    push: boolean
    mentions: boolean
    comments: boolean
    likes: boolean
  }
  privacy: {
    profileVisibility: 'everyone' | 'connections' | 'private'
    showEmail: boolean
    showPhone: boolean
    allowMessages: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    timezone: string
  }
}

