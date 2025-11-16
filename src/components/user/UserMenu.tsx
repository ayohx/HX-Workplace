import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface UserMenuProps {
  user: any;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout } = useAppContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { icon: <User size={16} />, label: 'View Profile', path: '/profile' },
    { icon: <Settings size={16} />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle size={16} />, label: 'Help & Support', path: '/help' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-1 p-1 hover:bg-neutral-100 rounded-full transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={user.avatar} 
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <ChevronDown 
          size={14} 
          className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-dropdown border border-neutral-200 overflow-hidden z-50 animate-fade-in">
          <div className="p-4 border-b border-neutral-100">
            <div className="flex items-center">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                <p className="text-xs text-neutral-500">{user.role}</p>
              </div>
            </div>
          </div>

          <ul className="py-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3 text-neutral-500">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
              >
                <span className="mr-3 text-neutral-500"><LogOut size={16} /></span>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;