/**
 * Unit Tests for Authentication API Functions
 * 
 * Tests cover login, register, logout, and profile update operations
 * using Supabase client with mocked responses.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, updateProfile } from './api';
import { supabase } from './supabase';

// Mock the Supabase client
vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(),
          })),
        })),
      })),
    })),
  },
}));

describe('Authentication API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'sarah.johnson@holidayextras.com',
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      } as any);

      const result = await login('sarah.johnson@holidayextras.com', 'Test123!');

      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'sarah.johnson@holidayextras.com',
        password: 'Test123!',
      });
    });

    it('should throw error with invalid credentials', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' } as any,
      } as any);

      await expect(
        login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid login credentials');
    });

    it('should handle network errors gracefully', async () => {
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Network error' } as any,
      } as any);

      await expect(
        login('user@example.com', 'password')
      ).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'newuser@holidayextras.com',
      };

      const mockProfile = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'New User',
        email: 'newuser@holidayextras.com',
        role: 'Developer',
        department: 'Engineering',
        avatar: 'https://example.com/avatar.jpg',
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn(() => ({
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const result = await register({
        email: 'newuser@holidayextras.com',
        password: 'Test123!',
        name: 'New User',
        role: 'Developer',
        department: 'Engineering',
        avatar: 'https://example.com/avatar.jpg',
      });

      expect(result.user).toEqual(mockProfile);
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'User already registered' } as any,
      } as any);

      await expect(
        register({
          email: 'existing@holidayextras.com',
          password: 'Test123!',
          name: 'Existing User',
          role: 'Developer',
          department: 'Engineering',
        })
      ).rejects.toThrow('User already registered');
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      } as any);

      await expect(logout()).resolves.not.toThrow();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle logout errors gracefully', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: { message: 'Logout failed' } as any,
      } as any);

      await expect(logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const updates = {
        name: 'Updated Name',
        bio: 'Updated bio',
      };

      const mockProfile = {
        id: userId,
        name: 'Updated Name',
        bio: 'Updated bio',
        email: 'user@example.com',
      };

      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
            })),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const result = await updateProfile(userId, updates);

      expect(result).toEqual(mockProfile);
    });

    it('should throw error if profile update fails', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      const mockFrom = vi.fn(() => ({
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' } as any,
              }),
            })),
          })),
        })),
      }));

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      await expect(updateProfile(userId, { name: 'New Name' })).rejects.toThrow(
        'Update failed'
      );
    });
  });
});

