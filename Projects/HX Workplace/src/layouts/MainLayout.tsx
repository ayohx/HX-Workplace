import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import { useAppContext } from '../contexts/AppContext';
import { supabase } from '../lib/supabase';

const MainLayout: React.FC = () => {
  const { currentUser, loading } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // No valid session, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking auth or loading user data
  if (checking || loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If still no user after loading, redirect
  if (!currentUser) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile sidebar (overlay) */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div 
              className="fixed inset-0 bg-black/50 transition-opacity" 
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 animate-slide-up">
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 p-4 md:px-8 md:py-6">
          <Outlet />
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default MainLayout;