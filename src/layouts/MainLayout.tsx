import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import { useAppContext } from '../contexts/AppContext';

const MainLayout: React.FC = () => {
  const { currentUser, authLoading, isAuthenticated } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading spinner while:
  // 1. Auth is still initializing (authLoading)
  // 2. OR user is authenticated but profile hasn't loaded yet (isAuthenticated but no currentUser)
  if (authLoading || (isAuthenticated && !currentUser)) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Safety check: If not authenticated and no currentUser, ProtectedRoute will redirect
  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen bg-neutral-50 flex flex-col overflow-hidden">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar - fixed height with independent scroll */}
        <div className="hidden md:block flex-shrink-0">
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
        
        {/* Main content - fixed height with independent scroll */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:py-6">
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