import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';

// Suppress console errors during tests (optional)
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

