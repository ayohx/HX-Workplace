import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileNav from '../components/layout/MobileNav';
import { useAppContext } from '../contexts/AppContext';

const MainLayout: React.FC = () => {
  const { currentUser } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <div>Loading...</div>;
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