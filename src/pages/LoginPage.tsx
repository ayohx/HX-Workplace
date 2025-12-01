import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppContext } from '../contexts/AppContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { login, currentUser, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated (check Supabase session directly)
  useEffect(() => {
    let isChecking = false;
    
    const checkExistingAuth = async () => {
      // Prevent multiple simultaneous checks
      if (isChecking) return;
      isChecking = true;
      
      // Don't redirect while submitting
      if (isSubmitting) {
        isChecking = false;
        return;
      }
      
      try {
        // Check Supabase session directly - this is the source of truth
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          isChecking = false;
          return;
        }
        
        if (session?.user) {
          console.log('User already authenticated, redirecting to dashboard...', session.user.id);
          navigate('/', { replace: true });
          return;
        }
      } catch (err) {
        console.error('Exception checking session:', err);
      } finally {
        isChecking = false;
      }
    };
    
    // Check immediately
    checkExistingAuth();
    
    // Also check multiple times to catch auth state updates
    const timeouts = [
      setTimeout(() => checkExistingAuth(), 300),
      setTimeout(() => checkExistingAuth(), 800),
      setTimeout(() => checkExistingAuth(), 1500),
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isSubmitting, navigate]);
  
  // Separate effect to handle navigation when context state updates
  useEffect(() => {
    if (isAuthenticated && currentUser && !isSubmitting) {
      console.log('Auth state updated, navigating to dashboard...');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, isSubmitting]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.');
        return;
      }
      
      console.log('Login form submitted for:', data.email);
      
      // Call login with only email and password (ignore rememberMe for now)
      await login({ email: data.email, password: data.password });
      
      console.log('Login function completed successfully');
      
      // Wait for auth state to update and currentUser to be set
      // Check multiple times with increasing delays to handle async state updates
      let attempts = 0;
      const maxAttempts = 15; // Increased attempts for more reliable navigation
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Check both session and context state
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // If we have a session, check if context has updated
          if (isAuthenticated || currentUser) {
            console.log('Session and user state confirmed, navigating...');
            navigate('/', { replace: true });
            return;
          }
          // If session exists but context hasn't updated yet, wait a bit more
          if (attempts >= 5) {
            // After 5 attempts (750ms), navigate anyway if session exists
            console.log('Session exists, navigating (context may update after)...');
            navigate('/', { replace: true });
            return;
          }
        }
        
        attempts++;
      }
      
      // Final check - if session exists, navigate regardless
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('Session exists, navigating (final check)...');
        navigate('/', { replace: true });
      } else {
        throw new Error('Login completed but session not found');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle specific Supabase error codes
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Invalid')) {
        setError('The email or password you entered is incorrect. Please try again.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email to confirm your account before logging in.');
      } else if (err.message?.includes('Supabase')) {
        setError(err.message);
      } else {
        setError(err.message || 'An error occurred while signing in. Please try again.');
      }
    }
  };

  const justRegistered = location.state?.registered;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-center mb-6">Sign in to your account</h2>
      
      {justRegistered && (
        <div className="mb-6 p-4 bg-success-500/10 text-success-500 rounded-lg flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2" />
          <p>Registration successful! Please sign in with your credentials.</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-error-500/10 text-error-500 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="you@holidayextras.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs text-primary-600 hover:text-primary-700">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-primary-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray-500" />
              ) : (
                <Eye size={20} className="text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-error-500">{errors.password.message}</p>
          )}
        </div>
        
        <div className="flex items-center mb-6">
          <input
            {...register('rememberMe')}
            type="checkbox"
            className="h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;