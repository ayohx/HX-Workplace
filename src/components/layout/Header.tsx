import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, X } from 'lucide-react';
import { CompanyLogo } from '../common/CompanyLogo';
import { useAppContext } from '../../contexts/AppContext';
import NotificationsDropdown from '../notifications/NotificationsDropdown';
import UserMenu from '../user/UserMenu';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { currentUser, unreadNotificationsCount } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button 
              className="mr-4 p-2 rounded-full hover:bg-neutral-100 md:hidden"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-neutral-600" />
            </button>
            
            <Link to="/" className="flex items-center">
              <CompanyLogo className="h-8 w-auto mr-2" />
              <span className="font-display font-semibold text-primary-600 text-lg hidden sm:block">
                Workplace
              </span>
            </Link>
          </div>

          {/* Middle section - Search (desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 bg-neutral-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-1">
            {/* Search icon (mobile) */}
            <button 
              className="p-2 rounded-full hover:bg-neutral-100 md:hidden"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              {showSearch ? (
                <X className="h-5 w-5 text-neutral-600" />
              ) : (
                <Search className="h-5 w-5 text-neutral-600" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-neutral-100 relative"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-neutral-600" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-medium text-white">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User menu */}
            <UserMenu user={currentUser} />
          </div>
        </div>

        {/* Mobile search (expandable) */}
        {showSearch && (
          <div className="py-2 px-4 md:hidden animate-fade-in">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="search"
                className="block w-full pl-10 pr-3 py-2 bg-neutral-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-primary-300 focus:ring-1 focus:ring-primary-300"
                placeholder="Search..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;